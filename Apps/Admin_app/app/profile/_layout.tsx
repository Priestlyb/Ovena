/**
 * app/profile/_layout.tsx
 *
 * Stack layout for the profile route group.
 * Header is hidden globally — ProfileScreen renders its own top bar.
 */

import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_left' }} />
  );
}