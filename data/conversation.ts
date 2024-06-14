import { prisma } from "@/db";

export const getConversationById = async (
  conversationId: string
) => {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: {
          include: {
            user: true
          }
        }
      }
    });

    return conversation;
  } catch (error: any) {
    return null;
  }
};

const getConversations = async (id: string) => {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc'
      },
      where: {
        users: {
          some: {
            userId: id
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

    return conversations;
  } catch (error: any) {
    return [];
  }
};

export default getConversations;