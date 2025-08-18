import { useEffect, useRef } from "react";
import { baseUrl } from "../Api/reqHandler";
export const useWebSocketConnection = () => {
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(baseUrl);
    socket.current = ws;

    ws.onopen = () => {
      console.log("WebSocket opened");
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
     
    };

    ws.onerror = () => {
      console.error("WebSocket error");
  
    };
    return () => {
      console.log("Unmounting WebSocket");
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.close();
      }
    };
  }, []);

  return socket?.current;
};
