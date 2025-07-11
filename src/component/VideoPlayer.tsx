import "../styles/videoPlayer.css"

interface  upVotes {
    id : number ,
    userId : number ,
    streamId : number
 }

interface Video {
    id: number;
    active:boolean ;
    url :string
    userId:number
    upvotes:  upVotes[] 
    extractedId : string
}

interface VideoPlayerProps {
  currentVideo: Video | null;
  onVideoEnd: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ currentVideo }) => {
  if (!currentVideo) {
    return (
      <div className="video-player-container">
        <div className="video-placeholder">
          <h3>🎬 No video playing</h3>
          <p>Add a video to the queue to get started!</p>
        </div>
      </div>
    );
  }
  return (
    <div className="video-player-container">
      <div className="current-video-info" style={{}}>
        <h3 className="current-video-info">🎵 Now Playing</h3>
      </div>
      <div className="video-embed">
        <iframe
          width="100%"
          height="340"
          src={`https://www.youtube.com/embed/${currentVideo.extractedId}?autoplay=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default VideoPlayer;
