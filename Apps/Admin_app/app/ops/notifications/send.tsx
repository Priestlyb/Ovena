/**
 * app/ops/notifications/send.tsx
 *
 * Send a push notification: pick audience (Everyone / Customers /
 * Restaurants / Riders), optionally start from a template (Flash Sale,
 * Rain Discount, Restaurant Promo, System Update), edit title/body, send.
 *
 * Send is a console.log stub — no notifications endpoint exists yet.
 */

import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import ScreenWrapper from '@/components/ScreenWrapper';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import {
  NotificationAudience,
  AUDIENCE_LABEL,
  NOTIFICATION_TEMPLATES,
} from '@/types/ops';

const AUDIENCES = Object.keys(AUDIENCE_LABEL) as NotificationAudience[];

const AUDIENCE_ICON: Record<NotificationAudience, keyof typeof Ionicons.glyphMap> = {
  everyone: 'globe-outline',
  customers: 'person-outline',
  restaurants: 'restaurant-outline',
  riders: 'bicycle-outline',
};

export default function SendNotificationScreen() {
  const { colors } = useTheme();
  const [audience, setAudience] = useState<NotificationAudience>('everyone');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const applyTemplate = (id: string) => {
    const tpl = NOTIFICATION_TEMPLATES.find((t) => t.id === id);
    if (!tpl) return;
    setSelectedTemplate(id);
    setTitle(tpl.title);
    setBody(tpl.body);
  };

  const handleSend = () => {
    // ⚠️ UNVERIFIED — no notifications endpoint exists yet
    console.log('🔔 [SendNotification] submit', { audience, title, body });
    router.back();
  };

  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: 'Push Notification' }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionLabel, { color: colors.onSurfaceVariant }]}>Send to</Text>
        <View style={styles.audienceGrid}>
          {AUDIENCES.map((a) => {
            const active = audience === a;
            return (
              <Pressable
                key={a}
                onPress={() => setAudience(a)}
                style={[
                  styles.audienceChip,
                  { borderColor: colors.borderSubtle, backgroundColor: colors.surfaceContainer },
                  active && { backgroundColor: colors.primaryContainer, borderColor: colors.primaryContainer },
                ]}
              >
                <Ionicons name={AUDIENCE_ICON[a]} size={16} color={active ? colors.onPrimaryContainer : colors.onSurfaceVariant} />
                <Text style={[styles.audienceChipText, { color: active ? colors.onPrimaryContainer : colors.onSurfaceVariant }]}>
                  {AUDIENCE_LABEL[a]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.onSurfaceVariant, marginTop: Spacing.sm }]}>
          Start from a template
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.templateRow}>
          {NOTIFICATION_TEMPLATES.map((tpl) => {
            const active = selectedTemplate === tpl.id;
            return (
              <Pressable
                key={tpl.id}
                onPress={() => applyTemplate(tpl.id)}
                style={[
                  styles.templateCard,
                  { borderColor: colors.borderSubtle, backgroundColor: colors.surfaceContainer },
                  active && { borderColor: colors.primaryContainer },
                ]}
              >
                <Text style={[styles.templateLabel, { color: colors.onSurface }]}>{tpl.label}</Text>
                <Text style={[styles.templatePreview, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
                  {tpl.body}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Field label="Title" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.onSurface, backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle }]}
            placeholder="Notification title"
            placeholderTextColor={colors.onSurfaceVariant + '80'}
            value={title}
            onChangeText={(v) => { setTitle(v); setSelectedTemplate(null); }}
          />
        </Field>

        <Field label="Message" colors={colors}>
          <TextInput
            style={[
              styles.input, styles.textArea,
              { color: colors.onSurface, backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle },
            ]}
            placeholder="Notification body"
            placeholderTextColor={colors.onSurfaceVariant + '80'}
            value={body}
            onChangeText={(v) => { setBody(v); setSelectedTemplate(null); }}
            multiline
            numberOfLines={3}
          />
        </Field>

        <Pressable
          onPress={handleSend}
          disabled={!title.trim() || !body.trim()}
          style={[
            styles.submitBtn,
            { backgroundColor: colors.primaryContainer, opacity: title.trim() && body.trim() ? 1 : 0.5 },
          ]}
        >
          <Ionicons name="send" size={16} color={colors.onPrimaryContainer} />
          <Text style={[styles.submitBtnText, { color: colors.onPrimaryContainer }]}>
            Send to {AUDIENCE_LABEL[audience]}
          </Text>
        </Pressable>
      </ScrollView>
    </ScreenWrapper>
  );
}

function Field({ label, colors, children }: { label: string; colors: ReturnType<typeof useTheme>['colors']; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={[styles.sectionLabel, { color: colors.onSurfaceVariant }]}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.md, paddingBottom: Spacing.xl, paddingHorizontal: Spacing.gutter },
  sectionLabel: {
    fontFamily: FontFamily.body, fontSize: 11, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  audienceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  audienceChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 8,
  },
  audienceChipText: { fontFamily: FontFamily.body, fontSize: 12, fontWeight: '600' },
  templateRow: { gap: Spacing.sm, paddingVertical: Spacing.xs },
  templateCard: {
    width: 160, borderWidth: 1, borderRadius: Radius.md,
    padding: Spacing.sm, gap: 4,
  },
  templateLabel: { fontFamily: FontFamily.heading, fontSize: 13, fontWeight: '700' },
  templatePreview: { fontFamily: FontFamily.body, fontSize: 11, lineHeight: 14 },
  field: { gap: Spacing.xs },
  input: {
    fontFamily: FontFamily.body, fontSize: 14,
    borderWidth: 1, borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderRadius: Radius.full, paddingVertical: Spacing.md, marginTop: Spacing.sm,
  },
  submitBtnText: { fontFamily: FontFamily.body, fontSize: 14, fontWeight: '700' },
});