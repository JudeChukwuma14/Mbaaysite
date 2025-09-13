import { RootState } from "@/redux/store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
// import { useAuth } from "@/hooks/useAuth"; // ← gives you { token, user }

const SocketCtx = createContext<Socket | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = useSelector((state: RootState) => state.vendor);
  const Socket_Url = "https://mbayy-be.onrender.com";
  const token = user.token;
  const [socket, setSocket] = useState<Socket | undefined>();

  useEffect(() => {
    if (!token || !user) return;

    const s = io(Socket_Url, {
      auth: { token },
      query: { userId: user.vendor?._id },
    });

    setSocket(s);

    return () => {
      s.disconnect();
      setSocket(undefined);
    };
  }, [token, user]);

  return <SocketCtx.Provider value={socket}>{children}</SocketCtx.Provider>;
};

export const useSocket = () => {
  const s = useContext(SocketCtx);
  if (!s) throw new Error("useSocket must be inside <SocketProvider>");
  return s;
};
