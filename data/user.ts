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

export const getUsersByCurrentUserProfile = async (email: string) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        NOT: {
          email
        }
      }
    });

    return users;
  } catch (error: any) {
    return [];
  }
};