/**
 * app/ops/banners/create.tsx
 *
 * Upload a new homepage banner with an optional schedule window.
 *
 * ⚠️ Image picking is stubbed — this project doesn't have expo-image-picker
 * confirmed as installed (Blender/novel-platform work used Supabase direct
 * upload, not a native picker). Run `npx expo install expo-image-picker`
 * and wire ImagePicker.launchImageLibraryAsync() into pickImage() below
 * once you're ready — the placeholder just simulates a selected image so
 * the rest of the form/schedule flow can be reviewed now.
 */

import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, Image, Switch, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import ScreenWrapper from '@/components/ScreenWrapper';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800';

export default function CreateBannerScreen() {
  const { colors } = useTheme();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const pickImage = () => {
    // ⚠️ STUB — see file header. Simulates a picked image for now.
    console.log('🖼️ [CreateBanner] pickImage (stub — wire expo-image-picker)');
    setImageUri(PLACEHOLDER_IMAGE);
  };

  const handleUpload = () => {
    // ⚠️ UNVERIFIED — no banners endpoint exists yet
    console.log('🖼️ [CreateBanner] submit', {
      imageUri, title, scheduleEnabled, startDate, endDate,
    });
    router.back();
  };

  const canSubmit = !!imageUri && title.trim().length > 0;

  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: 'Upload Banner' }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={pickImage}
          style={[styles.imagePicker, { borderColor: colors.borderSubtle, backgroundColor: colors.surfaceContainer }]}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <View style={styles.imagePickerEmpty}>
              <Ionicons name="image-outline" size={32} color={colors.onSurfaceVariant} />
              <Text style={[styles.imagePickerText, { color: colors.onSurfaceVariant }]}>
                Tap to choose an image
              </Text>
            </View>
          )}
        </Pressable>

        <Field label="Title" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.onSurface, backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle }]}
            placeholder="Banner title (internal reference)"
            placeholderTextColor={colors.onSurfaceVariant + '80'}
            value={title}
            onChangeText={setTitle}
          />
        </Field>

        <View style={[styles.toggleRow, { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle }]}>
          <View style={styles.toggleText}>
            <Text style={[styles.toggleLabel, { color: colors.onSurface }]}>Schedule</Text>
            <Text style={[styles.toggleSubtext, { color: colors.onSurfaceVariant }]}>
              {scheduleEnabled ? 'Banner will only be active in this window.' : 'Off — banner goes live immediately when enabled.'}
            </Text>
          </View>
          <Switch
            value={scheduleEnabled}
            onValueChange={setScheduleEnabled}
            trackColor={{ false: colors.surfaceContainerHigh, true: colors.primaryContainer }}
            thumbColor={colors.surface}
          />
        </View>

        {scheduleEnabled && (
          <View style={styles.dateRow}>
            <Field label="Start date" colors={colors} style={{ flex: 1 }}>
              <TextInput
                style={[styles.input, { color: colors.onSurface, backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle }]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.onSurfaceVariant + '80'}
                value={startDate}
                onChangeText={setStartDate}
              />
            </Field>
            <Field label="End date" colors={colors} style={{ flex: 1 }}>
              <TextInput
                style={[styles.input, { color: colors.onSurface, backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle }]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.onSurfaceVariant + '80'}
                value={endDate}
                onChangeText={setEndDate}
              />
            </Field>
          </View>
        )}

        <Pressable
          onPress={handleUpload}
          disabled={!canSubmit}
          style={[styles.submitBtn, { backgroundColor: colors.primaryContainer, opacity: canSubmit ? 1 : 0.5 }]}
        >
          <Text style={[styles.submitBtnText, { color: colors.onPrimaryContainer }]}>
            {scheduleEnabled ? 'Upload & Schedule' : 'Upload Banner'}
          </Text>
        </Pressable>
      </ScrollView>
    </ScreenWrapper>
  );
}

function Field({
  label, colors, children, style,
}: {
  label: string;
  colors: ReturnType<typeof useTheme>['colors'];
  children: React.ReactNode;
  style?: object;
}) {
  return (
    <View style={[styles.field, style]}>
      <Text style={[styles.sectionLabel, { color: colors.onSurfaceVariant }]}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.md, paddingBottom: Spacing.xl, paddingHorizontal: Spacing.gutter },
  imagePicker: {
    height: 160, borderRadius: Radius.lg, borderWidth: 1, borderStyle: 'dashed',
    overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
  },
  imagePickerEmpty: { alignItems: 'center', gap: 6 },
  imagePickerText: { fontFamily: FontFamily.body, fontSize: 12 },
  previewImage: { width: '100%', height: '100%' },
  sectionLabel: {
    fontFamily: FontFamily.body, fontSize: 11, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  field: { gap: Spacing.xs },
  input: {
    fontFamily: FontFamily.body, fontSize: 14,
    borderWidth: 1, borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderRadius: Radius.lg, padding: Spacing.md, gap: Spacing.sm,
  },
  toggleText: { flex: 1, gap: 2 },
  toggleLabel: { fontFamily: FontFamily.body, fontSize: 14, fontWeight: '600' },
  toggleSubtext: { fontFamily: FontFamily.body, fontSize: 11, lineHeight: 15 },
  dateRow: { flexDirection: 'row', gap: Spacing.sm },
  submitBtn: {
    borderRadius: Radius.full, paddingVertical: Spacing.md, alignItems: 'center', marginTop: Spacing.sm,
  },
  submitBtnText: { fontFamily: FontFamily.body, fontSize: 14, fontWeight: '700' },
});