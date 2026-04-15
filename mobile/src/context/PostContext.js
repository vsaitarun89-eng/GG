import React, { createContext, useState } from 'react';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  // Initialize with the Figma mockup post
  const [posts, setPosts] = useState([
    {
      id: 'mock-1',
      user: 'Arjun Singh',
      avatarLetters: 'AS',
      location: "Gold's Gym, Mumbai",
      timeAgo: '2d',
      content: '6 months of grind, 3 AM wake-ups, skipped birthdays — all worth it for this split second of zero gravity. We break ourselves to build ourselves. Stay hard! 🐅',
      media: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600', // relevant deadlift image
      badgeName: 'IRON PULLER BADGE UNLOCKED',
      title: '140KG DEADLIFT — NEW PR! 🔥',
      likes: 124,
      comments: 18,
    }
  ]);

  const addPost = (post) => {
    // Inject at the top of the feed
    setPosts(prev => [post, ...prev]);
  };

  return (
    <PostContext.Provider value={{ posts, addPost }}>
      {children}
    </PostContext.Provider>
  );
};
