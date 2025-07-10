import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Music, ArrowLeft, Plus, Vote } from "lucide-react";
import "../styles/Space.css";
import toast from "react-hot-toast";

interface QueueItem {
  id: number;
  title: string;
  url: string;
  addedBy: string;
  votes: number;
}

const Space: React.FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const navigate = useNavigate();

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<QueueItem | null>(null);

  const handleCopyButton = () => {
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
  const handleAddToQueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (youtubeUrl.trim()) {
      const newItem: QueueItem = {
        id: queue.length + 1,
        title: `Video ${queue.length + 1}`,
        url: youtubeUrl.trim(),
        addedBy: "Anonymous",
        votes: 0,
      };
      setQueue([...queue, newItem]);
      setYoutubeUrl("");
    }
  };

  const handleVote = (itemId: number) => {
    setQueue(
      queue
        .map((item) =>
          item.id === itemId ? { ...item, votes: item.votes + 1 } : item
        )
        .sort((a, b) => b.votes - a.votes)
    );
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
          <button className="copy-button" onClick={handleCopyButton}>
            Share
          </button>
        </div>
      </div>

      <div className="space-subtitle">
        <p>Vote for the next song to play on the stream!</p>
      </div>

      <div className="space-main">
        <div className="space-content">
          <div className="video-section">
            <div className="video-player">
              {currentVideo ? (
                <div className="video-playing">
                  <h3>Now Playing: {currentVideo.title}</h3>
                  <div className="video-placeholder">
                    <Music size={48} />
                    <p>Video Player</p>
                  </div>
                </div>
              ) : (
                <div className="no-video">
                  <Music size={48} />
                  <h3>No video playing</h3>
                  <p>Add a video to the queue to get started!</p>
                </div>
              )}
            </div>

            <div className="add-video-section">
              <h3>
                <Plus size={20} />
                Add a Video to Queue
              </h3>
              <form onSubmit={handleAddToQueue} className="add-video-form">
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="Paste YouTube URL here..."
                  required
                />
                <button type="submit" className="add-to-queue-btn">
                  Add to Queue
                </button>
              </form>
            </div>
          </div>

          <div className="queue-section">
            <div className="queue-header">
              <Vote size={20} />
              <h3>Vote Queue ({queue.length})</h3>
            </div>
            <div className="queue-content">
              {queue.length === 0 ? (
                <div className="empty-queue">
                  <h4>Queue is empty</h4>
                  <p>Add some videos to get the party started! 🎉</p>
                </div>
              ) : (
                <div className="queue-list">
                  {queue.map((item) => (
                    <div key={item.id} className="queue-item">
                      <div className="queue-item-info">
                        <h4>{item.title}</h4>
                        <p>Added by {item.addedBy}</p>
                      </div>
                      <div className="queue-item-actions">
                        <span className="votes">{item.votes} votes</span>
                        <button
                          onClick={() => handleVote(item.id)}
                          className="vote-btn"
                        >
                          Vote
                        </button>
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
