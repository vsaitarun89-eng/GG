import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StoryCarousel from '@/components/feed/StoryCarousel';
import ActionCard from '@/components/feed/ActionCard';
import Post from '@/components/feed/Post';
import { Activity, Dumbbell, History, Target, Calendar, TrendingUp } from 'lucide-react';
import './HomePage.css';

export default function HomePage() {
  const posts = [
    {
      id: 1,
      user: 'Rohan Sharma',
      avatar: 'https://i.pravatar.cc/150?u=10',
      location: 'Golds Gym, Mumbai',
      timeAgo: '2h ago',
      content: 'Hit a new PR on deadlifts today! 200kg feels amazing. Consistency is key. Keeping the diet clean and grinding every day.',
      stats: {
        weight: '200 KG Deadlift',
        duration: '1h 30m Workout'
      },
      media: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 2,
      user: 'Priya M.',
      avatar: 'https://i.pravatar.cc/150?u=2',
      location: 'Cult.Fit, Bangalore',
      timeAgo: '4h ago',
      content: 'Morning cardio session completed. Ready to tackle the day!',
      stats: null,
      media: null
    }
  ];

  return (
    <MainLayout>
      <div className="home-feed-content animate-fade-in">
        
        {/* Stories Section */}
        <section className="feed-section">
          <StoryCarousel />
        </section>

        {/* Tab System */}
        <div className="feed-tabs">
          <button className="tab active">My Feed</button>
          <button className="tab">My Gym</button>
          <button className="tab">Global</button>
        </div>

        {/* Quick Actions Grid */}
        <section className="feed-section">
          <div className="quick-actions-grid">
            <ActionCard 
              title="Log Workout" 
              icon={Activity} 
              colorClass="bg-cyan" 
            />
            <ActionCard 
              title="Planner" 
              icon={Calendar} 
              colorClass="bg-blue" 
            />
            <ActionCard 
              title="Progress" 
              icon={TrendingUp} 
              colorClass="bg-red" 
            />
            <ActionCard 
              title="My PRs" 
              icon={Dumbbell} 
              colorClass="bg-orange" 
            />
            <ActionCard 
              title="History" 
              icon={History} 
              colorClass="bg-purple" 
            />
            <ActionCard 
              title="Challenges" 
              icon={Target} 
              colorClass="bg-green" 
            />
          </div>
        </section>

        {/* Posts Feed */}
        <section className="feed-section posts-list">
          {posts.map(post => (
            <Post key={post.id} {...post} />
          ))}
        </section>

      </div>
    </MainLayout>
  );
}
