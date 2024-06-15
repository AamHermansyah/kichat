import { auth } from "@/auth";
import { getCurrentUserProfile } from "@/data/user";
import { prisma } from "@/db";
import { pusherServer } from "@/utils/pusher";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { receiverId } = await request.json();
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const currentUser = await getCurrentUserProfile(session.user.id!);

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const receiveUser = await prisma.user.findUnique({
      where: { id: receiverId }
    });

    if (!receiveUser) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const newFriendRequest = await prisma.friendRequest.create({
      data: {
        senderId: currentUser.id,
        receiverId: receiveUser.id,
      },
    });

    pusherServer.trigger(receiverId, 'friend:count', currentUser.id);

    return NextResponse.json(newFriendRequest);
  } catch (error: any) {
    console.log(error, 'ADD_FRIEND');
    return new NextResponse('Internal Error', { status: 500 });
  }
} 