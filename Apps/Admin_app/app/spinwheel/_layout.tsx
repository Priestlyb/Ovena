import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
export default function SpinwheelLayout() {
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