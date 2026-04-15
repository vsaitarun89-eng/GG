import React from 'react';
import './StoryCarousel.css';

export default function StoryCarousel() {
  const stories = [
    { id: 1, user: 'Your Story', image: 'https://i.pravatar.cc/150?u=1', isUser: true },
    { id: 2, user: 'Priya M.', image: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, user: 'KaranFIT', image: 'https://i.pravatar.cc/150?u=3' },
    { id: 4, user: 'IronGym', image: 'https://i.pravatar.cc/150?u=4' },
    { id: 5, user: 'Ayesha', image: 'https://i.pravatar.cc/150?u=5' },
    { id: 6, user: 'Rahul D.', image: 'https://i.pravatar.cc/150?u=6' },
  ];

  return (
    <div className="story-container">
      {stories.map((story) => (
        <div key={story.id} className="story-item">
          <div className={`story-ring ${story.isUser ? 'story-user' : 'story-active'}`}>
            <img src={story.image} alt={story.user} className="story-img" />
            {story.isUser && <div className="story-add-btn">+</div>}
          </div>
          <span className="story-username">{story.user}</span>
        </div>
      ))}
    </div>
  );
}
