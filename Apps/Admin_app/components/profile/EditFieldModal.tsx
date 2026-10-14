/**
 * components/profile/EditFieldModal.tsx
 *
 * Bottom-sheet modal for editing a single text field.
 * Slides in from the bottom with a spring animation.
 * Used for Full Name, Email Address, and Password Change.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface EditFieldModalProps {
  visible:       boolean;
  title:         string;
  label:         string;
  value:         string;
  placeholder?:  string;
  secureText?:   boolean;
  keyboardType?: 'default' | 'email-address';
  onSave:        (value: string) => void;
  onClose:       () => void;
}

export function EditFieldModal({
  visible,
  title,
  label,
  value,
  placeholder,
  secureText = false,
  keyboardType = 'default',
  onSave,
  onClose,
}: EditFieldModalProps) {
  const { colors, isDark } = useTheme();
  const [draft, setDraft]     = useState(value);
  const [showPw, setShowPw]   = useState(false);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOp = useRef(new Animated.Value(0)).current;

  // Sync draft when value changes externally
  useEffect(() => { setDraft(value); }, [value]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue:        0,
          useNativeDriver: true,
          speed:          20,
          bounciness:     4,
        }),
        Animated.timing(backdropOp, {
          toValue:        1,
          duration:       220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue:        SCREEN_HEIGHT,
          duration:       240,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOp, {
          toValue:        0,
          duration:       200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleSave = () => {
    onSave(draft.trim());
    onClose();
  };

  const cardBg   = isDark ? '#1b1b1e' : colors.surfaceContainerLow;
  const inputBg  = isDark ? colors.surfaceContainerHigh : colors.surfaceContainer;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOp }]} />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kavWrapper}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: cardBg,
              borderColor:     isDark ? 'rgba(255,255,255,0.08)' : colors.border,
              transform:       [{ translateY }],
            },
          ]}
        >
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: colors.outlineVariant }]} />

          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: colors.onSurface }]}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Input */}
          <Text style={[styles.inputLabel, { color: colors.onSurfaceVariant }]}>
            {label.toUpperCase()}
          </Text>
          <View style={[styles.inputWrap, { backgroundColor: inputBg, borderColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.onSurface }]}
              value={draft}
              onChangeText={setDraft}
              placeholder={placeholder ?? label}
              placeholderTextColor={colors.onSurfaceVariant + '80'}
              keyboardType={keyboardType}
              secureTextEntry={secureText && !showPw}
              autoFocus
              autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
              selectionColor={colors.primaryContainer}
            />
            {secureText && (
              <TouchableOpacity onPress={() => setShowPw(v => !v)} style={styles.eyeBtn}>
                <Ionicons
                  name={showPw ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.onSurfaceVariant}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: colors.border }]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelText, { color: colors.onSurfaceVariant }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.primaryContainer }]}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Text style={[styles.saveText, { color: colors.onPrimaryContainer }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.60)',
  },
  kavWrapper: {
    flex:           1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius:  28,
    borderTopRightRadius: 28,
    borderWidth:          1,
    borderBottomWidth:    0,
    padding:              Spacing.lg,
    paddingBottom:        Platform.OS === 'ios' ? 40 : Spacing.xl,
    gap:                  Spacing.md,
  },
  handle: {
    width:        40,
    height:       4,
    borderRadius: 2,
    alignSelf:    'center',
    marginBottom: Spacing.xs,
  },
  sheetHeader: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  sheetTitle: {
    fontFamily:    FontFamily.heading,
    fontSize:      20,
    fontWeight:    '600',
    letterSpacing: -0.2,
  },
  inputLabel: {
    fontFamily:    FontFamily.mono,
    fontSize:      10,
    fontWeight:    '500',
    letterSpacing: 1.5,
  },
  inputWrap: {
    flexDirection:   'row',
    alignItems:      'center',
    borderRadius:    Radius.xl,
    borderWidth:     1,
    paddingHorizontal: Spacing.md,
  },
  input: {
    flex:          1,
    fontFamily:    FontFamily.body,
    fontSize:      16,
    height:        52,
  },
  eyeBtn: {
    padding: 4,
  },
  actions: {
    flexDirection: 'row',
    gap:           Spacing.sm,
    marginTop:     Spacing.xs,
  },
  cancelBtn: {
    flex:           1,
    height:         48,
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
  saveBtn: {
    flex:           1,
    height:         48,
    borderRadius:   Radius.full,
    justifyContent: 'center',
    alignItems:     'center',
  },
  saveText: {
    fontFamily:  FontFamily.heading,
    fontSize:    15,
    fontWeight:  '700',
  },
});