import { auth } from "@/auth";
import { getAllUsers, getCurrentUserProfile } from "@/data/user";
import { prisma } from "@/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const keyword = searchParams.get('q');

  try {
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const currentUser = await getCurrentUserProfile(session.user.id!);

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const users = await getAllUsers(currentUser.id, keyword);

    return NextResponse.json(users);
  } catch (error: any) {
    console.log(error, 'ACCEPT_FRIEND');
    return new NextResponse('Internal Error', { status: 500 });
  }
} 