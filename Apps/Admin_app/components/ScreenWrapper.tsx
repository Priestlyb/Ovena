/**
 * components/ScreenWrapper.tsx
 *
 * Wraps every screen with correct top padding so content never hides behind
 * the device status bar. Uses useSafeAreaInsets() which works correctly on
 * all Android and iOS devices including notched / punch-hole / Dynamic Island.
 *
 * Usage:
 *   import ScreenWrapper from "@/components/ScreenWrapper";
 *
 *   const MyScreen = () => (
 *     <ScreenWrapper>
 *       {your screen content}
 *     </ScreenWrapper>
 *   );
 *
 * Props:
 *   style       — extra ViewStyle applied to the outer container
 *   noPadding   — set to true to opt out of the safe-area top padding
 *                 (useful for screens whose header handles it manually)
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';

interface ScreenWrapperProps {
  children:   React.ReactNode;
  style?:     ViewStyle;
  /** Skip automatic top safe-area padding. Default: false */
  noPadding?: boolean;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  noPadding = false,
}) => {
  const { colors } = useTheme();
  const insets      = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: colors.background },
        !noPadding && { paddingTop: insets.top },
        style,
      ]}
    >
      <StatusBar
        barStyle={colors.statusBarStyle}
        backgroundColor={colors.background}
        translucent={false}
      />
      {children}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
});