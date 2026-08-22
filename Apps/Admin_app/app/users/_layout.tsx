/**
 * app/users/_layout.tsx
 *
 * Stack for everything reached from the Users tab: the directory itself
 * lives at app/(tabs)/users.tsx, but drill-down screens (profiles, support
 * hub) live here as a normal stack, matching the app/order/, app/orders/
 * pattern already used elsewhere.
 */

import { useTheme } from '@/context/ThemeContext';
import { Stack } from 'expo-router';


export default function UsersLayout() {
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