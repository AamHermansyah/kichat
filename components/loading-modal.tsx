"use client";

import React, { Fragment } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";

const LoadingModal = () => {
  return (
    <Transition show as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => { }}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="
              fixed
              inset-0
              bg-gray-100
              bg-opacity-50
              transition-opacity
            "
          />
        </TransitionChild>

        <div
          className="
            fixed
            inset-0
            z-10
            overflow-y-auto
          "
        >
          <div className="
            flex
            min-h-full
            items-center
            justify-center
            p-4
            text-center
          ">
            <DialogPanel className="flex flex-col gap-4 items-center justify-center">
              <div className="space-y-2 animate-pulse">
                <div className="relative w-[150px] aspect-square mx-auto">
                  <Image
                    alt="Logo"
                    className="object-contain"
                    src="/kichat-logo.png"
                    fill
                  />
                </div>
                <h1 className="font-bold text-2xl text-gray-800">KiChat</h1>
              </div>
              <LoaderIcon size={30} className="animate-spin text-gray-500" />
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default LoadingModal;