import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Vote } from "lucide-react";
import "../styles/Space.css";
import toast from "react-hot-toast";
import VideoInput from "../component/VideoInput";
import { request } from "../Api/reqHandler";
import { apis } from "../Api/api";
import StreamStats from "../component/StreamStats";
import VideoPlayer from "../component/VideoPlayer";
import { useWebSocketConnection } from "../socketContext/WebSocketConnection";
import { useDispatch } from "react-redux";
import { setSocket } from "../Redux/Slice/SocketSlice";

interface upVotes {
  id: number;
  userId: number;
  streamId: number;
}


interface QueueItem {
  id: number;
  active: boolean;
  url: string;
  userId: number;
  extractedId: string;
  upvotes: upVotes[];
}

const Space: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [reFetchQueue, setRefetchQueue] = useState<number>(0);
  const [reFetchCurrentStream, setReFetchCurrentStream] = useState<number>(0);
  const [youtubeUrl, setYoutubeUrl] = useState<any>("");
  const [currentVideo, setCurrentVideo] = useState<QueueItem | null>(null);
  const [extractedId, setExtractedId] = useState<string | null>(null);
  const [hostId, setHostId] = useState("");
  const dispatch = useDispatch();
  const socket = useWebSocketConnection();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [streamsRes, hostRes] :[any,any] = await Promise.all([
          request.get(apis.GET_STREAM, {
            params: { spaceId: id },
          }),
          request.get(apis.GET_HOST, {
            params: { spaceId: id },
          }),
        ]);
  
        setQueue(streamsRes?.data?.data );
        setHostId(hostRes?.data?.hostId );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [id, reFetchQueue]);
  
  

  useEffect(() => {
    const fetchCurrentStreams = async () => {
      try {
        console.log("Fetching current stream...");
        const res: any = await request.get(apis.GET_CURRENT_STREAM, {
          params: { spaceId: id },
        });
        setCurrentVideo(res?.data?.data || null);
      } catch (error) {
        console.error("Error fetching current stream:", error);
      }
    };
    fetchCurrentStreams();
  }, [id, reFetchCurrentStream]);

  useEffect(() => {
    if (!socket) return;

    const joinRoom = () => {
      socket.send(
        JSON.stringify({
          type: "join-room",
          data: {
            spaceId: id,
            hostId,
            userId: localStorage.getItem("userId"),
          },
        })
      );
      console.log("Join Room", id);
    };

    const handleMessage = (event: MessageEvent) => {
      try {
        const { type } = JSON.parse(event.data);
        console.log("Received message:", type);

        if (type === "new-vote" || type === "refetch-queue") {
          setRefetchQueue(Date.now());
        }

        if (type === "refetch-current-stream") {
          setReFetchCurrentStream(Date.now());
          setRefetchQueue(Date.now());
        }
      } catch (err) {
        console.error("Invalid WebSocket message:", err);
      }
    };
    socket.onmessage= handleMessage ;
    
    if (socket.readyState === WebSocket.OPEN) {
      joinRoom();
    } else {
      socket.addEventListener("open", joinRoom, { once: true });
    }

    return () => {
      console.log("Socket cleanup");
      dispatch(setSocket(null));
    };
  }, [socket, id, hostId, dispatch]);

  const handleShareButton = () => {
    const currentURL = window.location.href;
    navigator.clipboard
      .writeText(currentURL)
      .then(() => toast.success("Link Copied"))
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const handleAddToQueue = async () => {
    try {
      socket?.send(
        JSON.stringify({
          type: "add-to-queue",
          data: {
            userId: localStorage.getItem("userId"),
            url: youtubeUrl,
            extractedId,
            spaceId: id,
          },
        })
      );

      toast.success("Stream added to queue");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  const handlePlayNext = async () => {
    if (hostId != localStorage.getItem("userId")) {
      toast.error("Only host can change current stream");
      return;
    }

    socket?.send(
      JSON.stringify({
        type: "play-next",
        data: {
          spaceId: id,
        },
      })
    );
    setReFetchCurrentStream(Date.now());
    setRefetchQueue(Date.now());
  };

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="space-container">
      <div className="space-header">
        <button onClick={handleGoBack} className="back-btn">
          <ArrowLeft size={20} />
        </button>
        <div className="space-title">
          <button className="copy-button" onClick={handleShareButton}>
            Share
          </button>
        </div>
      </div>
      <div className="space-main">
        <div className="space-content">
          <div className="video-section">
            <VideoPlayer currentVideo={currentVideo} />
            <VideoInput
              youtubeUrl={youtubeUrl}
              extractedId={extractedId}
              setYoutubeUrl={setYoutubeUrl}
              setExtractedId={setExtractedId}
              handleAddToQueue={handleAddToQueue}
            />
          </div>
          <div className="queue-section">
            <div className="queue-header">
              <Vote size={27} />
              <h3>Vote Queue</h3>
              <button className="play-next-btn" onClick={handlePlayNext}>
                Play Next
              </button>
            </div>
            <div className="queue-content">
              {queue.length === 0 ? (
                <div className="empty-queue">
                  <h4>Queue is empty</h4>
                  <p>Add some videos to get the party started! 🎉</p>
                </div>
              ) : (
                <div className="queue-list">
                  {queue.map((video, index) => (
                    <div key={video.id} className="queue-item">
                      <div className="queue-position">#{index + 1}</div>
                      <div className="video-thumbnail">
                        <img
                          src={`https://img.youtube.com/vi/${video.extractedId}/maxresdefault.jpg`}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                          }}
                        />
                      </div>
                      <div className="video-info">
                        <StreamStats  videoId={video.id} spaceId={id} socket={socket} upVotes={video.upvotes} />
                      </div>
                      <div className="vote-controls"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Space;
