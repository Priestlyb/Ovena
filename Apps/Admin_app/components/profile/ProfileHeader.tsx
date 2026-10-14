/**
 * components/profile/ProfileHeader.tsx
 *
 * Centred avatar with:
 *  - 112×112 circle, border-2 border-primary-container/30, lava-glow shadow
 *  - Edit button: absolute bottom-right, bg-primary-container, rounded-full
 *    active:scale-95 spring
 *  - Name: headline-md / on-surface
 *  - Role: body-md / on-secondary-container
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';

interface ProfileHeaderProps {
  name:         string;
  role:         string;
  avatarUri?:   string;
  onEditAvatar?: () => void;
}

export function ProfileHeader({ name, role, avatarUri, onEditAvatar }: ProfileHeaderProps) {
  const { colors, isDark } = useTheme();

  const editScale = useRef(new Animated.Value(1)).current;
  const onEditIn  = () => Animated.spring(editScale, { toValue: 0.90, useNativeDriver: true, speed: 50, bounciness: 6 }).start();
  const onEditOut = () => Animated.spring(editScale, { toValue: 1,    useNativeDriver: true, speed: 20, bounciness: 8 }).start();

  return (
    <View style={styles.container}>
      {/* Avatar ring + glow */}
      <View
        style={[
          styles.avatarRing,
          {
            borderColor: `${colors.primaryContainer}4D`,   // /30
            shadowColor: colors.primaryContainer,
          },
        ]}
      >
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
        ) : (
          <View style={[styles.avatarFallback, { backgroundColor: colors.surfaceContainerHigh }]}>
            <Text style={[styles.avatarInitial, { color: colors.primaryContainer }]}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        {/* Edit button — absolute bottom-right */}
        <Animated.View style={[styles.editBtnWrap, { transform: [{ scale: editScale }] }]}>
          <TouchableOpacity
            style={[
              styles.editBtn,
              {
                backgroundColor: colors.primaryContainer,
                borderColor:     colors.surface,
              },
            ]}
            onPress={onEditAvatar}
            onPressIn={onEditIn}
            onPressOut={onEditOut}
            activeOpacity={1}
          >
            <Ionicons name="pencil" size={16} color={colors.onPrimaryContainer} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Name + role */}
      <Text style={[styles.name, { color: colors.onSurface }]}>{name}</Text>
      <Text style={[styles.role, { color: colors.onSecondaryContainer ?? colors.onSurfaceVariant }]}>
        {role}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.xs,
  },
  avatarRing: {
    width:        116,
    height:       116,
    borderRadius: 58,
    borderWidth:  2,
    padding:      3,
    marginBottom: Spacing.sm,
    // lava-glow
    shadowOffset:  { width: 0, height: 0 },
    shadowOpacity: 0.30,
    shadowRadius:  20,
    elevation:     10,
  },
  avatarImg: {
    width:        '100%',
    height:       '100%',
    borderRadius: 999,
  },
  avatarFallback: {
    width:          '100%',
    height:         '100%',
    borderRadius:   999,
    justifyContent: 'center',
    alignItems:     'center',
  },
  avatarInitial: {
    fontFamily:  FontFamily.heading,
    fontSize:    36,
    fontWeight:  '700',
  },
  editBtnWrap: {
    position: 'absolute',
    bottom:   2,
    right:    2,
  },
  editBtn: {
    width:          36,
    height:         36,
    borderRadius:   18,
    borderWidth:    3,
    justifyContent: 'center',
    alignItems:     'center',
  },
  name: {
    fontFamily:    FontFamily.heading,
    fontSize:      24,
    fontWeight:    '600',
    lineHeight:    32,
    letterSpacing: -0.3,
  },
  role: {
    fontFamily: FontFamily.body,
    fontSize:   14,
    lineHeight: 20,
  },
});