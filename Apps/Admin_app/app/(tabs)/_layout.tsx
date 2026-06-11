/**
 * app/(tabs)/_layout.tsx
 *
 * Tab bar layout for Ovena Admin.
 *
 * Tabs:
 *   index    — Home (operator console)
 *   orders   — Orders
 *   riders   — Riders / logistics
 *   analytics — Analytics / revenue
 *   settings — Settings
 *
 * Styling pulls directly from ThemeContext so the tab bar automatically
 * switches between the dark "Dark Void" and light "Parchment" palettes.
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
  {
    name:        'index',
    title:       'Home',
    icon:        'home-outline',
    iconFocused: 'home',
  },
  {
    name:        'stats',
    title:       'Stats',
    icon:        'bar-chart-outline',
    iconFocused: 'bar-chart',
  },
  {
    name:        'support',
    title:       'Support',
    icon:        'chatbubbles-outline',
    iconFocused: 'chatbubbles',
  },
  
  // {
  //   name:        'analytics',
  //   title:       'Analytics',
  //   icon:        'bar-chart-outline',
  //   iconFocused: 'bar-chart',
  // },
  // {
  //   name:        'settings',
  //   title:       'Settings',
  //   icon:        'settings-outline',
  //   iconFocused: 'settings',
  // },
];

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,

        // Colours
        tabBarActiveTintColor:   colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,

        // Background + border
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor:  colors.tabBarBorder,
          borderTopWidth:  1,
          // Remove default shadow on Android; keep elevation 0
          elevation:       0,
          // On iOS give a tiny extra height for the home indicator area
          height:          Platform.OS === 'ios' ? 82 : 62,
          paddingBottom:   Platform.OS === 'ios' ? 24 : 8,
          paddingTop:      8,
        },

        // Label
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
              <Ionicons
                name={focused ? tab.iconFocused : tab.icon}
                size={22}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}