"use client";

import { Conversation, User, UserConversation } from "@prisma/client";

import useOtherUser from "@/hooks/useOtherUser";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Ellipsis } from "lucide-react";
import Avatar from "@/components/core/avatar";
import AvatarGroup from "@/components/core/avatar-group";

import ProfileDrawer from "./profile-drawer";
import useActiveList from "@/hooks/useActiveList";

interface HeaderProps {
  conversation: Conversation & {
    users: (
      UserConversation & {
        user: User
      }
    )[]
  }
};

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const currentConversation = {
    ...conversation,
    users: conversation.users.map((item) => item.user)
  };

  const otherUser = useOtherUser(currentConversation);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const statusText = useMemo(() => {
    if (currentConversation.isGroup) {
      return `${currentConversation.users.length} members`;
    }

    return isActive ? 'Active' : 'Offline';
  }, [currentConversation, isActive]);

  return (
    <>
      <ProfileDrawer
        data={currentConversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div
        className="
          bg-white
          w-full
          flex
          border-b-[1px]
          sm:px-4
          py-3
          px-4
          lg:px-6
          justify-between
          items-center
          shadow-sm
        "
      >
        <div className="flex gap-3 items-center">
          <Link
            className="
              lg:hidden
              block
              text-purple-500
              hover:text-purple-600
              transition
              cursor-pointer
            "
            href="/conversations"
          >
            <ChevronLeft size={32} />
          </Link>
          {currentConversation.isGroup ? (
            <AvatarGroup users={currentConversation.users} />
          ) : (
            <Avatar user={otherUser} />
          )}
          <div className="flex flex-col">
            <div>
              {currentConversation.name || otherUser.name}
            </div>
            <div
              className="
                text-sm
                font-light
                text-neutral-500
              "
            >
              {statusText}
            </div>
          </div>
        </div>
        <Ellipsis
          size={32}
          onClick={() => setDrawerOpen(true)}
          className="
            text-purple-500
            cursor-pointer
            hover:text-purple-600
            transition
          "
        />
      </div>
    </>
  );
}

export default Header;