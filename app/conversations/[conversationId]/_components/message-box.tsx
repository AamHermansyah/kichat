"use client";

import Avatar from "@/components/core/avatar";
import { FullMessageType } from "@/types";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";
import ImageModal from "./image-modal";
import { Session } from "next-auth";
import useSecretFeatures from "@/hooks/useSecretFeatures";
import { revealSecretMessage } from "@/utils/stegcloack";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
  profile: Session['user'];
  hashedPassword: string | undefined;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  data,
  isLast,
  profile,
  hashedPassword
}) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showSecretMessage } = useSecretFeatures();

  const isOwn = profile?.email === data?.sender?.email;
  const seenList = (data.seenMessages || [])
    .filter((item) => item.user.email !== data?.sender?.email)
    .map((item) => {
      const name = item.user.name.split(' ');

      return `${name[0]} ${name[1] ? name[1].split('')[0] : ''}`
    })
    .join(', ');

  const container = clsx(
    "flex gap-3 p-4",
    isOwn && "justify-end"
  );

  const avatar = clsx(isOwn && "order-2");

  const body = clsx(
    "flex flex-col gap-2",
    isOwn && "items-end"
  );

  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? 'bg-purple-500 text-white' : 'bg-gray-100',
    data.image ? 'rounded-md p-0' : 'rounded-xl py-2 px-3'
  );

  useEffect(() => {
    const source = axios.CancelToken.source();

    if (data.body) {
      if (showSecretMessage && data.body && data.isContainSecret && hashedPassword) {
        setLoading(true);

        axios.post('/api/zwc/decrypt', {
          message: data.body,
          password: hashedPassword
        }, { cancelToken: source.token })
          .then((res) => {
            setInitialMessage(res.data);
          })
          .catch((error) => {
            if (axios.isCancel(error)) {
              console.log('Request canceled', error.message);
            } else {
              toast.error(error);
            }
          })
          .finally(() => setLoading(false));
      } else {
        setInitialMessage(null);
      }
    }

    return () => {
      source.cancel('Operation canceled by the user.');
      setInitialMessage(null);
    };
  }, [showSecretMessage, data.body, data.isContainSecret, hashedPassword]);

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">
            {data.sender.name}
          </div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), 'p')}
          </div>
        </div>
        <div className={message}>
          <ImageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {data.image ? (
            <Image
              onClick={() => setImageModalOpen(true)}
              alt="Image"
              height="288"
              width="288"
              src={data.image}
              className="
                object-cover
                cursor-pointer
                hover:scale-110
                transition
                translate
              "
            />
          ) : (
            <div className="relative flex flex-col">
              {showSecretMessage && data.isContainSecret && initialMessage && !loading ? (
                <>
                  <span className="inline-block text-[10px] leading-3 text-gray-200">Pesan rahasia:</span>
                  {initialMessage}
                </>
              ) : (
                <>
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs bg-purple-500">
                      <Loader className="w-4 h-4 animate-spin" />
                    </div>
                  )}
                  {data.body}
                </>
              )}
            </div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div
            className="
              text-xs
              font-light
              text-gray-500
            "
          >
            {`Dilihat oleh ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBox;