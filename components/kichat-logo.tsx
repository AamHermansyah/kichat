import Image from 'next/image'
import React from 'react'

function KiChatLogo() {
  return (
    <div className="group rounded-md p-1 flex flex-col gap-2 items-center justify-center">
      <div className="relative w-6 h-6">
        <Image
          alt="Logo"
          className="w-full h-full object-cover"
          src="/kichat-logo.png"
          fill
        />
      </div>
      <span className="text-xs">KiChat</span>
    </div>
  )
}

export default KiChatLogo