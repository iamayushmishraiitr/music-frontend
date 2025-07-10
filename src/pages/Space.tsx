import React, { useEffect, useState } from "react";
import { useParams, useNavigate} from "react-router-dom";
import {  ArrowLeft,  Vote} from "lucide-react";
import "../styles/Space.css";
import toast from "react-hot-toast";
import VideoInput from "../component/VideoInput";
import { request } from "../Api/reqHandler";
import { apis } from "../Api/api";
import StreamStats from "../component/StreamStats";
import VideoPlayer from "../component/VideoPlayer";

interface  upVotes {
   id : number ,
   userId : number ,
   streamId : number
}
interface QueueItem {
  id: number;
  active:boolean ;
  url :string
  bigImage:string
  smallImage:string
  userId:number
  extractedId : string
  upvotes:  upVotes[]
}

const Space: React.FC = () => {
  const {  id  } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [reFetchQueue,setRefetchQueue] =useState(true) 
  const [reFetchCurrentStream,setReFetchCurrentStream] =useState(true) 
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [currentVideo, setCurrentVideo] = useState<QueueItem | null>(null);
  const  [hostId ,setHostId] = useState("") 
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const res:any = await request.get(apis.GET_STREAM, {
          params: {
            spaceId: id,
          },
        });
        const data = res?.data?.data as QueueItem[];
        setHostId(res?.data?.hostId)
        setQueue(data); 
      } catch (error) {
        console.error("Error fetching streams:", error);
      }
    };
    fetchStreams();
  }, [id,reFetchQueue]);

  useEffect(() => {
    const fetchCurrentStreams = async () => {
      try {
        const res:any = await request.get(apis.GET_CURRENT_STREAM, {
          params: {
            spaceId: id,
          },
        }) 
        setCurrentVideo(res?.data?.data)
      } catch (error) {
        console.error("Error fetching streams:", error);
      }
    };
    fetchCurrentStreams();
  }, [id,reFetchCurrentStream]);

  const handleShareButton = () => {
    const currentURL = window.location.href;
    navigator.clipboard
      .writeText(currentURL)
      .then(() => {
        toast.success("Link Copied");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
  const handleAddToQueue = async() => {
      try {
          await request.post(apis.POST_STREAM,{
           userId : localStorage.getItem("userId") ,
           url :youtubeUrl ,
           spaceId : id
        })
        setRefetchQueue((prev)=> !prev) 
        toast.success("stream added to queue")
      } catch (error) {
        toast.error("Something went wrong")
        console.log(error)
      }
  };
  const handlePlayNext = async()=>{
     
     if(hostId != localStorage.getItem("userId")){
      toast.error("Only host can change current stream")
      return 
    }
     await request.post(apis.PlAY_NEXT,{
        userId : Number(localStorage.getItem("userId")),
        spaceId  : Number(id) 
     })
     setReFetchCurrentStream((prev)=>!prev)
     setRefetchQueue((prev)=> !prev) 

  }
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
         <VideoPlayer currentVideo ={currentVideo} onVideoEnd= {handlePlayNext} />
         <VideoInput 
           youtubeUrl={youtubeUrl}
           setYoutubeUrl= {setYoutubeUrl}
           handleAddToQueue={handleAddToQueue}
         />
          </div>
          <div className="queue-section">
            <div className="queue-header">
              <Vote size={27} />
              <h3>Vote Queue </h3>
              <button className="play-next-btn" onClick={()=>handlePlayNext()}>
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
                  {queue.map((video,index) => (
                      <div key={video.id} className="queue-item">
                      <div className="queue-position">#{index + 1}</div>
                      <div className="video-thumbnail">
                        <img 
                          src={video.smallImage}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                          }}
                        />
                      </div>
                      <div className="video-info">
                       <StreamStats videoId={video?.id}  upVotes = {video?.upvotes} />
                      </div>
                      <div className="vote-controls">
                      </div>
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
