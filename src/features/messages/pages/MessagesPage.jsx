import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';
import useEncryption from '../hooks/useEncryption';
import './MessagesPage.css';

const DUMMY_CONVERSATIONS = [
  {
    id: '1',
    name: 'Arjun Singh',
    avatar: 'AS',
    lastMessage: 'See you at the gym! 💪',
    time: '10:30 AM',
    online: true,
    unread: 2,
    isGroup: false,
    isRequest: false,
    publicKey: null,
  },
  {
    id: '2',
    name: 'Priya R',
    avatar: 'PR',
    lastMessage: 'Are we still doing legs today?',
    time: 'Yesterday',
    online: false,
    unread: 0,
    isGroup: false,
    isRequest: false,
    publicKey: null,
  },
  {
    id: '3',
    name: 'Push Day Crew',
    avatar: 'PD',
    lastMessage: 'Rahul: PRed on bench today! 🔥',
    time: 'Mon',
    online: false,
    unread: 5,
    isGroup: true,
    isRequest: false,
    publicKey: null,
  },
  {
    id: '4',
    name: 'Sneha Verma',
    avatar: 'SV',
    lastMessage: 'Hey, want to train together?',
    time: 'Sun',
    online: true,
    unread: 1,
    isRequest: true,
    isGroup: false,
    publicKey: null,
  },
  {
    id: '5',
    name: 'Coach Raj',
    avatar: 'CR',
    lastMessage: 'Diet plan updated. Check it out.',
    time: 'Sat',
    online: false,
    unread: 0,
    isGroup: false,
    isRequest: false,
    publicKey: null,
  },
];

// Seeded demo messages
const SEED_MESSAGES = {
  '1': [
    {
      id: 'm1',
      senderId: 'other',
      text: 'Hey! You coming to the gym tonight?',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'm2',
      senderId: 'me',
      text: 'Yeah, planning to hit chest and triceps.',
      timestamp: new Date(Date.now() - 3600000 * 1.9).toISOString(),
    },
    {
      id: 'm3',
      senderId: 'other',
      text: 'Perfect! I\'ll join you. Meet at 7?',
      timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString(),
    },
    {
      id: 'm4',
      senderId: 'me',
      text: '7 works. See you at the gym! 💪',
      timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString(),
    },
    {
      id: 'm5',
      senderId: 'other',
      text: 'See you at the gym! 💪',
      timestamp: new Date(Date.now() - 3600000 * 0.2).toISOString(),
    },
  ],
};

export default function MessagesPage() {
  const { keys, generateDummyKeyPair, encryptMessage } = useEncryption();
  const [activeChat, setActiveChat] = useState(null);
  const [conversations, setConversations] = useState(DUMMY_CONVERSATIONS);
  const [messages, setMessages] = useState(SEED_MESSAGES);

  // Assign dummy public keys to all conversations for demo E2E
  useEffect(() => {
    if (keys && !conversations[0].publicKey) {
      const updated = conversations.map(c => ({
        ...c,
        publicKey: generateDummyKeyPair().publicKey,
      }));
      setConversations(updated);
    }
  }, [keys]);

  const handleSendMessage = (text) => {
    if (!activeChat || !text.trim()) return;

    // Encrypt message using NaCl box (what would be sent to server)
    const encryptedData = activeChat.publicKey
      ? encryptMessage(text, activeChat.publicKey)
      : null;

    const newMsg = {
      id: Date.now().toString(),
      senderId: 'me',
      text,
      encryptedData,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMsg],
    }));

    // Clear unread count when chatting
    setConversations(prev =>
      prev.map(c =>
        c.id === activeChat.id ? { ...c, lastMessage: text, time: 'Now', unread: 0 } : c
      )
    );
  };

  const handleSelectChat = (conv) => {
    setActiveChat(conv);
    // Mark as read
    setConversations(prev =>
      prev.map(c => (c.id === conv.id ? { ...c, unread: 0 } : c))
    );
  };

  return (
    <MainLayout fullWidth>
      <div className="messages-container animate-fade-in">
        <ConversationList
          conversations={conversations}
          activeChat={activeChat}
          onSelectChat={handleSelectChat}
        />
        <ChatWindow
          activeChat={activeChat}
          messages={activeChat ? (messages[activeChat.id] || []) : []}
          onSendMessage={handleSendMessage}
          myKeysReady={!!keys}
        />
      </div>
    </MainLayout>
  );
}
