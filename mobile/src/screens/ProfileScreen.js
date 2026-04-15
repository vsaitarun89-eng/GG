import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Share2, Edit3, Settings, Trophy, Flame, Sparkles, MapPin, Activity, CheckCircle, ChevronRight, LogOut } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';

export default function ProfileScreen() {
  const { logout, userInfo } = useContext(AuthContext);

  const StatBox = ({ label, value, highlight }) => (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, highlight && { color: '#22C55E' }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.iconBtn}>
            <Share2 color="#9CA3AF" size={20} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileTop}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarLetter}>{userInfo?.fullName ? userInfo.fullName[0] : 'T'}</Text>
              <View style={styles.activeDot} />
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Edit3 color="#9CA3AF" size={14} />
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.name}>{userInfo?.fullName || 'Tarun'}</Text>
          <View style={styles.newbieBadge}>
            <Text style={styles.newbieText}>NEWBIE</Text>
          </View>

          <View style={styles.tagsRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Gold's Gym</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Mumbai</Text>
            </View>
            <View style={[styles.tag, { borderColor: '#22C55E' }]}>
              <Text style={[styles.tagText, { color: '#22C55E' }]}>Lose Fat</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatBox label="POSTS" value="0" />
          <View style={styles.divider} />
          <StatBox label="FOLLOWERS" value="0" />
          <View style={styles.divider} />
          <StatBox label="FOLLOWING" value="0" />
          <View style={styles.divider} />
          <StatBox label="GP" value="50" highlight />
        </View>

        {/* Workout Streak */}
        <View style={styles.streakWidget}>
          <View style={styles.streakHeader}>
            <Text style={styles.streakTitle}>Workout Streak</Text>
            <Text style={styles.streakSub}>Last 12 weeks</Text>
          </View>
          
          <View style={styles.streakStats}>
            <View style={styles.streakStatBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Flame color="#EF4444" size={16} />
                <Text style={styles.streakStatLabel}>CURRENT</Text>
              </View>
              <Text style={styles.streakStatValue}>0 <Text style={{ fontSize: 12, color: '#9CA3AF' }}>days</Text></Text>
            </View>
            <View style={styles.streakStatBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Trophy color="#22C55E" size={16} />
                <Text style={styles.streakStatLabel}>BEST</Text>
              </View>
              <Text style={styles.streakStatValue}>1 <Text style={{ fontSize: 12, color: '#9CA3AF' }}>days</Text></Text>
            </View>
          </View>

          {/* Graph Placeholder */}
          <View style={styles.graphPlaceholder}>
             {[...Array(12)].map((_, i) => (
                <View key={i} style={styles.graphCol}>
                  <View style={[styles.graphBar, i === 11 && { height: 10, backgroundColor: '#22C55E' }]} />
                </View>
             ))}
          </View>
          <View style={styles.graphFooter}>
            <Text style={styles.graphFooterText}>0 sessions in 12 weeks</Text>
            <Text style={[styles.graphFooterText, { color: '#22C55E' }]}>Less — More</Text>
          </View>
        </View>

        {/* Badges */}
        <View style={styles.badgesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Badges</Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.viewAllText}>View all 19</Text>
              <ChevronRight color="#22C55E" size={16} />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesScroll}>
            {[
              { icon: <Sparkles color="#FCD34D" size={24} />, title: "Welcome to GainGrid" },
              { icon: <Activity color="#60A5FA" size={24} />, title: "First Step" },
              { icon: <MapPin color="#F43F5E" size={24} />, title: "Peak Planner" },
              { icon: <CheckCircle color="#A78BFA" size={24} />, title: "Iron Will" },
              { icon: <Trophy color="#F97316" size={24} />, title: "Bodyweight Boss" },
            ].map((badge, i) => (
              <View key={i} style={styles.badgeItem}>
                <View style={styles.badgeIconWrapper}>{badge.icon}</View>
                <Text style={styles.badgeText}>{badge.title}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Milestone Ladder */}
        <TouchableOpacity style={styles.ladderBtn}>
          <Trophy color="#22C55E" size={20} />
          <Text style={styles.ladderText}>Milestone Ladder</Text>
          <ChevronRight color="#9CA3AF" size={20} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <LogOut color="#EF4444" size={18} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
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
    padding: 20,
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileTop: {
    paddingHorizontal: 20,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#064E3B',
    borderWidth: 2,
    borderColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarLetter: {
    color: '#22C55E',
    fontSize: 32,
    fontWeight: 'bold',
  },
  activeDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    backgroundColor: '#22C55E',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#0F0F0F',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  editBtnText: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: 'bold',
  },
  name: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  newbieBadge: {
    backgroundColor: '#1F2937',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
  },
  newbieText: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    marginBottom: 24,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: '#111827',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 24,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    backgroundColor: '#1F2937',
  },
  streakWidget: {
    backgroundColor: '#0A1310', // Dark green tint
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#064E3B',
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  streakTitle: { color: '#E5E7EB', fontWeight: 'bold' },
  streakSub: { color: '#6B7280', fontSize: 12 },
  streakStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  streakStatBox: {
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  streakStatLabel: { color: '#9CA3AF', fontSize: 10, fontWeight: 'bold' },
  streakStatValue: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  graphPlaceholder: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#1F2937',
    paddingBottom: 4,
    paddingLeft: 4,
    marginBottom: 8,
  },
  graphCol: { width: 14, height: '100%', justifyContent: 'flex-end', alignItems: 'center' },
  graphBar: { width: 8, backgroundColor: '#1F2937', borderRadius: 2, height: 4 },
  graphFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  graphFooterText: { color: '#6B7280', fontSize: 10 },
  badgesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  viewAllText: { color: '#22C55E', fontSize: 12, fontWeight: 'bold', marginRight: 4 },
  badgesScroll: { flexDirection: 'row' },
  badgeItem: { width: 80, alignItems: 'center', marginRight: 12 },
  badgeIconWrapper: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#111827',
    borderWidth: 1, borderColor: '#1F2937', alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  badgeText: { color: '#9CA3AF', fontSize: 10, textAlign: 'center', lineHeight: 14 },
  ladderBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#111827',
    marginHorizontal: 20, padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#1F2937',
    marginBottom: 24,
  },
  ladderText: { color: '#D1D5DB', fontWeight: 'bold', marginLeft: 12 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 20, padding: 16, borderRadius: 8,
    borderWidth: 1, borderColor: '#7F1D1D', backgroundColor: '#450A0A', gap: 8,
  },
  logoutText: { color: '#FCA5A5', fontWeight: 'bold' }
});
