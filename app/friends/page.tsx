import React from 'react'
import EmptyState from '../../components/empty-state'

async function FriendsPage() {
  return (
    <div className="hidden lg:block lg:pl-80 h-full">
      <EmptyState />
    </div>
  )
}

export default FriendsPage