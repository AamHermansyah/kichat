import { auth } from "@/auth";
import { getCurrentUserProfile } from "@/data/user";
import { prisma } from "@/db";
import { pusherServer } from "@/utils/pusher";
import { NextResponse } from "next/server";

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
      userId,
      isGroup,
      members,
      name
    } = body;

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse('Invalid data', { status: 400 });
    }

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            create: [
              ...members.map((member: { value: string }) => ({
                user: { connect: { id: member.value } }
              })),
              {
                user: { connect: { id: currentUser.id } }
              }
            ]
          }
        },
        include: {
          users: {
            include: {
              user: true
            }
          }
        }
      });

      newConversation.users.forEach((data) => {
        if (data.user.email) {
          pusherServer.trigger(data.user.email, 'conversation:new', newConversation);
        }
      })

      return NextResponse.json(newConversation);
    }

    const exisitingConversations = await prisma.conversation.findMany({
      where: {
        AND: [
          {
            users: {
              some: {
                userId: currentUser.id
              }
            }
          },
          {
            users: {
              some: {
                userId: userId
              }
            }
          },
          {
            OR: [
              {
                isGroup: false
              },
              {
                isGroup: null
              }
            ]
          }
        ]
      },
      include: {
        users: {
          include: {
            user: true
          }
        }
      }
    });

    const singleConversation = exisitingConversations[0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          create: [
            {
              user: {
                connect: {
                  id: currentUser.id
                }
              }
            },
            {
              user: {
                connect: {
                  id: userId
                }
              }
            }
          ]
        }
      },
      include: {
        users: {
          include: {
            user: true
          }
        },
        messages: {
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

    newConversation.users.map((data) => {
      if (data.user.email) {
        pusherServer.trigger(data.user.email, 'conversation:new', newConversation);
      }
    })

    return NextResponse.json(newConversation);
  } catch (error: any) {
    console.log('CONVERSATION ERROR: ', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}