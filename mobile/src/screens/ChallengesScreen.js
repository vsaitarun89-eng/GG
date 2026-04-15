import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Award } from 'lucide-react-native';

export default function ChallengesScreen() {
  return (
    <View style={styles.container}>
      <Award color="#EAB308" size={48} />
      <Text style={styles.title}>Your Challenges</Text>
      <Text style={styles.subtitle}>Join global fitness challenges</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#F9FAFB',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  subtitle: {
    color: '#9CA3AF',
    marginTop: 8,
  }
});
