import { Heart } from "lucide-react";
import { FilledHeart } from "./FilledHeart";

interface upVotes {
  id: number;
  userId: number;
  streamId: number;
}

const StreamStats = ({
  videoId,
  upVotes,
  spaceId,
  socket,
}: {
  videoId: number;
  upVotes: upVotes[];
  spaceId: string | undefined;
  socket: WebSocket | null;
}) => {
  const userId = Number(localStorage.getItem("userId"));

  const hasLiked = upVotes?.some((item) => item.userId === userId);
  const likesCount = upVotes?.length || 0;

  const upVote = () => {
    socket?.send(
      JSON.stringify({
        type: "upVote",
        data: {
          userId,
          streamId: videoId,
          spaceId,
        },
      })
    );
  };

  const downVote = () => {
    socket?.send(
      JSON.stringify({
        type: "downVote",
        data: {
          userId,
          streamId: videoId,
          spaceId,
        },
      })
    );
  };

  return (
    <div
      className="video-stats"
      onClick={() => {
        hasLiked ? downVote() : upVote();
      }}
      style={{ cursor: "pointer" }}
    >
      {hasLiked ? <FilledHeart /> : <Heart color="#667eea" />}
      <h2 style={{ color: "#667eea" }}>{likesCount}</h2>
    </div>
  );
};

export default StreamStats;
