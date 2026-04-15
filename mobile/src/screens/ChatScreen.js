import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Animated,
} from 'react-native';
import { ArrowLeft, Send, Lock, Phone, Video, MoreVertical, Smile } from 'lucide-react-native';
import useEncryption from '../hooks/useEncryption';

const EMOJIS = ['😂', '❤️', '👍', '🔥', '💪', '🎯'];

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getDayLabel(isoString) {
  const d = new Date(isoString);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return 'Today';
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function ChatScreen({ route, navigation }) {
  const { chat } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { keys, encryptMessage, generateDummyKeyPair } = useEncryption();
  const [recipientPublicKey, setRecipientPublicKey] = useState(null);
  const flatListRef = useRef(null);
  const typingTimerRef = useRef(null);
  const typingOpacity = useRef(new Animated.Value(0)).current;

  // Initialize demo key pair for recipient
  useEffect(() => {
    if (keys && !recipientPublicKey) {
      setRecipientPublicKey(generateDummyKeyPair().publicKey);
    }
  }, [keys]);

  // Typing indicator animation
  useEffect(() => {
    if (inputValue) {
      clearTimeout(typingTimerRef.current);
      setIsTyping(true);
      Animated.timing(typingOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      typingTimerRef.current = setTimeout(() => {
        setIsTyping(false);
        Animated.timing(typingOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
      }, 2000);
    } else {
      setIsTyping(false);
      Animated.timing(typingOpacity, { toValue: 0, duration: 150, useNativeDriver: true }).start();
    }
    return () => clearTimeout(typingTimerRef.current);
  }, [inputValue]);

  const handleSend = () => {
    if (!inputValue.trim() || !keys || !recipientPublicKey) return;

    const encryptedData = encryptMessage(inputValue.trim(), recipientPublicKey);

    const newMsg = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputValue.trim(),
      encryptedData,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    setShowEmoji(false);

    // Auto-scroll to bottom
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  // Build list items with date separators
  const listData = [];
  let lastDay = null;
  messages.forEach(msg => {
    const day = getDayLabel(msg.timestamp);
    if (day !== lastDay) {
      listData.push({ type: 'separator', id: `sep-${msg.id}`, label: day });
      lastDay = day;
    }
    listData.push({ type: 'message', ...msg });
  });

  if (isTyping) {
    listData.push({ type: 'typing', id: 'typing' });
  }

  const renderItem = ({ item }) => {
    if (item.type === 'separator') {
      return (
        <View style={styles.dateSeparator}>
          <View style={styles.sepLine} />
          <Text style={styles.sepLabel}>{item.label}</Text>
          <View style={styles.sepLine} />
        </View>
      );
    }
    if (item.type === 'typing') {
      return (
        <Animated.View style={[styles.typingRow, { opacity: typingOpacity }]}>
          <View style={styles.typingBubble}>
            <View style={[styles.typingDot, { animationDelay: '0ms' }]} />
            <View style={[styles.typingDot, { animationDelay: '200ms' }]} />
            <View style={[styles.typingDot, { animationDelay: '400ms' }]} />
          </View>
          <Text style={styles.typingLabel}>{chat.name} is typing...</Text>
        </Animated.View>
      );
    }

    const isMe = item.senderId === 'me';
    return (
      <View style={[styles.messageRow, isMe ? styles.sentRow : styles.receivedRow]}>
        <View style={[styles.messageBubble, isMe ? styles.messageSent : styles.messageReceived]}>
          <Text style={[styles.messageText, isMe && styles.messageTextSent]}>{item.text}</Text>
          <View style={styles.messageMeta}>
            <Text style={[styles.timeText, isMe && styles.timeTextSent]}>
              {formatTime(item.timestamp)}
            </Text>
            {isMe && <Lock color="rgba(0,0,0,0.5)" size={9} />}
            {isMe && <Text style={styles.readTick}>✓✓</Text>}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#FFF" size={22} />
        </TouchableOpacity>
        <View style={styles.avatarInitial}>
          <Text style={styles.avatarText}>{chat.avatar}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{chat.name}</Text>
          <View style={styles.badge}>
            <Lock color="#22C55E" size={10} />
            <Text style={styles.badgeText}>E2E Encrypted</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
            <Phone color="#9CA3AF" size={18} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
            <Video color="#9CA3AF" size={18} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={listData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconWrap}>
                <Lock color="#22C55E" size={28} />
              </View>
              <Text style={styles.emptyTitle}>Encrypted Chat</Text>
              <Text style={styles.emptyText}>
                Messages are secured with end-to-end encryption.{'\n'}
                Only you and {chat.name} can read them.
              </Text>
            </View>
          }
        />

        {/* Emoji Picker */}
        {showEmoji && (
          <View style={styles.emojiPicker}>
            {EMOJIS.map(e => (
              <TouchableOpacity
                key={e}
                style={styles.emojiBtn}
                onPress={() => setInputValue(prev => prev + e)}
              >
                <Text style={styles.emojiText}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.emojiToggle}
            onPress={() => setShowEmoji(v => !v)}
          >
            <Smile color={showEmoji ? '#22C55E' : '#6B7280'} size={22} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#6B7280"
            value={inputValue}
            onChangeText={setInputValue}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputValue.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!inputValue.trim()}
          >
            <Send color={inputValue.trim() ? '#000' : '#6B7280'} size={18} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
    backgroundColor: '#111827',
    gap: 10,
  },
  backBtn: { padding: 6 },
  avatarInitial: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  headerInfo: { flex: 1 },
  headerName: { color: '#FFF', fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34,197,94,0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 3,
  },
  badgeText: { color: '#22C55E', fontSize: 9 },
  headerActions: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Messages
  messagesList: { padding: 16, flexGrow: 1, paddingBottom: 8 },

  // Date separator
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 8,
  },
  sepLine: { flex: 1, height: 1, backgroundColor: '#1F2937' },
  sepLabel: { color: '#6B7280', fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },

  // Messages
  messageRow: { marginBottom: 4 },
  sentRow: { alignItems: 'flex-end' },
  receivedRow: { alignItems: 'flex-start' },
  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  messageSent: {
    backgroundColor: '#22C55E',
    borderBottomRightRadius: 4,
  },
  messageReceived: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderBottomLeftRadius: 4,
  },
  messageText: { color: '#F9FAFB', fontSize: 14, lineHeight: 20 },
  messageTextSent: { color: '#000' },
  messageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 3,
    gap: 3,
  },
  timeText: { color: '#9CA3AF', fontSize: 10 },
  timeTextSent: { color: 'rgba(0,0,0,0.5)' },
  readTick: { color: 'rgba(0,0,0,0.5)', fontSize: 9 },

  // Typing indicator
  typingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  typingBubble: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#6B7280',
  },
  typingLabel: { color: '#6B7280', fontSize: 11 },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    paddingHorizontal: 32,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { color: '#F9FAFB', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  emptyText: { color: '#6B7280', fontSize: 12, textAlign: 'center', lineHeight: 18 },

  // Emoji picker
  emojiPicker: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#111827',
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    gap: 8,
    flexWrap: 'wrap',
  },
  emojiBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: { fontSize: 20 },

  // Input
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingHorizontal: 14,
    backgroundColor: '#111827',
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    alignItems: 'flex-end',
    gap: 10,
  },
  emojiToggle: { padding: 4, paddingBottom: 10 },
  input: {
    flex: 1,
    backgroundColor: '#1F2937',
    color: '#F9FAFB',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
    lineHeight: 20,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  sendBtnDisabled: {
    backgroundColor: '#374151',
    shadowOpacity: 0,
    elevation: 0,
  },
});
