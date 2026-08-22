/**
 * app/(tabs)/settings.tsx
 *
 * System Settings tab. Single-screen form, no drill-down needed. Sections:
 *   Fees & Commission — service fee, delivery fee, restaurant commission, referral %
 *   Order Rules       — minimum order, delivery radius
 *   Operating Hours    — per-day open/close, with "copy to all days" shortcut
 *   System Modes       — holiday mode, maintenance mode
 *
 * Save is a console.log stub — no settings endpoint exists yet. Local
 * state only; changes are lost on screen unmount until a real endpoint
 * is wired (flagged inline).
 */

import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenWrapper from '@/components/ScreenWrapper';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { getMockSettings } from '@/data/mockSettings';
import { SystemSettings, FeeType, DayHours } from '@/types/settings';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [settings, setSettings] = useState<SystemSettings>(getMockSettings);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const update = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // ⚠️ UNVERIFIED — no settings endpoint exists yet. Wire a real
    // PUT/PATCH call here once one is confirmed; this only logs for now.
    console.log('⚙️ [Settings] save', settings);
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    }, 400);
  };

  return (
    <ScreenWrapper noPadding>
      <View
        style={[
          styles.topBar,
          { paddingTop: insets.top, backgroundColor: colors.surfaceContainerLowest, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.topBarTitle, { color: colors.primaryContainer }]}>Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Fees & Commission ── */}
        <SectionCard title="Fees & Commission" colors={colors}>
          <FeeRow
            label="Service Fee"
            fee={settings.serviceFee}
            onChange={(fee) => update('serviceFee', fee)}
            colors={colors}
          />
          <FeeRow
            label="Delivery Fee"
            fee={settings.deliveryFee}
            onChange={(fee) => update('deliveryFee', fee)}
            colors={colors}
          />
          <NumberField
            label="Restaurant Commission"
            value={settings.restaurantCommissionPercent}
            suffix="%"
            onChange={(v) => update('restaurantCommissionPercent', v)}
            colors={colors}
          />
          <NumberField
            label="Referral %"
            value={settings.referralPercent}
            suffix="%"
            onChange={(v) => update('referralPercent', v)}
            colors={colors}
          />
        </SectionCard>

        {/* ── Order Rules ── */}
        <SectionCard title="Order Rules" colors={colors}>
          <NumberField
            label="Minimum Order"
            value={settings.minimumOrder}
            prefix="₦"
            onChange={(v) => update('minimumOrder', v)}
            colors={colors}
          />
          <NumberField
            label="Delivery Radius"
            value={settings.deliveryRadiusKm}
            suffix="km"
            onChange={(v) => update('deliveryRadiusKm', v)}
            colors={colors}
          />
        </SectionCard>

        {/* ── Operating Hours ── */}
        <SectionCard title="Operating Hours" colors={colors}>
          <Pressable
            onPress={() => {
              const first = settings.operatingHours[0];
              update(
                'operatingHours',
                settings.operatingHours.map((d) => ({ ...d, isOpen: first.isOpen, openTime: first.openTime, closeTime: first.closeTime }))
              );
            }}
            style={[styles.copyAllBtn, { borderColor: colors.borderSubtle }]}
          >
            <Ionicons name="copy-outline" size={14} color={colors.primaryContainer} />
            <Text style={[styles.copyAllText, { color: colors.primaryContainer }]}>
              Copy Monday's hours to all days
            </Text>
          </Pressable>

          {settings.operatingHours.map((day, idx) => (
            <DayHoursRow
              key={day.day}
              day={day}
              onChange={(updated) => {
                const next = [...settings.operatingHours];
                next[idx] = updated;
                update('operatingHours', next);
              }}
              colors={colors}
            />
          ))}
        </SectionCard>

        {/* ── System Modes ── */}
        <SectionCard title="System Modes" colors={colors}>
          <ToggleRow
            label="Holiday Mode"
            description="Shows a holiday banner to customers; orders remain enabled unless paired with Maintenance Mode."
            value={settings.holidayMode.enabled}
            onChange={(enabled) => update('holidayMode', { ...settings.holidayMode, enabled })}
            colors={colors}
          />
          {settings.holidayMode.enabled && (
            <View style={styles.subFields}>
              <TextField
                label="Holiday Message"
                value={settings.holidayMode.message}
                onChange={(message) => update('holidayMode', { ...settings.holidayMode, message })}
                colors={colors}
                multiline
              />
              <View style={styles.dateRow}>
                <DateField
                  label="Start Date"
                  value={settings.holidayMode.startDate}
                  onChange={(startDate) => update('holidayMode', { ...settings.holidayMode, startDate })}
                  colors={colors}
                />
                <DateField
                  label="End Date"
                  value={settings.holidayMode.endDate}
                  onChange={(endDate) => update('holidayMode', { ...settings.holidayMode, endDate })}
                  colors={colors}
                />
              </View>
            </View>
          )}

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <ToggleRow
            label="Maintenance Mode"
            description="Takes the entire platform offline for customers, riders, and restaurants. Use with caution."
            value={settings.maintenanceMode.enabled}
            onChange={(enabled) => update('maintenanceMode', { ...settings.maintenanceMode, enabled })}
            colors={colors}
            accent="error"
          />
          {settings.maintenanceMode.enabled && (
            <View style={styles.subFields}>
              <TextField
                label="Maintenance Message"
                value={settings.maintenanceMode.message}
                onChange={(message) => update('maintenanceMode', { ...settings.maintenanceMode, message })}
                colors={colors}
                multiline
              />
              <View style={[styles.warningBanner, { backgroundColor: colors.errorContainer }]}>
                <Ionicons name="warning-outline" size={16} color={colors.onErrorContainer} />
                <Text style={[styles.warningText, { color: colors.onErrorContainer }]}>
                  Enabling this will block all order activity platform-wide once wired to a real endpoint.
                </Text>
              </View>
            </View>
          )}
        </SectionCard>

        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={[styles.saveBtn, { backgroundColor: colors.primaryContainer, opacity: saving ? 0.6 : 1 }]}
        >
          <Ionicons
            name={savedFlash ? 'checkmark' : 'save-outline'}
            size={16}
            color={colors.onPrimaryContainer}
          />
          <Text style={[styles.saveBtnText, { color: colors.onPrimaryContainer }]}>
            {saving ? 'Saving...' : savedFlash ? 'Saved' : 'Save Changes'}
          </Text>
        </Pressable>
      </ScrollView>
    </ScreenWrapper>
  );
}

// ── Building blocks ─────────────────────────────────────────────────────

function SectionCard({
  title, colors, children,
}: {
  title: string;
  colors: ReturnType<typeof useTheme>['colors'];
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.card, { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle }]}>
      <Text style={[styles.sectionTitle, { color: colors.primaryContainer }]}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function FeeRow({
  label, fee, onChange, colors,
}: {
  label: string;
  fee: { type: FeeType; value: number };
  onChange: (fee: { type: FeeType; value: number }) => void;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>{label}</Text>
      <View style={styles.feeRowInputs}>
        <View style={styles.feeTypeToggle}>
          {(['percent', 'fixed'] as FeeType[]).map((t) => {
            const active = fee.type === t;
            return (
              <Pressable
                key={t}
                onPress={() => onChange({ ...fee, type: t })}
                style={[
                  styles.feeTypeChip,
                  { borderColor: colors.borderSubtle },
                  active && { backgroundColor: colors.primaryContainer, borderColor: colors.primaryContainer },
                ]}
              >
                <Text style={[styles.feeTypeText, { color: active ? colors.onPrimaryContainer : colors.onSurfaceVariant }]}>
                  {t === 'percent' ? '%' : '₦'}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <TextInput
          style={[styles.numInput, { color: colors.onSurface, backgroundColor: colors.surfaceContainerHigh, borderColor: colors.borderSubtle }]}
          keyboardType="numeric"
          value={String(fee.value)}
          onChangeText={(v) => onChange({ ...fee, value: Number(v.replace(/[^0-9.]/g, '')) || 0 })}
        />
      </View>
    </View>
  );
}

function NumberField({
  label, value, onChange, colors, prefix, suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  colors: ReturnType<typeof useTheme>['colors'];
  prefix?: string;
  suffix?: string;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>{label}</Text>
      <View style={[styles.affixInputWrap, { backgroundColor: colors.surfaceContainerHigh, borderColor: colors.borderSubtle }]}>
        {prefix && <Text style={[styles.affixText, { color: colors.onSurfaceVariant }]}>{prefix}</Text>}
        <TextInput
          style={[styles.affixInput, { color: colors.onSurface }]}
          keyboardType="numeric"
          value={String(value)}
          onChangeText={(v) => onChange(Number(v.replace(/[^0-9.]/g, '')) || 0)}
        />
        {suffix && <Text style={[styles.affixText, { color: colors.onSurfaceVariant }]}>{suffix}</Text>}
      </View>
    </View>
  );
}

function TextField({
  label, value, onChange, colors, multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  colors: ReturnType<typeof useTheme>['colors'];
  multiline?: boolean;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>{label}</Text>
      <TextInput
        style={[
          styles.textInput,
          multiline && styles.textArea,
          { color: colors.onSurface, backgroundColor: colors.surfaceContainerHigh, borderColor: colors.borderSubtle },
        ]}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );
}

function DateField({
  label, value, onChange, colors,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={[styles.fieldGroup, { flex: 1 }]}>
      <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>{label}</Text>
      <TextInput
        style={[styles.textInput, { color: colors.onSurface, backgroundColor: colors.surfaceContainerHigh, borderColor: colors.borderSubtle }]}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={colors.onSurfaceVariant + '80'}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}

function ToggleRow({
  label, description, value, onChange, colors, accent,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
  colors: ReturnType<typeof useTheme>['colors'];
  accent?: 'error';
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleText}>
        <Text style={[styles.toggleLabel, { color: accent === 'error' ? colors.error : colors.onSurface }]}>
          {label}
        </Text>
        <Text style={[styles.toggleDescription, { color: colors.onSurfaceVariant }]}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.surfaceContainerHigh, true: accent === 'error' ? colors.error : colors.primaryContainer }}
        thumbColor={colors.surface}
      />
    </View>
  );
}

function DayHoursRow({
  day, onChange, colors,
}: {
  day: DayHours;
  onChange: (d: DayHours) => void;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={[styles.dayRow, { borderColor: colors.borderSubtle }]}>
      <View style={styles.dayRowHeader}>
        <Text style={[styles.dayLabel, { color: colors.onSurface }]}>{day.day}</Text>
        <Switch
          value={day.isOpen}
          onValueChange={(isOpen) => onChange({ ...day, isOpen })}
          trackColor={{ false: colors.surfaceContainerHigh, true: colors.primaryContainer }}
          thumbColor={colors.surface}
        />
      </View>
      {day.isOpen && (
        <View style={styles.dayTimeRow}>
          <TimeInput value={day.openTime} onChange={(openTime) => onChange({ ...day, openTime })} colors={colors} />
          <Text style={[styles.dayTimeSeparator, { color: colors.onSurfaceVariant }]}>to</Text>
          <TimeInput value={day.closeTime} onChange={(closeTime) => onChange({ ...day, closeTime })} colors={colors} />
        </View>
      )}
      {!day.isOpen && (
        <Text style={[styles.closedLabel, { color: colors.onSurfaceVariant }]}>Closed</Text>
      )}
    </View>
  );
}

function TimeInput({
  value, onChange, colors,
}: {
  value: string;
  onChange: (v: string) => void;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <TextInput
      style={[styles.timeInput, { color: colors.onSurface, backgroundColor: colors.surfaceContainerHigh, borderColor: colors.borderSubtle }]}
      placeholder="HH:MM"
      placeholderTextColor={colors.onSurfaceVariant + '80'}
      value={value}
      onChangeText={onChange}
      maxLength={5}
    />
  );
}

const styles = StyleSheet.create({
  topBar: {
    minHeight: 64, justifyContent: 'flex-end', paddingHorizontal: Spacing.gutter,
    paddingBottom: Spacing.sm, borderBottomWidth: 1,
  },
  topBarTitle: { fontFamily: FontFamily.heading, fontSize: 24, fontWeight: '700', letterSpacing: -0.4 },
  content: { padding: Spacing.gutter, gap: Spacing.md },

  card: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, gap: Spacing.sm },
  sectionTitle: {
    fontFamily: FontFamily.body, fontSize: 12, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  sectionBody: { gap: Spacing.md },

  fieldGroup: { gap: 6 },
  fieldLabel: { fontFamily: FontFamily.body, fontSize: 12, fontWeight: '600' },

  feeRowInputs: { flexDirection: 'row', gap: Spacing.sm },
  feeTypeToggle: { flexDirection: 'row', gap: 4 },
  feeTypeChip: {
    width: 40, height: 40, borderRadius: Radius.md, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  feeTypeText: { fontFamily: FontFamily.body, fontSize: 13, fontWeight: '700' },
  numInput: {
    flex: 1, fontFamily: FontFamily.body, fontSize: 14,
    borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: Spacing.sm, height: 40,
  },

  affixInputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: Spacing.sm, height: 40,
  },
  affixText: { fontFamily: FontFamily.body, fontSize: 13, fontWeight: '600' },
  affixInput: { flex: 1, fontFamily: FontFamily.body, fontSize: 14, height: '100%' },

  textInput: {
    fontFamily: FontFamily.body, fontSize: 14,
    borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm,
  },
  textArea: { minHeight: 70, textAlignVertical: 'top' },

  dateRow: { flexDirection: 'row', gap: Spacing.sm },

  copyAllBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start', borderWidth: 1, borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 6,
  },
  copyAllText: { fontFamily: FontFamily.body, fontSize: 11, fontWeight: '700' },

  dayRow: { borderWidth: 1, borderRadius: Radius.md, padding: Spacing.sm, gap: 8 },
  dayRowHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dayLabel: { fontFamily: FontFamily.heading, fontSize: 13, fontWeight: '700' },
  dayTimeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dayTimeSeparator: { fontFamily: FontFamily.body, fontSize: 12 },
  timeInput: {
    flex: 1, fontFamily: FontFamily.mono, fontSize: 13, textAlign: 'center',
    borderWidth: 1, borderRadius: Radius.sm, paddingVertical: 8,
  },
  closedLabel: { fontFamily: FontFamily.body, fontSize: 12, fontStyle: 'italic' },

  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm },
  toggleText: { flex: 1, gap: 2 },
  toggleLabel: { fontFamily: FontFamily.body, fontSize: 14, fontWeight: '700' },
  toggleDescription: { fontFamily: FontFamily.body, fontSize: 11, lineHeight: 15 },

  subFields: { gap: Spacing.sm, marginTop: 4 },
  warningBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    borderRadius: Radius.md, padding: Spacing.sm,
  },
  warningText: { flex: 1, fontFamily: FontFamily.body, fontSize: 11, lineHeight: 15 },

  divider: { height: 1, marginVertical: 4 },

  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderRadius: Radius.full, paddingVertical: Spacing.md, marginTop: Spacing.sm,
  },
  saveBtnText: { fontFamily: FontFamily.body, fontSize: 14, fontWeight: '700' },
});