import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux"
import { setSocket } from "../Redux/Slice/SocketSlice";
import  {getSocket} from "../Redux/Slice/SocketSlice"
const WebSocketConnection = () => {
    const dispatch= useDispatch() ;
    const socket = useSelector(getSocket);
    useEffect(()=>{
        if(!socket) {
           const ws= new WebSocket("ws://localhost:3000") ;
           ws.onopen = () => {
            dispatch(setSocket(ws)) ;
          };
          ws.onclose = () => {
            setSocket(null);
          };
    
          ws.onerror = () => {
            setSocket(null);
          };
    
         () => {
            ws.close();
          };
        }
    },[socket])
    return socket ;
}

export default WebSocketConnection