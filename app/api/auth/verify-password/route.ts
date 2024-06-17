import { auth } from "@/auth";
import { getCurrentUserProfile } from "@/data/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const currentUser = await getCurrentUserProfile(session.user.id!);

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const passwordsMatch = await bcrypt.compare(
      password as string,
      currentUser.hashedPassword,
    );

    if (passwordsMatch) {
      return NextResponse.json(currentUser, { status: 200 });
    }

    return NextResponse.json({ error: 'Password tidak sesuai' }, { status: 400 });
  } catch (error: any) {
    console.log(error, 'VERIFY_PASSWORD');
    return new NextResponse('Internal Error', { status: 500 });
  }
} 