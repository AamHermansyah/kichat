import { auth } from "@/auth";
import { pusherServer } from "@/utils/pusher";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const formData = await request.formData();

  const socketId = formData.get('socket_id') as string;
  const channel = formData.get('channel_name') as string;
  const data = {
    user_id: session.user.email
  };

  const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

  return NextResponse.json(authResponse);
}