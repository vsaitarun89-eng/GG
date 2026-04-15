import React, { useContext } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Search, MapPin, Trophy, X, ChevronDown } from 'lucide-react-native';
import { PostContext } from '../context/PostContext';

export default function ExploreScreen() {
  const { posts } = useContext(PostContext);

  // We can duplicate the posts array locally if needed to fill the grid, or just use what's in context
  const displayPosts = [...posts, ...posts, ...posts]; // mock more posts for grid look

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
           <View style={{ width: 14, height: 14, backgroundColor: '#22C55E', borderRadius: 2 }} />
           <Text style={styles.logoText}>GainGrid</Text>
        </View>
        <View style={styles.searchBox}>
          <Search color="#6B7280" size={14} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search athletes..."
            placeholderTextColor="#6B7280"
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <TouchableOpacity style={styles.banner}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MapPin color="#22C55E" size={16} />
            <Text style={styles.bannerTitle}>Find Your Gym →</Text>
          </View>
          <Text style={styles.bannerSub}>Discover gyms near you</Text>
        </TouchableOpacity>

        {/* Filter Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ paddingHorizontal: 20 }}>
          <View style={[styles.filterPill, styles.filterPillActive]}>
            <Text style={styles.filterPillActiveText}>All</Text>
            <X color="#166534" size={12} style={{ marginLeft: 4 }} />
          </View>
          <View style={styles.filterPill}>
             <Trophy color="#9CA3AF" size={12} style={{ marginRight: 4 }} />
            <Text style={styles.filterPillText}>PRs</Text>
          </View>
          <View style={styles.filterPill}>
             <Text style={styles.filterPillText}>🔥 Transformations</Text>
          </View>
          <View style={styles.filterPill}>
             <Text style={styles.filterPillText}>🌱 Beginners</Text>
          </View>
        </ScrollView>

        {/* Cities Row */}
        <View style={styles.citiesRow}>
          <TouchableOpacity style={styles.cityDropdown}>
            <MapPin color="#9CA3AF" size={14} />
            <Text style={styles.cityText}>All Cities</Text>
            <ChevronDown color="#9CA3AF" size={14} />
          </TouchableOpacity>
          <Text style={styles.postCountText}>7 posts</Text>
        </View>

        {/* Grid Feed */}
        <View style={styles.gridContainer}>
          {displayPosts.map((item, index) => (
            <View key={index} style={styles.gridItem}>
              <View style={styles.mediaFrame}>
                {item.media ? (
                  <Image source={{ uri: item.media }} style={styles.mediaImg} />
                ) : (
                  <View style={styles.mediaPlaceholder} />
                )}
                {/* Badge overlay on top right implicitly matching Figma or bottom */}
                <View style={styles.gridBadge}>
                  <Text style={styles.gridBadgeAvatar}>{item.avatarLetters || 'A'}</Text>
                </View>
              </View>
              {item.title && <Text style={styles.gridTitle} numberOfLines={2}>{item.title}</Text>}
              <Text style={styles.gridSubText}>@{item.user.toLowerCase().replace(' ', '')}</Text>
            </View>
          ))}
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  logoText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#1F2937',
    height: 32,
    flex: 0.8,
  },
  searchInput: {
    color: '#F9FAFB',
    marginLeft: 6,
    flex: 1,
    fontSize: 12,
  },
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#062817', // Dark greenish tint
    marginHorizontal: 20,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#064E3B',
    marginBottom: 20,
  },
  bannerTitle: { color: '#4ADE80', fontWeight: 'bold', fontSize: 14 },
  bannerSub: { color: '#9CA3AF', fontSize: 12 },
  filterScroll: {
    marginBottom: 16,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: '#14532D', // Green dark
    borderColor: '#22C55E',
  },
  filterPillText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterPillActiveText: {
    color: '#4ADE80',
    fontSize: 12,
    fontWeight: 'bold',
  },
  citiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  cityDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#1F2937',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cityText: { color: '#D1D5DB', fontSize: 12, fontWeight: 'bold' },
  postCountText: { color: '#6B7280', fontSize: 12 },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 20,
  },
  mediaFrame: {
    width: '100%',
    aspectRatio: 1, // square cards in discover
    backgroundColor: '#1F2937',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaImg: { width: '100%', height: '100%' },
  mediaPlaceholder: { flex: 1, backgroundColor: '#374151' },
  gridBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#064E3B',
    borderWidth: 1,
    borderColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridBadgeAvatar: { color: '#22C55E', fontSize: 10, fontWeight: 'bold' },
  gridTitle: { color: '#FFF', fontSize: 11, fontWeight: 'bold', marginBottom: 2, textTransform: 'uppercase' },
  gridSubText: { color: '#6B7280', fontSize: 10 },
});
