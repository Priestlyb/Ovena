/**
 * app/(tabs)/_layout.tsx
 *
 * Tabs: Home, Stats, Users.
 * Support Hub is no longer a tab — it now lives at /users/support, reached
 * from the Users tab's directory screen.
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab }  from '@/components/haptic-tab';
import { useTheme }   from '@/context/ThemeContext';
import { FontFamily } from '@/constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  name:       string;
  title:      string;
  icon:       IoniconsName;
  iconFocused: IoniconsName;
}

const TABS: TabConfig[] = [
  { name: 'index', title: 'Home',  icon: 'home-outline',       iconFocused: 'home' },
  { name: 'stats', title: 'Stats', icon: 'bar-chart-outline',  iconFocused: 'bar-chart' },
  { name: 'ops',   title: 'Ops',   icon: "stopwatch-outline",   iconFocused: 'stopwatch' },
  { name: 'users', title: 'Users', icon: 'people-outline',     iconFocused: 'people' },
  { name: 'settings', title: 'Settings', icon: 'settings-outline', iconFocused: 'settings' }
];

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor:   colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor:  colors.tabBarBorder,
          borderTopWidth:  1,
          elevation:       0,
          height:          Platform.OS === 'ios' ? 82 : 62,
          paddingBottom:   Platform.OS === 'ios' ? 24 : 8,
          paddingTop:      8,
        },
        tabBarLabelStyle: {
          fontFamily:    FontFamily.mono,
          fontSize:      10,
          fontWeight:    '500',
          letterSpacing: 0.4,
        },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? tab.iconFocused : tab.icon} size={22} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}