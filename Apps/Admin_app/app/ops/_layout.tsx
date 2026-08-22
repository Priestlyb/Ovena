/**
 * app/ops/_layout.tsx
 *
 * Stack for everything reached from the Ops tab: promotion creation,
 * notification sending, banner management — mirrors app/users/_layout.tsx.
 */

import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function OpsLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}