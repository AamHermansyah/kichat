"use client";

import { Conversation, User, UserConversation } from "@prisma/client";

import useOtherUser from "@/hooks/useOtherUser";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, CircleHelp, Ellipsis, Settings2 } from "lucide-react";
import Avatar from "@/components/core/avatar";
import AvatarGroup from "@/components/core/avatar-group";

import ProfileDrawer from "./profile-drawer";
import useActiveList from "@/hooks/useActiveList";
import { Session } from "next-auth";
import useSecretFeatures from "@/hooks/useSecretFeatures";
import SecretFeaturesModal from "./secret-features-modal";
import HelpModal from "./help-modal";

interface HeaderProps {
  conversation: Conversation & {
    users: (
      UserConversation & {
        user: User
      }
    )[]
  };
  profile: Session['user'];
};

const Header: React.FC<HeaderProps> = ({ conversation, profile }) => {
  const currentConversation = {
    ...conversation,
    users: conversation.users.map((item) => item.user)
  };

  const otherUser = useOtherUser(currentConversation, profile);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [secretFeaturesOpen, setSecretFeaturesOpen] = useState(false);
  const [helpModal, setHelpModal] = useState(false);

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const { showConfigButton, hiddenHelpButton, setHiddenButton } = useSecretFeatures();

  const statusText = useMemo(() => {
    if (currentConversation.isGroup) {
      return `${currentConversation.users.length} members`;
    }

    return isActive ? 'Active' : 'Offline';
  }, [currentConversation, isActive]);

  useEffect(() => {
    const helpButtonValue = localStorage.getItem('d-help-btn');
    const isShowHelpButton = helpButtonValue === 'true' ? true : false;

    setHiddenButton(isShowHelpButton);
  }, []);

  return (
    <>
      <ProfileDrawer
        data={currentConversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        profile={profile}
      />
      <SecretFeaturesModal
        isOpen={secretFeaturesOpen}
        onClose={() => setSecretFeaturesOpen(false)}
      />
      <HelpModal
        isOpen={helpModal}
        onClose={() => setHelpModal(false)}
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
              text-gray-500
              hover:text-gray-600
              transition
              cursor-pointer
            "
            href="/conversations"
          >
            <ChevronLeft size={24} />
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
        <div className="flex gap-4 items-center">
          {!hiddenHelpButton && (
            <CircleHelp
              size={24}
              onClick={() => setHelpModal(true)}
              className="
              text-purple-500
              cursor-pointer
              hover:text-purple-600
              transition
            "
            />
          )}
          {showConfigButton && (
            <Settings2
              size={24}
              onClick={() => setSecretFeaturesOpen(true)}
              className="
                text-purple-500
                cursor-pointer
                hover:text-purple-600
                transition
              "
            />
          )}
          <Ellipsis
            size={24}
            onClick={() => setDrawerOpen(true)}
            className="
              text-gray-500
              cursor-pointer
              hover:text-gray-600
              transition
            "
          />
        </div>
      </div>
    </>
  );
}

export default Header;