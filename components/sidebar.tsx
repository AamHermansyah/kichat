import React from 'react'
import DesktopSidebar from './desktop-sidebar'
import MobileSidebar from './mobile-sidebar'

import { getCurrentUserProfile } from '@/data/user'

async function Sidebar({ children, userId }: {
  children: React.ReactNode,
  userId: string
}) {
  const currentUser = await getCurrentUserProfile(userId);

  return (
    <div className="h-full">
      <DesktopSidebar currentUser={currentUser!} />
      <MobileSidebar currentUser={currentUser!} />
      <main className="lg:pl-20 h-full">
        {children}
      </main>
    </div>
  )
}

export default Sidebar