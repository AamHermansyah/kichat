'use client';

import { useState } from "react";
import { User } from "@prisma/client";
import useRoutes from "@/hooks/useRoutes";
import DesktopItem from "./desktop-item";
import Avatar from "@/components/core/avatar";
import SettingsModal from "./setting-modal";
import KiChatLogo from "./kichat-logo";
import useTotalFriendRequest from "@/hooks/useTotalFriendRequest";

interface DesktopSidebarProps {
  currentUser: User
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentUser
}) => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);
  const { requestFriends } = useTotalFriendRequest();

  return (
    <>
      <SettingsModal
        currentUser={currentUser}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <div
        className="
          hidden
          lg:fixed
          lg:inset-y-0
          lg:left-0
          lg:z-40
          lg:w-20
          xl:px-6
          lg:overflow-y-auto
          lg:bg-white
          lg:border-r-[1px]
          lg:pb-4
          lg:flex
          lg:flex-col
          justify-between
        "
      >
        <nav
          className="
            mt-4
            flex
            flex-col
            justify-between
          "
        >
          <ul
            role="list"
            className="
              flex
              flex-col
              items-center
              space-y-1
            "
          >
            <div className="mb-4">
              <KiChatLogo />
            </div>
            {routes.map((item) => (
              <div className="relative" key={item.label}>
                {item.isRequestFriendRoute && !!requestFriends.length && (
                  <span className="
                    absolute 
                    top-0 
                    right-0 
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
                <DesktopItem
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={item.active}
                  onClick={item.onClick}
                />
              </div>
            ))}
          </ul>
        </nav>
        <nav
          className="
            mt-4
            flex
            flex-col
            justify-between
            items-center
          "
        >
          <div
            onClick={() => setIsOpen(true)}
            className="
              cursor-pointer
              hover:opacity-75
              transition
            "
          >
            <Avatar user={currentUser} />
          </div>
        </nav>
      </div>
    </>
  );
}

export default DesktopSidebar;