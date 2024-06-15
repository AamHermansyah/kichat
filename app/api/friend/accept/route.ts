import { auth } from "@/auth";
import { getCurrentUserProfile } from "@/data/user";
import { prisma } from "@/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { senderId } = await request.json();
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const currentUser = await getCurrentUserProfile(session.user.id!);

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const senderUser = await prisma.user.findUnique({
      where: { id: senderId }
    });

    if (!senderUser) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const acceptFriendRequest = await prisma.friendRequest.updateMany({
      where: {
        senderId: senderUser.id,
        receiverId: currentUser.id,
        status: 'PENDING'
      },
      data: {
        status: 'ACCEPTED',
      },
    });

    return NextResponse.json(acceptFriendRequest);
  } catch (error: any) {
    console.log(error, 'ACCEPT_FRIEND');
    return new NextResponse('Internal Error', { status: 500 });
  }
} 