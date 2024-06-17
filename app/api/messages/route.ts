import { getCurrentUserProfile } from "@/data/user";
import { NextResponse } from "next/server";
import { prisma } from "@/db";
import { auth } from "@/auth";
import { pusherServer } from "@/utils/pusher";

export async function POST(
  request: Request
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const currentUser = await getCurrentUserProfile(session.user.id!);

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const {
      message,
      image,
      conversationId,
      isContainSecret
    } = body;


    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        isContainSecret: isContainSecret ? true : false,
        conversation: {
          connect: {
            id: conversationId
          }
        },
        sender: {
          connect: {
            id: currentUser.id
          }
        }
      }
    });

    await prisma.userSeenMessage.create({
      data: {
        userId: currentUser.id,
        messageId: newMessage.id
      }
    });

    const fullMessage = await prisma.message.findUnique({
      where: {
        id: newMessage.id
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

    if (!fullMessage) {
      return new NextResponse('Not found', { status: 404 });
    }

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id
          }
        }
      },
      include: {
        users: {
          include: {
            user: true
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          include: {
            sender: true,
            seenMessages: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    await pusherServer.trigger(conversationId, 'messages:new', fullMessage);

    const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

    updatedConversation.users.map((data) => {
      pusherServer.trigger(data.user.email!, 'conversation:update', {
        id: conversationId,
        messages: [lastMessage]
      })
    });

    return NextResponse.json(fullMessage);
  } catch (error: any) {
    console.log(error, 'ERROR_MESSAGES');
    return new NextResponse('InternalError', { status: 500 });
  }
}