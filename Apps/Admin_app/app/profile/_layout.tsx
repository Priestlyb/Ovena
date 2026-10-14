/**
 * app/profile/_layout.tsx
 *
 * Stack layout for the profile route group.
 * Header is hidden globally — ProfileScreen renders its own top bar.
 */

import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function ProfileLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_left',
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}