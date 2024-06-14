import { getConversationById } from "@/data/conversation";
import getMessages from "@/data/message";
import EmptyState from "@/components/empty-state";

import Header from "./_components/header";
import Body from "./_components/body";
import Form from "./_components/form";
import { SessionProvider } from "next-auth/react";

interface IParams {
  conversationId: string;
};

const ConversationId = async ({ params }: { params: IParams }) => {
  const conversation = await getConversationById(params.conversationId);
  const messages = await getMessages(params.conversationId);

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <SessionProvider>
          <Header conversation={conversation} />
          <Body initialMessages={messages} />
          <Form />
        </SessionProvider>
      </div>
    </div>
  )
};

export default ConversationId;