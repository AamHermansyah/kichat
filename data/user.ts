import { auth } from "@/auth";
import { prisma } from "@/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    return user
  } catch (error) {
    return null;
  }
}

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    return user
  } catch (error) {
    return null
  }
}

export const getCurrentUserProfile = async (id: string) => {
  try {
    const currentUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (error) {
    return null;
  }
}

export const getFriendsById = async (id: string) => {
  try {
    const acceptedFriends = await prisma.user.findMany({
      where: {
        OR: [
          {
            sentFriendRequests: {
              some: {
                receiverId: id,
                status: 'ACCEPTED',
              },
            },
          },
          {
            receivedFriendRequests: {
              some: {
                senderId: id,
                status: 'ACCEPTED',
              },
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return acceptedFriends;
  } catch (error: any) {
    return [];
  }
};

export const getRequestFriends = async (id: string) => {
  try {
    const requestFriends = await prisma.user.findMany({
      where: {
        sentFriendRequests: {
          some: {
            receiverId: id,
            status: 'PENDING'
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return requestFriends;
  } catch (error: any) {
    return [];
  }
};

export const getAllUsers = async (id: string) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        AND: [
          {
            id: {
              not: id,
            },
          },
          {
            NOT: {
              OR: [
                {
                  sentFriendRequests: {
                    some: {
                      receiverId: id,
                      status: {
                        in: ['PENDING', 'ACCEPTED'],
                      },
                    },
                  },
                },
                {
                  receivedFriendRequests: {
                    some: {
                      senderId: id,
                      status: {
                        in: ['ACCEPTED'],
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      include: {
        receivedFriendRequests: {
          where: { senderId: id }
        }
      }
    });

    return users;
  } catch (error: any) {
    return [];
  }
};