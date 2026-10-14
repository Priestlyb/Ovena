/**
 * components/support/ResolveConfirmModal.tsx
 *
 * Bottom-sheet confirmation that appears when the admin swipes a thread right.
 * "Closing this chat confirms problem solved"
 * Two buttons: Confirm (lava) | Cancel (ghost)
 *
 * Uses the same spring slide-in pattern as profile modals.
 */

import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface ResolveConfirmModalProps {
  visible:    boolean;
  threadName: string;
  onConfirm:  () => void;
  onCancel:   () => void;
}

export function ResolveConfirmModal({
  visible,
  threadName,
  onConfirm,
  onCancel,
}: ResolveConfirmModalProps) {
  const { colors, isDark } = useTheme();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 20, bounciness: 4 }),
        Animated.timing(backdropOp, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: SCREEN_HEIGHT, duration: 240, useNativeDriver: true }),
        Animated.timing(backdropOp, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const cardBg = isDark ? '#1b1b1e' : colors.surfaceContainerLow;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOp }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: cardBg,
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : colors.border,
            transform: [{ translateY }],
          },
        ]}
      >
        {/* Handle */}
        <View style={[styles.handle, { backgroundColor: colors.outlineVariant }]} />

        {/* Icon */}
        <View style={[styles.iconCircle, { backgroundColor: `${colors.primaryContainer}20` }]}>
          <Ionicons name="checkmark-circle" size={36} color={colors.primaryContainer} />
        </View>

        {/* Copy */}
        <Text style={[styles.title, { color: colors.onSurface }]}>
          Close Chat with {threadName}?
        </Text>
        <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
          Closing this chat confirms problem solved. This action cannot be undone.
        </Text>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.cancelBtn, { borderColor: colors.border }]}
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <Text style={[styles.cancelText, { color: colors.onSurfaceVariant }]}>
              Keep Open
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmBtn, { backgroundColor: colors.primaryContainer }]}
            onPress={onConfirm}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark" size={18} color={colors.onPrimaryContainer} />
            <Text style={[styles.confirmText, { color: colors.onPrimaryContainer }]}>
              Confirm Resolved
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.60)',
  },
  sheet: {
    position:             'absolute',
    bottom:               0,
    left:                 0,
    right:                0,
    borderTopLeftRadius:  28,
    borderTopRightRadius: 28,
    borderWidth:          1,
    borderBottomWidth:    0,
    padding:              Spacing.lg,
    paddingBottom:        Platform.OS === 'ios' ? 40 : Spacing.xl,
    gap:                  Spacing.md,
    alignItems:           'center',
  },
  handle: {
    width:        40,
    height:       4,
    borderRadius: 2,
    marginBottom: Spacing.xs,
  },
  iconCircle: {
    width:          72,
    height:         72,
    borderRadius:   36,
    justifyContent: 'center',
    alignItems:     'center',
    marginVertical: Spacing.sm,
  },
  title: {
    fontFamily:    FontFamily.heading,
    fontSize:      20,
    fontWeight:    '600',
    letterSpacing: -0.2,
    textAlign:     'center',
  },
  subtitle: {
    fontFamily:  FontFamily.body,
    fontSize:    14,
    lineHeight:  22,
    textAlign:   'center',
    paddingHorizontal: Spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap:           Spacing.sm,
    width:         '100%',
    marginTop:     Spacing.xs,
  },
  cancelBtn: {
    flex:           1,
    height:         52,
    borderRadius:   Radius.full,
    borderWidth:    1,
    justifyContent: 'center',
    alignItems:     'center',
  },
  cancelText: {
    fontFamily:  FontFamily.body,
    fontSize:    15,
    fontWeight:  '500',
  },
  confirmBtn: {
    flex:           1,
    height:         52,
    borderRadius:   Radius.full,
    flexDirection:  'row',
    justifyContent: 'center',
    alignItems:     'center',
    gap:            6,
  },
  confirmText: {
    fontFamily:  FontFamily.heading,
    fontSize:    15,
    fontWeight:  '700',
  },
});