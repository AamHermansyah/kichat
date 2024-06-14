import { NextResponse } from "next/server";

import { prisma } from "@/db";
import { getCurrentUserProfile } from "@/data/user";
import { auth } from "@/auth";
import { cloudinary } from "@/data/cloudinary";
import { getPublicIdFromUrl } from "@/utils/helper";

export async function POST(
  request: Request
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const currentUser = await getCurrentUserProfile(session.user.id!);

    const body = await request.json();
    const {
      name,
      image
    } = body;

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const profile = await prisma.user.findUnique({
      where: {
        id: currentUser.id
      }
    });

    if (!!profile?.image && profile.image !== image) {
      await cloudinary.api.delete_resources([getPublicIdFromUrl(profile.image)])
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        image: image,
        name: name
      }
    });

    return NextResponse.json(updatedUser)
  } catch (error: any) {
    console.log(error, 'ERROR_SETTINGS');
    return new NextResponse('Internal Error', { status: 500 });
  }
}