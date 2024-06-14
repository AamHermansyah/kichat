import { getCurrentUserProfile } from "@/data/user";
import { NextResponse } from "next/server";

import { prisma } from "@/db";
import { auth } from "@/auth";
import { pusherServer } from "@/utils/pusher";

interface IParams {
  conversationId?: string;
};

export async function POST(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { conversationId } = params;
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const currentUser = await getCurrentUserProfile(session.user.id!);

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Find the existing conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          include: {
            seenMessages: {
              include: {
                user: true
              }
            }
          }
        },
        users: true,
      }
    });

    if (!conversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    // Find the last message
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    // Upsert userSeenMessage
    await prisma.userSeenMessage.upsert({
      where: {
        userId_messageId: {
          userId: currentUser.id,
          messageId: lastMessage.id
        }
      },
      update: {},
      create: {
        userId: currentUser.id,
        messageId: lastMessage.id
      }
    });

    const updatedMessage = await prisma.message.findUnique({
      where: {
        id: lastMessage.id
      },
      include: {
        sender: true,
        seenMessages: {
          include: {
            user: true
          }
        }
      }
    });

    if (!updatedMessage) {
      return new NextResponse('Not found', { status: 404 });
    }

    await pusherServer.trigger(currentUser.email, 'conversation:update', {
      id: conversationId,
      messages: [updatedMessage]
    });

    if (lastMessage.seenMessages.some((seenData) => seenData.userId === currentUser.id)) {
      return NextResponse.json(conversation);
    }

    await pusherServer.trigger(conversationId!, 'message:update', updatedMessage);

    return NextResponse.json(updatedMessage);
  } catch (error: any) {
    console.log(error, 'ERROR_MESSAGES_SEEN');
    return new NextResponse("Internal Error", { status: 500 });
  }
}