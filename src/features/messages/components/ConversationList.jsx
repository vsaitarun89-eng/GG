import React, { useState } from 'react';
import { Edit, Lock, Search } from 'lucide-react';


const FILTER_TABS = ['All', 'Groups', 'Requests'];

export default function ConversationList({ conversations, activeChat, onSelectChat }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = conversations.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'All' ||
      (filter === 'Groups' && c.isGroup) ||
      (filter === 'Requests' && c.isRequest);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="conversation-list">
      {/* Header */}
      <div className="conversation-list-header">
        <h2>Messages</h2>
        <button className="new-chat-btn" title="New message">
          <Edit size={18} />
        </button>
      </div>

      {/* Search */}
      <div className="conv-search-wrap">
        <Search size={14} className="conv-search-icon" />
        <input
          className="conv-search-input"
          type="text"
          placeholder="Search conversations..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filter Tabs */}
      <div className="conv-filter-tabs">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            className={`conv-filter-btn ${filter === tab ? 'active' : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="conversations-scroll">
        {filtered.length === 0 ? (
          <div className="conv-empty">
            <Lock size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
            <p>No conversations found</p>
          </div>
        ) : (
          filtered.map(conv => (
            <div
              key={conv.id}
              className={`conversation-item ${activeChat?.id === conv.id ? 'active' : ''}`}
              onClick={() => onSelectChat(conv)}
            >
              <div className="avatar-wrapper">
                <div className="avatar-initials">{conv.avatar}</div>
                {conv.online && <span className="online-dot" />}
              </div>
              <div className="conversation-info">
                <div className="conversation-header">
                  <span className="conversation-name">{conv.name}</span>
                  <span className="conversation-time">{conv.time}</span>
                </div>
                <div className="conversation-preview">
                  <Lock size={10} style={{ flexShrink: 0 }} />
                  <span className="text">{conv.lastMessage}</span>
                  {conv.unread > 0 && (
                    <span className="unread-badge">{conv.unread}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* E2E footer */}
      <div className="conv-footer">
        <Lock size={12} />
        <span>All messages are end-to-end encrypted</span>
      </div>
    </div>
  );
}
