import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";

const useOtherUser = (conversation: FullConversationType | {
  users: User[]
}): User => {
  const session = useSession();
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
    const currentUserEmail = session?.data?.user?.email;

    const otherUser = users.users.filter((user) => user.email !== currentUserEmail);

    return otherUser[0];
  }, [session?.data?.user?.email, users.users]);

  return otherUser;
};

export default useOtherUser;