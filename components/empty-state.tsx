import React from 'react'

function EmptyState() {
  return (
    <div
      className="
        px-4
        py-6
        sm:px-6
        lg:px-8
        h-full
        flex
        justify-center
        items-center
        bg-gray-100
      "
    >
      <div className="text-center flex justify-center items-center">
        <h3 className="mt-2 text-2xl font-semibold text-gray-800">
          Pilih chat atau mulai percakapan yang menarik
        </h3>
      </div>
    </div>
  )
}

export default EmptyState