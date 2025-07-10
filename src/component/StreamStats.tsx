
import { Heart } from "lucide-react"
import { apis } from "../Api/api";
import { request } from "../Api/reqHandler";
import { useState } from "react";
import { FilledHeart } from "./filledHeart";

interface  upVotes {
    id : number ,
    userId : number ,
    streamId : number
 }

const StreamStats = ({videoId , upVotes} : {videoId:number,  upVotes : upVotes[]} ) => {
   
  const find : Boolean=  upVotes && upVotes?.length>0 ? upVotes.some((item) => item.userId === Number(localStorage.getItem("userId"))) : false;
  const [likes,setLikes] = useState<Boolean>(find) 
  const [likesCount,setLikesCount] = useState<number>(upVotes.length)
  const upVote = async(itemId: number) => {
    try{
       await request.post(apis.UP_VOTE ,{
        userId : Number(localStorage.getItem("userId")) ,
        streamId : Number(itemId)
     })
     setLikes((prev)=>!prev) ;
     setLikesCount((prev)=> prev+1)
    }catch(e){
      console.log(e) 
    }
  };
  const downVote = async(itemId: number) => {
    try{
       await request.post(apis.DOWN_VOTES ,{
        userId : Number(localStorage.getItem("userId")) ,
        streamId : Number(itemId)
     })
     setLikes((prev)=>!prev) ;
     setLikesCount((prev)=> prev-1)
    }catch(e){
      console.log(e) 
    }
  };

  return (
    <div className="video-stats" onClick={()=>{likes ? downVote(videoId) :upVote(videoId)}} style={{ cursor: 'pointer' }}>
    { likes ? <FilledHeart/> : <Heart color=" #667eea"/>} 
    <h2 style={{color: "#667eea"}}>{likesCount}</h2>
   </div>
  )
}

export default StreamStats