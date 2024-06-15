"use client";

import useTotalFriendRequestChannel from "@/hooks/useTotalFriendRequestChannel";
import useActiveChannel from "../hooks/useActiveChannel";

const PusherGlobalClient = () => {
  useActiveChannel();
  useTotalFriendRequestChannel();

  return null;
};

export default PusherGlobalClient;