import { auth } from "@/auth";
import { hideSecretMessage } from "@/utils/stegcloack";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { payload } = await request.json();
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
      const result = await hideSecretMessage(payload);

      return NextResponse.json(result, { status: 200 });
    } catch (error) {
      return NextResponse.json('Pesan biasa minimal 2 kata', { status: 400 });
    }
  } catch (error: any) {
    console.log(error, 'ACCEPT_FRIEND');
    return new NextResponse('Internal Error', { status: 500 });
  }
} 