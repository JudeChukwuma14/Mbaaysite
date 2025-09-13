import { useEffect, useState } from "react";
import { useSocket } from "@/components/Context/SocketCtx";
import { debounce } from "lodash";

export const useTyping = (chatId: string, receiverId: string) => {
  const socket = useSocket();
  const [typing, setTyping] = useState<string[]>([]); // array of userIds

  useEffect(() => {
    if (!socket) return;

    const onTyping = ({ userId }: { userId: string }) =>
      setTyping((prev) => (prev.includes(userId) ? prev : [...prev, userId]));

    const onStopTyping = ({ userId }: { userId: string }) =>
      setTyping((prev) => prev.filter((id) => id !== userId));

    socket.on("typing", onTyping);
    socket.on("stopTyping", onStopTyping);

    return () => {
      socket.off("typing", onTyping);
      socket.off("stopTyping", onStopTyping);
    };
  }, [socket]);

  const emitTyping = debounce(() => {
    socket?.emit("typing", { chatId, receiverId });
  }, 300);

  const emitStopTyping = debounce(() => {
    socket?.emit("stopTyping", { chatId, receiverId });
  }, 1000);

  return { typing, emitTyping, emitStopTyping };
};
