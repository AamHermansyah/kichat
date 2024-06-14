import { Conversation, Message, User, UserConversation, UserSeenMessage } from "@prisma/client";

export interface Login {
  email: string;
  password: string;
}

export interface Register {
  name: string;
  email: string;
  password: string;
}

export type FullMessageType = Message & {
  sender: User,
  seenMessages: (
    UserSeenMessage & {
      user: User
    }
  )[]
};

export type FullConversationType = Conversation & {
  users: (
    UserConversation & {
      user: User
    }
  )[],
  messages: FullMessageType[],
};
