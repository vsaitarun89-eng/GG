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
        <div className="post-reactions-bar">
          <button 
            className={`reaction-chip ${liked ? 'active' : ''}`}
            onClick={() => setLiked(!liked)}
            style={{ '--chip-bg': 'rgba(252,211,77,0.1)', '--chip-border': 'rgba(252,211,77,0.3)', '--chip-color': '#FCD34D' }}
          >
            <span>💪</span> <span style={{ color: liked ? 'inherit' : '#9CA3AF' }}>GAINS {liked ? '48' : '47'}</span>
          </button>
          <button className="reaction-chip" style={{ '--chip-bg': 'rgba(239,68,68,0.1)', '--chip-border': 'rgba(239,68,68,0.3)', '--chip-color': '#EF4444' }}>
            <span>🔥</span> <span style={{ color: '#9CA3AF' }}>FIRE 32</span>
          </button>
          <button className="reaction-chip" style={{ '--chip-bg': 'rgba(250,204,21,0.1)', '--chip-border': 'rgba(250,204,21,0.3)', '--chip-color': '#FACC15' }}>
            <span>👑</span> <span style={{ color: '#9CA3AF' }}>LEGEND 12</span>
          </button>
          <button className="reaction-chip" style={{ '--chip-bg': 'rgba(244,114,182,0.1)', '--chip-border': 'rgba(244,114,182,0.3)', '--chip-color': '#F472B6' }}>
            <span>🫡</span> <span style={{ color: '#9CA3AF' }}>RESPECT 28</span>
          </button>
          <button className="reaction-chip" style={{ '--chip-bg': 'rgba(167,139,250,0.1)', '--chip-border': 'rgba(167,139,250,0.3)', '--chip-color': '#A78BFA' }}>
            <span>😤</span> <span style={{ color: '#9CA3AF' }}>BEAST 39</span>
          </button>
          <button className="reaction-chip" style={{ '--chip-bg': 'rgba(251,191,36,0.1)', '--chip-border': 'rgba(251,191,36,0.3)', '--chip-color': '#FBBF24' }}>
            <span>🙌</span> <span style={{ color: '#9CA3AF' }}>INSPIRED 22</span>
          </button>
        </div>

        <div className="post-footer-actions">
          <button className="footer-action-btn">
            <MessageCircle size={18} />
            <span>Comments</span>
          </button>
          <button className="footer-action-btn">
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
