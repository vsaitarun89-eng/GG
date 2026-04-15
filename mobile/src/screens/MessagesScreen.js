import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Animated,
} from 'react-native';
import { Search, Edit2, Lock, Plus } from 'lucide-react-native';

const DUMMY_CHATS = [
  {
    id: '1',
    name: 'Arjun Singh',
    avatar: 'AS',
    lastMessage: 'See you at the gym! 💪',
    time: '10:30 AM',
    online: true,
    unread: 2,
    isGroup: false,
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
  },
  {
    id: '3',
    name: 'Push Day Crew',
    avatar: 'PD',
    lastMessage: 'Rahul: PRed on bench! 🔥',
    time: 'Mon',
    online: false,
    unread: 5,
    isGroup: true,
  },
  {
    id: '4',
    name: 'Sneha Verma',
    avatar: 'SV',
    lastMessage: 'Hey, want to train together?',
    time: 'Sun',
    online: true,
    unread: 1,
    isGroup: false,
  },
  {
    id: '5',
    name: 'Coach Raj',
    avatar: 'CR',
    lastMessage: 'Diet plan updated. Check it.',
    time: 'Sat',
    online: false,
    unread: 0,
    isGroup: false,
  },
];

const FILTER_TABS = ['All', 'Groups', 'Requests'];

export default function MessagesScreen({ navigation }) {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return DUMMY_CHATS.filter(chat => {
      const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filter === 'All' ||
        (filter === 'Groups' && chat.isGroup) ||
        (filter === 'Requests' && false); // Requests would come from API
      return matchesSearch && matchesFilter;
    });
  }, [filter, searchQuery]);

  const renderChat = ({ item }) => (
    <TouchableOpacity
      style={styles.chatRow}
      onPress={() => navigation.navigate('Chat', { chat: item })}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={styles.avatarWrap}>
        <View style={styles.avatarInitial}>
          <Text style={styles.avatarText}>{item.avatar}</Text>
        </View>
        {item.online && <View style={styles.onlineDot} />}
      </View>

      {/* Info */}
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName} numberOfLines={1}>{item.name}</Text>
          <Text style={[styles.chatTime, item.unread > 0 && styles.chatTimeUnread]}>
            {item.time}
          </Text>
        </View>
        <View style={styles.chatPreview}>
          <Lock color="#6B7280" size={10} style={{ marginRight: 4 }} />
          <Text style={styles.chatLastMessage} numberOfLines={1}>{item.lastMessage}</Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerArea}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.editBtnTop}>
          <Edit2 color="#22C55E" size={18} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 16, marginBottom: 4 }}>
        <View style={styles.searchBox}>
          <Search color="#6B7280" size={16} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {FILTER_TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setFilter(tab)}
            style={[styles.filterBtn, filter === tab && styles.filterBtnActive]}
          >
            <Text style={[styles.filterText, filter === tab && styles.filterTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* E2E Banner */}
      <View style={styles.e2eBanner}>
        <Lock color="#22C55E" size={12} />
        <Text style={styles.e2eBannerText}>All messages are end-to-end encrypted</Text>
      </View>

      {/* Conversations */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderChat}
        contentContainerStyle={{ paddingTop: 4, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Lock color="#374151" size={32} style={{ marginBottom: 12 }} />
            <Text style={styles.emptyText}>No conversations found</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Edit2 color="#000" size={22} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },

  headerArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 14,
  },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  editBtnTop: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
    height: 42,
    gap: 8,
  },
  searchInput: { color: '#F9FAFB', flex: 1, fontSize: 14 },

  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  filterBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  filterBtnActive: { borderBottomWidth: 2, borderBottomColor: '#22C55E' },
  filterText: { color: '#6B7280', fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#22C55E' },

  e2eBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: 'rgba(34,197,94,0.04)',
    borderBottomWidth: 1,
    borderBottomColor: '#111827',
  },
  e2eBannerText: { color: '#22C55E', fontSize: 10, opacity: 0.8 },

  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#111827',
    gap: 12,
  },

  avatarWrap: { position: 'relative' },
  avatarInitial: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#0F0F0F',
  },

  chatInfo: { flex: 1, overflow: 'hidden' },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  chatName: { color: '#F9FAFB', fontSize: 15, fontWeight: '600', flex: 1, marginRight: 8 },
  chatTime: { color: '#6B7280', fontSize: 11 },
  chatTimeUnread: { color: '#22C55E' },

  chatPreview: { flexDirection: 'row', alignItems: 'center' },
  chatLastMessage: { color: '#9CA3AF', fontSize: 13, flex: 1 },

  unreadBadge: {
    backgroundColor: '#22C55E',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginLeft: 6,
  },
  unreadText: { color: '#000', fontSize: 10, fontWeight: 'bold' },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: { color: '#374151', fontSize: 14 },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
});
