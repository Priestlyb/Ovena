// app/(tabs)/profile.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import ProfileHeader from '@/components/profileComponents/profileHeader';
import MenuItem from '@/components/profileComponents/menuItem';

export default function ProfileTab() {
  const menuItems = [
    { iconName: 'bag-outline' as const, label: 'Orders' },
    { iconName: 'heart-outline' as const, label: 'Favourites' },
    { iconName: 'person-outline' as const, label: 'Account' },
    { iconName: 'settings-outline' as const, label: 'Current Settings' },
    { iconName: 'help-circle-outline' as const, label: 'FAQ' },
    { iconName: 'card-outline' as const, label: 'Payment' },
    { iconName: 'globe-outline' as const, label: 'Languages' },
    { iconName: 'log-out-outline' as const, label: 'Log Out' }
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header - Full Width */}
        <ProfileHeader
          name="Priority"
          title="Eggheard Officer"
          points="0.00"
          // onHelpPress={() => console.log('Help pressed')}
        />

        {/* Menu Items - Full Width, Layered Over Header */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              iconName={item.iconName}
              label={item.label}
              onPress={() => console.log(`${item.label} pressed`)}
            />
          ))}
        </View>

        {/* Version Footer */}
        <Text style={styles.versionText}>version 1.0017.022.6740</Text>
      </ScrollView>

      {/* Bottom Yellow Accent */}
      <View style={styles.bottomAccent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  scrollContent: {
    flexGrow: 1,
    display: 'flex',
  },
  menuContainer: {
    backgroundColor: '#ffffffff',
    marginTop: -60,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 40,
    overflow: 'hidden',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 32,
    fontSize: 12,
    color: '#999',
    backgroundColor: '#fff',
    paddingVertical: 16,
  },
  bottomAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#F6D44F',
  },
});