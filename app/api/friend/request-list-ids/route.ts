import { auth } from "@/auth";
import { getCurrentUserProfile } from "@/data/user";
import { prisma } from "@/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const currentUser = await getCurrentUserProfile(session.user.id!);

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const requestFriendsTotal = await prisma.user.findMany({
      where: {
        sentFriendRequests: {
          some: {
            receiverId: currentUser.id,
            status: 'PENDING'
          }
        }
      },
    });

    return NextResponse.json(requestFriendsTotal.map((user) => user.id), { status: 200 });
  } catch (error: any) {
    console.log(error, 'ACCEPT_FRIEND');
    return new NextResponse('Internal Error', { status: 500 });
  }
} 