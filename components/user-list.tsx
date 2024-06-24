"use client";

import { FriendRequest, User } from "@prisma/client";
import UserBox from "./user-box";
import useTotalFriendRequest from "@/hooks/useTotalFriendRequest";
import { useState } from "react";
import DelayInput from "./core/delay-input";
import { LoaderCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface UserListProps {
  items: (User & {
    receivedFriendRequests: FriendRequest[];
  })[]
};

const UserList: React.FC<UserListProps> = ({
  items
}) => {
  const [users, setUsers] = useState<UserListProps['items']>(items);
  const [searching, setSearching] = useState(false);
  const { requestFriends } = useTotalFriendRequest();

  const handleSearch = (value: string) => {
    setSearching(true);

    axios.get(`/api/users?q=${value}`)
      .then((res) => {
        setUsers(res.data);
      })
      .finally(() => setSearching(false))
      .catch(() => toast.error('Internal error'));
  }

  return (
    <aside
      className="
        fixed
        inset-y-0
        pb-20
        lg:pb-0
        lg:left-20
        lg:w-80
        lg:block
        overflow-y-auto
        border-r
        border-gray-200
        block
        w-full
        left-0
      "
    >
      <div className="px-5">
        <div className="flex-col">
          <div className="
            text-2xl
            font-bold
            text-neutral-800
            py-4
          ">
            Temukan Orang
          </div>
        </div>
        <DelayInput
          placeholder="Temukan orang yang ada kenal"
          onChange={handleSearch}
        />
        <div className="mt-4">
          {searching ? (
            <div className="h-[50px] flex justify-center items-center">
              <LoaderCircle className="w-4 h-4 animate-spin" />
            </div>
          ) : users.map((user) => {
            if (requestFriends.indexOf(user.id) === -1) return (
              <UserBox
                key={user.id}
                data={user}
              />
            )
          })}
        </div>
      </div>
    </aside>
  );
}

export default UserList;