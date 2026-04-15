import React, { useState } from 'react';
import Card from '../ui/Card';
import { Flame, MessageCircle, Share2, MoreHorizontal, Dumbbell, Zap, MapPin } from 'lucide-react';
import './Post.css';

export default function Post({ 
  user, 
  avatar, 
  location, 
  timeAgo, 
  content, 
  stats, 
  media 
}) {
  const [liked, setLiked] = useState(false);

  return (
    <Card className="post-card">
      <div className="post-header">
        <div className="post-author-info">
          <img src={avatar} alt={user} className="post-avatar" />
          <div>
            <h4 className="post-user">{user}</h4>
            <div className="post-meta">
              <span className="post-time">{timeAgo}</span>
              {location && (
                <>
                  <span className="meta-dot">•</span>
                  <span className="post-location">
                    <MapPin size={12} className="mr-1" />
                    {location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <button className="post-more-btn">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="post-content">
        <p>{content}</p>
        
        {stats && (
          <div className="post-stats-banner">
            <span className="badge-unlocked">Badge Unlocked!</span>
            <div className="stats-row">
              <div className="stat-pill bg-purple-dim text-purple">
                <Dumbbell size={14} /> {stats.weight}
              </div>
              <div className="stat-pill bg-orange-dim text-orange">
                <Zap size={14} /> {stats.duration}
              </div>
            </div>
          </div>
        )}

        {media && (
          <div className="post-media-container">
            <img src={media} alt="Post media" className="post-media" />
          </div>
        )}
      </div>

      <div className="post-footer">
        <div className="reaction-grid">
          <button 
            className={`reaction-btn ${liked ? 'active' : ''}`}
            onClick={() => setLiked(!liked)}
          >
            <Flame size={18} className={liked ? 'text-primary' : ''} />
            <span>{liked ? '24' : '23'} FIRE</span>
          </button>
          <button className="reaction-btn">
            <Dumbbell size={18} />
            <span>12 GAINS</span>
          </button>
          <button className="reaction-btn">
            <MessageCircle size={18} />
            <span>Comments</span>
          </button>
          <button className="reaction-btn">
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
