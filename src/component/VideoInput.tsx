import { Plus } from "lucide-react";
import { useState } from "react"
import "../styles/Space.css";
interface VideoInputProps {
    youtubeUrl: string;
    setYoutubeUrl: (url: string) => void;
    handleAddToQueue: (e: React.FormEvent) => void
  }
  
const VideoInput: React.FC<VideoInputProps> = ({youtubeUrl , handleAddToQueue ,setYoutubeUrl} ) => {
    const [previewVideo, setPreviewVideo] = useState<string | null>(null);
    const extractVideoId = (url: string): string | null => {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
      };
    
      const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setYoutubeUrl(url);
        const videoId = extractVideoId(url);
        setPreviewVideo(videoId);
      };
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleAddToQueue(e);
        setTimeout(()=>setPreviewVideo(null),1000)
      };
  return (
    <div className="add-video-section">
    <h3>
      <Plus size={20} />
      Add a Video to Queue
    </h3>
    <form onSubmit={ handleSubmit} className="add-video-form">
      <input
        type="url"
        value={youtubeUrl}
        onChange={handleUrlChange}
        placeholder="Paste YouTube URL here..."
        required
      />
      <button type="submit" className="add-to-queue-btn">
        Add to Queue
      </button>
    </form>
    {previewVideo && (
        <div className="video-preview">
          <h4>Preview:</h4>
          <div className="preview-thumbnail">
            <img 
              src={`https://img.youtube.com/vi/${previewVideo}/maxresdefault.jpg`}
              alt="Video thumbnail"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://img.youtube.com/vi/${previewVideo}/hqdefault.jpg`;
              }}
            />
            <div className="preview-overlay">
              <div className="play-icon">▶</div>
            </div>
          </div>
        </div>
      )}
  </div>
  )
}

export default VideoInput