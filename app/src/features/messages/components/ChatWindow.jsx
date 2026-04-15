import React, { useState, useRef, useEffect } from 'react';
import { Send, Lock, ShieldCheck, Smile, MoreVertical, Phone, Video } from 'lucide-react';

const DATE_LABELS = {
  today: 'Today',
  yesterday: 'Yesterday',
};

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getDayLabel(isoString) {
  const d = new Date(isoString);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return DATE_LABELS.today;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return DATE_LABELS.yesterday;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

const EMOJIS = ['😂', '❤️', '👍', '🔥', '💪', '🎯', '🏋️', '⚡'];

export default function ChatWindow({ activeChat, messages, onSendMessage, myKeysReady }) {
  const [inputValue, setInputValue] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate "other person is typing" when you type
  useEffect(() => {
    if (inputValue && activeChat) {
      clearTimeout(typingTimerRef.current);
      setIsTyping(true);
      typingTimerRef.current = setTimeout(() => setIsTyping(false), 2000);
    } else {
      setIsTyping(false);
    }
    return () => clearTimeout(typingTimerRef.current);
  }, [inputValue, activeChat]);

  if (!activeChat) {
    return (
      <div className="chat-window">
        <div className="empty-chat">
          <div className="empty-chat-icon">
            <ShieldCheck size={40} />
          </div>
          <h3>Your Messages</h3>
          <p>Select a conversation to start chatting.</p>
          <div className="e2e-info-pill">
            <Lock size={12} />
            <span>End-to-end encrypted with NaCl</span>
          </div>
        </div>
      </div>
    );
  }

  const handleSend = (e) => {
    e?.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      setShowEmoji(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group messages by day
  const grouped = [];
  let lastDay = null;
  messages.forEach(msg => {
    const day = getDayLabel(msg.timestamp);
    if (day !== lastDay) {
      grouped.push({ type: 'separator', label: day, id: `sep-${msg.id}` });
      lastDay = day;
    }
    grouped.push({ type: 'message', ...msg });
  });

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <div style={{ position: 'relative' }}>
          <div className="avatar-initials" style={{ width: 40, height: 40, fontSize: '1rem' }}>
            {activeChat.avatar}
          </div>
          {activeChat.online && <span className="online-dot" style={{ bottom: 0, right: 0 }} />}
        </div>
        <div className="chat-header-info">
          <div className="chat-header-name">{activeChat.name}</div>
          <div className="e2e-badge">
            <Lock size={10} /> E2E Encrypted
          </div>
        </div>
        <div className="chat-header-actions">
          <button className="chat-action-btn" title="Voice call"><Phone size={16} /></button>
          <button className="chat-action-btn" title="Video call"><Video size={16} /></button>
          <button className="chat-action-btn" title="More"><MoreVertical size={16} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-area">
        {grouped.length === 0 && (
          <div className="chat-empty-state">
            <Lock size={24} style={{ marginBottom: 8, opacity: 0.4 }} />
            <p>Messages are end-to-end encrypted.<br />Only you and <strong>{activeChat.name}</strong> can read them.</p>
          </div>
        )}

        {grouped.map(item => {
          if (item.type === 'separator') {
            return (
              <div key={item.id} className="date-separator">
                <span>{item.label}</span>
              </div>
            );
          }
          const isMe = item.senderId === 'me';
          return (
            <div key={item.id} className={`message-row ${isMe ? 'sent-row' : 'received-row'}`}>
              <div className={`message-bubble ${isMe ? 'message-sent' : 'message-received'}`}>
                <div className="message-text">{item.text}</div>
                <div className="message-meta">
                  <span>{formatTime(item.timestamp)}</span>
                  {isMe && <Lock size={9} style={{ opacity: 0.7 }} />}
                  {isMe && <span className="read-tick">✓✓</span>}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="typing-indicator-wrap">
            <div className="typing-indicator">
              <span /><span /><span />
            </div>
            <span className="typing-label">{activeChat.name} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      {showEmoji && (
        <div className="emoji-picker">
          {EMOJIS.map(e => (
            <button
              key={e}
              className="emoji-btn"
              onClick={() => setInputValue(prev => prev + e)}
            >
              {e}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form className="chat-input-area" onSubmit={handleSend}>
        <button
          type="button"
          className="emoji-toggle-btn"
          onClick={() => setShowEmoji(v => !v)}
          title="Emoji"
        >
          <Smile size={20} />
        </button>
        <textarea
          className="chat-input"
          placeholder={`Message ${activeChat.name}...`}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!myKeysReady}
          rows={1}
        />
        <button
          type="submit"
          className="send-btn"
          disabled={!inputValue.trim() || !myKeysReady}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
