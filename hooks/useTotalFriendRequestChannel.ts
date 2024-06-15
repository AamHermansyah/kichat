import { useEffect } from "react";
import useTotalFriendRequest from "./useTotalFriendRequest";
import axios from "axios";
import { pusherClient } from "@/utils/pusher";
import { useSession } from "next-auth/react";

const useTotalFriendRequestChannel = () => {
  const { set, add } = useTotalFriendRequest();
  const { data, status } = useSession();

  useEffect(() => {
    if (data?.user?.id && status === 'authenticated') {
      axios.get('/api/friend/request-list-ids')
        .then((res) => {
          set(res.data);
        });
    }
  }, [data?.user?.id, status]);

  useEffect(() => {
    if (data?.user?.id && status === 'authenticated') {
      pusherClient.subscribe(data.user.id);

      const totalRequestHandler = (id: string) => {
        add(id);
      }

      pusherClient.bind('friend:count', totalRequestHandler);

      return () => {
        pusherClient.unsubscribe(data?.user?.id!);
        pusherClient.unbind('friend:count', totalRequestHandler);
      }
    }
  }, [data?.user?.id, status]);
}

export default useTotalFriendRequestChannel;