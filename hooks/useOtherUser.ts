import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";
import { Session } from "next-auth";

const useOtherUser = (conversation: FullConversationType | {
  users: User[]
}, profile: Session['user']): User => {
  let users: { users: User[] };

  // @ts-expect-error
  if (conversation?.messages) {
    users = {
      // @ts-expect-error
      users: conversation.users.map((user) => user.user)
    }
  } else {
    users = conversation as { users: User[] }
  }

  const otherUser = useMemo(() => {
    const currentUserEmail = profile?.email;

    const otherUser = users.users.filter((user) => user.email !== currentUserEmail);

    return otherUser[0];
  }, [profile?.email, users.users]);

  return otherUser;
};

export default useOtherUser;