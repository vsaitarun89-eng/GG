import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('grainGridPosts');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        user: 'Rohan Sharma',
        avatar: 'https://i.pravatar.cc/150?u=10',
        location: 'Golds Gym, Mumbai',
        timeAgo: '2h ago',
        content: 'Hit a new PR on deadlifts today! 200kg feels amazing. Consistency is key. Keeping the diet clean and grinding every day.',
        stats: { weight: '200 KG Deadlift', duration: '1h 30m Workout' },
        media: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000'
      }
    ];
  });

  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem('grainGridWorkouts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('grainGridPosts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('grainGridWorkouts', JSON.stringify(workouts));
  }, [workouts]);

  const addPost = (post) => {
    setPosts([{ ...post, id: Date.now() }, ...posts]);
  };

  const addWorkout = (workout) => {
    setWorkouts([{ ...workout, id: Date.now() }, ...workouts]);
  };

  return (
    <AppContext.Provider value={{
      posts, setPosts, addPost,
      workouts, setWorkouts, addWorkout
    }}>
      {children}
    </AppContext.Provider>
  );
}
