import { usePathname } from "next/navigation"
import useConversation from "./useConversation";
import { useMemo } from "react";
import { LogOut, MessageCircle, Search, UserRoundPlus, UsersRound } from "lucide-react";
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
      label: 'Friends',
      href: '/friends',
      icon: UsersRound,
      active: pathname === '/friends'
    },
    {
      label: 'Request Friends',
      href: '/request-friends',
      icon: UserRoundPlus,
      active: pathname === '/request-friends',
      isRequestFriendRoute: true
    },
    {
      label: 'Users',
      href: '/users',
      icon: Search,
      active: pathname === '/users'
    },
    {
      label: 'Logout',
      href: '#',
      onClick: () => {
        signOut({ callbackUrl: '/' });
        localStorage.removeItem('d-help-btn');
      },
      icon: LogOut
    }
  ], [pathname, conversationId]);

  return routes
}

export default useRoutes;