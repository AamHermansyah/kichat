"use client";

import useRoutes from "@/hooks/useRoutes";
import useConversation from "@/hooks/useConversation";
import MobileItem from "./mobile-item";
import { User } from "@prisma/client";
import { User as UserIcon } from "lucide-react";
import SettingsModal from "./setting-modal";
import { useState } from "react";

interface MobileSidebarProps {
  currentUser: User
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ currentUser }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const routes = useRoutes();
  const { isOpen } = useConversation();

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

        {routes.map((route) => (
          <MobileItem
            key={route.href}
            href={route.href}
            active={route.active}
            icon={route.icon}
            onClick={route.onClick}
          />
        ))}
      </div>
    </>
  );
}

export default MobileSidebar;