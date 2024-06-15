import { create } from "zustand";

interface TotalFriendRequestStore {
  requestFriends: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (ids: string[]) => void;
}

const useTotalFriendRequest = create<TotalFriendRequestStore>((set) => ({
  requestFriends: [],
  add: (id) => set((state) => ({ requestFriends: [...state.requestFriends, id] })),
  remove: (id) => set((state) => ({ requestFriends: state.requestFriends.filter((userId) => userId !== id) })),
  set: (ids) => set({ requestFriends: ids })
}));

export default useTotalFriendRequest;
