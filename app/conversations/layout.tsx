import { auth } from "@/auth";
import Sidebar from "@/components/sidebar";
import getConversations from "@/data/conversation";
import { getFriendsById } from "@/data/user";
import ConversationList from "./_components/conversation-list";
import { SessionProvider } from "next-auth/react";

export default async function ConversationsLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  const conversations = await getConversations(session?.user?.id!);
  const users = await getFriendsById(session?.user?.id!);

  return (
    <Sidebar userId={session?.user?.id!}>
      <div className="h-full">
        <SessionProvider>
          <ConversationList
            users={users}
            initialItems={conversations}
          />
        </SessionProvider>
        {children}
      </div>
    </Sidebar>
  )
};