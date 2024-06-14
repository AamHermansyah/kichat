import { getCurrentUserProfile } from "@/data/user";
import { NextResponse } from "next/server";
import { prisma } from "@/db";
import { auth } from "@/auth";
import { getPublicIdFromUrl } from "@/utils/helper";
import { cloudinary } from "@/data/cloudinary";
import { pusherServer } from "@/utils/pusher";

interface IParams {
  conversationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { conversationId } = params;
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const currentUser = await getCurrentUserProfile(session.user.id!);

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: {
          include: {
            user: true
          }
        }
      }
    });

    if (!existingConversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    // Hapus entri di tabel UserSeenMessage yang terkait dengan pesan dalam percakapan
    await prisma.userSeenMessage.deleteMany({
      where: {
        message: {
          conversationId: conversationId
        }
      }
    });

    // Untuk menghapus image di cloudinary
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
        image: {
          not: null
        }
      }
    });

    if (messages.length > 0) {
      const publicIdsCloudinary = messages.map((message) => getPublicIdFromUrl(message.image!));

      // Hapus image di cloudinary
      await cloudinary.api.delete_resources(publicIdsCloudinary);
    }

    // Hapus entri di tabel Message yang terkait dengan percakapan
    await prisma.message.deleteMany({
      where: {
        conversationId: conversationId
      }
    });

    // Hapus entri di tabel UserConversation yang terkait dengan percakapan
    await prisma.userConversation.deleteMany({
      where: {
        conversationId: conversationId
      }
    });

    // Setelah itu, hapus percakapan itu sendiri
    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        users: {
          some: {
            userId: currentUser.id
          }
        }
      }
    });

    existingConversation.users.forEach((data) => {
      if (data.user.email) {
        pusherServer.trigger(data.user.email, 'conversation:remove', existingConversation);
      }
    })

    return NextResponse.json(deletedConversation);
  } catch (error: any) {
    console.log(error, 'ERROR_CONVERSATION_DELETE');
    return new NextResponse('Internal Error', { status: 500 });
  }
} 