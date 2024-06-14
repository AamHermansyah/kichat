import { usePathname } from "next/navigation"
import useConversation from "./useConversation";
import { useMemo } from "react";
import { LogOut, MessageCircle, UsersRound } from "lucide-react";
import { signOut } from "next-auth/react";

const useRoutes = () => {
  const pathname = usePathname();
  const { conversationId } = useConversation();

  const routes = useMemo(() => [
    {
      label: 'Chat',
      href: '/conversations',
      icon: MessageCircle,
      active: pathname === '/conversations' || !!conversationId
    },
    {
      label: 'Users',
      href: '/users',
      icon: UsersRound,
      active: pathname === '/users'
    },
    {
      label: 'Logout',
      href: '#',
      onClick: () => signOut({ callbackUrl: '/' }),
      icon: LogOut
    }
  ], [pathname, conversationId]);

  return routes
}

export default useRoutes;