import React from 'react'
import Sidebar from '../../components/sidebar'

import { getFriendsById } from '@/data/user'
import { auth } from '@/auth'
import FriendList from '../../components/friend-list'

async function FriendsLayout({ children }: {
  children: React.ReactNode
}) {
  const session = await auth();
  const friends = await getFriendsById(session?.user?.id!);

  return (
    <Sidebar userId={session?.user?.id!}>
      <div className="h-full">
        <FriendList items={friends} />
        {children}
      </div>
    </Sidebar>
  )
}

export default FriendsLayout