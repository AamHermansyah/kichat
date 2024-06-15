"use client";

import useRoutes from "@/hooks/useRoutes";
import useConversation from "@/hooks/useConversation";
import MobileItem from "./mobile-item";
import { User } from "@prisma/client";
import { User as UserIcon } from "lucide-react";
import SettingsModal from "./setting-modal";
import { useState } from "react";
import useTotalFriendRequest from "@/hooks/useTotalFriendRequest";

interface MobileSidebarProps {
  currentUser: User
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ currentUser }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { requestFriends } = useTotalFriendRequest();
  const { isOpen } = useConversation();
  const routes = useRoutes();

  if (isOpen) {
    return null;
  }

  return (
    <>
      <SettingsModal
        currentUser={currentUser}
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
      />
      <div
        className="
          fixed
          justify-between
          w-full
          bottom-0
          z-40
          flex
          items-center
          bg-white
          border-t-[1px]
          lg:hidden
        "
      >
        <div className="w-full">
          <div
            onClick={() => setIsOpenModal(true)}
            className="
              group
              flex
              gap-x-3
              text-sm
              leading-6
              font-semibold
              w-full
              justify-center
              p-4
              text-purple-500
              hover:text-purple-800
              hover:bg-purple-100
            "
          >
            <UserIcon className="h-6 w-6" />
          </div>
        </div>

        {routes.map((item) => (
          <div className="relative w-full" key={item.label}>
            {item.isRequestFriendRoute && !!requestFriends.length && (
              <span className="
              absolute 
              top-1
              right-[50%]
              translate-x-[100%]
              text-white 
              text-[9px] 
              bg-rose-500 
              w-4 h-4 
              rounded-full
              flex
              items-center
              justify-center
            ">
                {requestFriends.length > 99 ? '99' : requestFriends.length}
              </span>
            )}
            <MobileItem
              href={item.href}
              active={item.active}
              icon={item.icon}
              onClick={item.onClick}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default MobileSidebar;