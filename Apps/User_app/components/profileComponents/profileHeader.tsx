import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProfileHeaderProps {
  name: string;
  title: string;
  points: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, title, points }) => (

  <View style={styles.profileHeader}>
    <View style={styles.decorCircle1} />
    <View style={styles.decorCircle2} />
    
    <View style={styles.profileContent}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name.charAt(0)}</Text>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{name}</Text>
        <Text style={styles.profileTitle}>{title}</Text>
      </View>
      <View style={styles.pointsSection}>
        <Text style={styles.pointsValue}>{points}</Text>
        <Text style={styles.pointsLabel}>Pts</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  profileHeader: {
    backgroundColor: '#f6d44fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    paddingTop: 80,
    flexGrow: 20,
  },
  decorCircle1: {
    position: 'absolute',
    top: -64,
    right: -64,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -48,
    left: -48,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D9502E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileTitle: {
    fontSize: 14,
    color: '#555',
  },
  pointsSection: {
    alignItems: 'flex-end',
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#555',
  },
});

export default ProfileHeader;