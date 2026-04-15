import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, RefreshControl, Linking } from 'react-native';
import { PostContext } from '../context/PostContext';
import { Target, Dumbbell, History, Trophy, Plus, RefreshCw, Activity, TrendingUp } from 'lucide-react-native';

const STORIES = [
  { id: '1', name: 'Your Story', add: true, avatar: null },
  { id: '2', name: 'Arjun S.', add: false, avatar: 'AS' },
  { id: '3', name: 'Priya R.', add: false, avatar: 'PR' },
  { id: '4', name: 'Rahul M.', add: false, avatar: 'RM' },
  { id: '5', name: 'Sneha V.', add: false, avatar: 'SV' },
];

export default function FeedScreen() {
  const { posts } = useContext(PostContext);
  const [activeTab, setActiveTab] = useState('Home');
  const [refreshing, setRefreshing] = useState(false);

  const SubNavTabs = () => (
    <View style={styles.subNav}>
      {['Home', 'My Gym', 'Challenges', 'GainClips'].map(tab => (
        <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.subNavItem}>
          <Text style={[styles.subNavText, activeTab === tab && styles.subNavTextActive]}>{tab}</Text>
          {activeTab === tab && <View style={styles.subNavUnderline} />}
        </TouchableOpacity>
      ))}
    </View>
  );

  const ListHeader = () => (
    <View style={styles.listHeaderContainer}>
      <SubNavTabs />

      {/* Stories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesScroll}>
        {STORIES.map((story) => (
          <View key={story.id} style={styles.storyContainer}>
            <View style={[styles.storyAvatarOuter, story.add && styles.storyAvatarOuterAdd]}>
              <View style={styles.storyAvatarInner}>
                {story.add ? (
                  <Plus color="#22C55E" size={24} />
                ) : (
                  <Text style={styles.storyAvatarLetters}>{story.avatar}</Text>
                )}
              </View>
            </View>
            <Text style={styles.storyName} numberOfLines={1}>{story.name}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Streak Block */}
      <View style={styles.streakBlock}>
        <View style={styles.streakHeaderRow}>
          <Text style={styles.streakTitle}>🚀 DAY STREAK</Text>
          <Text style={styles.streakCount}>4/5</Text>
        </View>
        <Text style={styles.streakSub}>You're on fire! Don't lose your streak!</Text>
        <View style={styles.streakBarOuter}>
          <View style={styles.streakBarInner} />
        </View>
        <Text style={styles.nextMilestone}>NEXT MILESTONE: 5 DAYS</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <View style={styles.quickActionsBox}>
          <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionsGrid}>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: 'rgba(34,197,94,0.05)', borderColor: 'rgba(34,197,94,0.2)' }]}>
              <Dumbbell color="#22C55E" size={24} />
              <Text style={[styles.actionCardText, { color: '#22C55E' }]}>LOG WORKOUT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: 'rgba(249,115,22,0.05)', borderColor: 'rgba(249,115,22,0.2)' }]}>
              <Trophy color="#F97316" size={24} />
              <Text style={[styles.actionCardText, { color: '#F97316' }]}>MY PRs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.2)' }]}>
              <History color="#3B82F6" size={24} />
              <Text style={[styles.actionCardText, { color: '#3B82F6' }]}>HISTORY</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: 'rgba(168,85,247,0.05)', borderColor: 'rgba(168,85,247,0.2)' }]}>
              <Target color="#A855F7" size={24} />
              <Text style={[styles.actionCardText, { color: '#A855F7' }]}>CHALLENGES</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: 'rgba(216,180,254,0.05)', borderColor: 'rgba(216,180,254,0.2)' }]} onPress={() => Linking.openURL('https://gaingrid.figma.site/planner')}>
              <Activity color="#D8B4FE" size={24} />
              <Text style={[styles.actionCardText, { color: '#D8B4FE' }]}>PLANNER</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: 'rgba(94,234,212,0.05)', borderColor: 'rgba(94,234,212,0.2)' }]} onPress={() => Linking.openURL('https://gaingrid.figma.site/dashboard')}>
              <TrendingUp color="#5EEAD4" size={24} />
              <Text style={[styles.actionCardText, { color: '#5EEAD4' }]}>PROGRESS</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* Feed Divider */}
      <View style={styles.feedHeaderRow}>
        <Text style={styles.feedPostCount}>{posts.length} posts</Text>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <RefreshCw color="#6B7280" size={12} />
          <Text style={styles.feedRefreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postAvatarOuter}>
          <Text style={styles.postAvatarLetter}>{item.avatarLetters || item.user[0]}</Text>
        </View>
        <View>
          <Text style={styles.postUserName}>{item.user}</Text>
          <Text style={styles.postMeta}>{item.location} • {item.timeAgo}</Text>
        </View>
      </View>

      <View style={styles.postMediaContainer}>
        {item.media && (
          <Image source={{ uri: item.media }} style={styles.postMedia} resizeMode="cover" />
        )}
        {item.badgeName && (
          <View style={styles.badgeOverlay}>
            <Trophy color="#FCD34D" size={14} />
            <Text style={styles.badgeOverlayText}>{item.badgeName}</Text>
          </View>
        )}
      </View>

      <View style={styles.postContentContainer}>
        {item.title && <Text style={styles.postTitle}>{item.title}</Text>}
        <Text style={styles.postContent}>{item.content}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={renderPost}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
          setRefreshing(true);
          setTimeout(() => setRefreshing(false), 800);
        }} tintColor="#22C55E" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  // Sub Nav
  subNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  subNavItem: {
    position: 'relative',
    paddingBottom: 6,
  },
  subNavText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subNavTextActive: {
    color: '#22C55E',
  },
  subNavUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#22C55E',
    borderRadius: 2,
  },
  // Stories
  storiesScroll: {
    paddingLeft: 20,
    marginBottom: 24,
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 60,
  },
  storyAvatarOuter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#4B5563',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  storyAvatarOuterAdd: {
    borderStyle: 'dashed',
    borderColor: '#22C55E',
  },
  storyAvatarInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyAvatarLetters: {
    color: '#D1D5DB',
    fontWeight: 'bold',
    fontSize: 16,
  },
  storyName: {
    color: '#9CA3AF',
    fontSize: 10,
    textAlign: 'center',
  },
  // Streak
  streakBlock: {
    marginHorizontal: 16,
    backgroundColor: '#082F49',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  streakHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  streakTitle: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  streakCount: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  streakSub: {
    color: '#E0F2FE',
    fontSize: 14,
    marginBottom: 16,
  },
  streakBarOuter: {
    height: 8,
    backgroundColor: '#0C4A6E',
    borderRadius: 4,
    marginBottom: 8,
  },
  streakBarInner: {
    width: '80%',
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 4,
  },
  nextMilestone: {
    color: '#BAE6FD',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Quick Actions
  quickActionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  quickActionsBox: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 12,
    paddingTop: 16,
    paddingBottom: 16,
  },
  sectionLabel: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
  },
  actionCard: {
    width: 105,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  actionCardText: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  // Feed
  feedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  feedPostCount: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: 'bold',
  },
  feedRefreshText: {
    color: '#6B7280',
    fontSize: 12,
  },
  postCard: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
    paddingBottom: 24,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  postAvatarOuter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#064E3B',
    borderWidth: 1,
    borderColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  postAvatarLetter: {
    color: '#22C55E',
    fontWeight: 'bold',
    fontSize: 12,
  },
  postUserName: {
    color: '#F9FAFB',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  postMeta: {
    color: '#6B7280',
    fontSize: 10,
  },
  postMediaContainer: {
    position: 'relative',
    height: 300,
    width: '100%',
    marginBottom: 12,
  },
  postMedia: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    backgroundColor: 'rgba(31, 41, 55, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  badgeOverlayText: {
    color: '#FCD34D',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  postContentContainer: {
    paddingHorizontal: 16,
  },
  postTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  postContent: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 18,
  }
});
