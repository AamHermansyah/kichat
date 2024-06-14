import React from 'react'
import Sidebar from '../../components/sidebar'

import { getUsersByCurrentUserProfile } from '@/data/user'
import { auth } from '@/auth'
import UserList from '../../components/user-list'

async function UsersLayout({ children }: {
  children: React.ReactNode
}) {
  const session = await auth();
  const users = await getUsersByCurrentUserProfile(session?.user?.email!);

  return (
    <Sidebar userId={session?.user?.id!}>
      <div className="h-full">
        <UserList items={users} />
        {children}
      </div>
    </Sidebar>
  )
}

export default UsersLayout