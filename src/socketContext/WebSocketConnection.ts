import { useEffect, useRef, useState } from "react";

export const useWebSocketConnection = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket opened");
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      setSocket(null);
    };

    ws.onerror = () => {
      console.error("WebSocket error");
      setSocket(null);
    };
    console.log("Mounting WebSocket");
    return () => {
      console.log("Unmounting WebSocket");
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, []);

  return socket;
};
