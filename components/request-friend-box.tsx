"use client";

import axios from "axios";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import Avatar from "@/components/core/avatar";
import { Check, LoaderIcon, X } from "lucide-react";
import toast from "react-hot-toast";
import useTotalFriendRequest from "@/hooks/useTotalFriendRequest";

interface RequestFriendBoxProps {
  data: User;
}

const RequestFriendBox: React.FC<RequestFriendBoxProps> = ({
  data
}) => {
  const router = useRouter();
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const { remove } = useTotalFriendRequest();

  const handleAccept = useCallback(() => {
    setAccepting(true);

    axios.post('/api/friend/accept', {
      senderId: data.id
    })
      .then(() => {
        toast.success('Permintaan pertemanan diterima!');
        router.refresh();
      })
      .finally(() => setAccepting(false))
      .catch(() => toast.error('Something went wrong!'));
  }, [data, router]);

  const handleDecline = useCallback(() => {
    setDeclining(true);

    axios.post('/api/friend/decline', {
      senderId: data.id
    })
      .then(() => {
        toast.success('Permintaan pertemanan ditolak!');
        remove(data.id);
        router.refresh();
      })
      .finally(() => setDeclining(false))
      .catch(() => toast.error('Something went wrong!'));
  }, [data, router]);

  return (
    <>
      <div
        className="
          w-full
          relative
          flex
          items-center
          space-x-3
          bg-white
          p-3
          rounded-lg
        "
      >
        <Avatar user={data} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <div
              className="
                flex
                justify-between
                items-center
              "
            >
              <p
                className="
                  text-sm
                  font-medium
                  text-gray-900
                "
              >
                {data.name}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={handleDecline}
            className="p-1 rounded-full hover:bg-rose-100 text-rose-500 transition"
            disabled={declining}
          >
            {declining ?
              <LoaderIcon className="w-3.5 h-3.5 animate-spin" /> :
              <X className="w-3.5 h-3.5" />
            }
          </button>
          <button
            onClick={handleAccept}
            className="p-1 rounded-full hover:bg-emerald-100 text-emerald-500 transition"
            disabled={accepting}
          >
            {accepting ?
              <LoaderIcon className="w-3.5 h-3.5 animate-spin" /> :
              <Check className="w-3.5 h-3.5" />
            }
          </button>
        </div>
      </div>
    </>
  );
}

export default RequestFriendBox;