"use client";

import axios from "axios";
import { FriendRequest, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import Avatar from "@/components/core/avatar";
import { Clock4, LoaderIcon, UserRoundPlus } from "lucide-react";
import toast from "react-hot-toast";

interface UserBoxProps {
  data: User & {
    receivedFriendRequests: FriendRequest[];
  }
}

const UserBox: React.FC<UserBoxProps> = ({
  data
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);

    axios.post('/api/friend/add', {
      receiverId: data.id
    })
      .then(() => {
        toast.success('Permintaan pertemanan dikirim!');
        router.refresh();
      })
      .finally(() => setIsLoading(false))
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
        {data.receivedFriendRequests.length > 0 ? (
          <button className="p-2 rounded-full bg-gray-100 transition cursor-default">
            <Clock4 className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleClick}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            disabled={isLoading}
          >
            {isLoading && <LoaderIcon className="w-4 h-4 animate-spin" />}
            {!isLoading && <UserRoundPlus className="w-4 h-4" />}
          </button>
        )}
      </div>
    </>
  );
}

export default UserBox;