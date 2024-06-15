import React from 'react'
import Sidebar from '../../components/sidebar'

import { getRequestFriends } from '@/data/user'
import { auth } from '@/auth'
import RequestFriendList from '../../components/request-friend-list'

async function RequestFriendsLayout({ children }: {
  children: React.ReactNode
}) {
  const session = await auth();
  const requestFriends = await getRequestFriends(session?.user?.id!);

  return (
    <Sidebar userId={session?.user?.id!}>
      <div className="h-full">
        <RequestFriendList items={requestFriends} />
        {children}
      </div>
    </Sidebar>
  )
}

export default RequestFriendsLayout