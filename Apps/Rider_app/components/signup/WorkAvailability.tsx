import React, { useEffect, useRef } from "react";
import {
  ScrollView, StyleSheet, View, Text, TextInput,
  KeyboardAvoidingView, TouchableWithoutFeedback,
  Keyboard, Platform, LayoutAnimation, UIManager,
} from "react-native";
import FormInput from "../FormInput";
import { useTheme } from "../../context/ThemeContext";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ── Time mask constants ───────────────────────────────────────────────────────
// Each period is a power-of-2 bitmask — multiple selections are summed.
// Morning=1, Afternoon=2, Evening=4, Late Night=8
// e.g. Morning + Evening = 1 + 4 = 5
const TIME_BITS: Record<string, number> = {
  morning:    1,
  afternoon:  2,
  evening:    4,
  late_night: 8,
};

// ── Weekday value map ─────────────────────────────────────────────────────────
// Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
const DAY_VALUES: Record<string, number> = {
  mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6,
};

// ── Schedule types ────────────────────────────────────────────────────────────
export interface DaySchedule {
  weekday: number;   // 0=Mon … 6=Sun
  time_mask: number; // bitmask sum of selected time periods
}

// ── State shape ───────────────────────────────────────────────────────────────
export interface WorkAvailabilityState {
  // UI selections (strings so FormInput can consume them directly)
  selectedDays:  string[];   // e.g. ["mon", "wed", "fri"]
  selectedTimes: string[];   // e.g. ["morning", "evening"]

  // Derived on submit — one entry per selected day, each carrying the
  // same time_mask (sum of all selected time periods)
  schedule: DaySchedule[];

  // Flat fields
  have_you_worked_as_delivery_rider: string;  // "yes" | "no"
  how_long_worked_as_rider: string;           // free text
  familiarity_with_local_routes: string;
  have_used_gps_for_deliveries: string;       // "yes" | "no"
}

// ── Schedule builder ──────────────────────────────────────────────────────────
// Called every time days or times change.
// Produces one { weekday, time_mask } object per selected day,
// each carrying the same time_mask (all selected periods OR-ed together).
function buildSchedule(days: string[], times: string[]): DaySchedule[] {
  const time_mask = times.reduce((acc, t) => acc | (TIME_BITS[t] ?? 0), 0);
  return days.map((d) => ({ weekday: DAY_VALUES[d] ?? 0, time_mask }));
}

// ── Defaults ──────────────────────────────────────────────────────────────────
const DEFAULT_DAYS  = ["mon", "tue", "wed", "thu", "fri", "sat"];
const DEFAULT_TIMES = ["morning", "afternoon", "evening"];

export const DEFAULT_WORK_AVAILABILITY: WorkAvailabilityState = {
  selectedDays: DEFAULT_DAYS,
  selectedTimes: DEFAULT_TIMES,
  schedule: buildSchedule(DEFAULT_DAYS, DEFAULT_TIMES),
  have_you_worked_as_delivery_rider: "no",
  how_long_worked_as_rider: "",
  familiarity_with_local_routes: "very_familiar",
  have_used_gps_for_deliveries: "yes",
};

interface WorkStepProps {
  workAvailability: WorkAvailabilityState;
  setWorkAvailability: React.Dispatch<React.SetStateAction<WorkAvailabilityState>>;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function WorkStep({ workAvailability, setWorkAvailability }: WorkStepProps) {
  const { colors } = useTheme();

  // If the parent hands us a blank/untouched state (e.g. it initialised with
  // {} or its own empty shape instead of importing DEFAULT_WORK_AVAILABILITY),
  // apply the defaults once on mount so they actually show as selected on
  // the FormInput buttons — otherwise `selected` stays empty and nothing
  // renders as pre-picked even though DEFAULT_WORK_AVAILABILITY exists.
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const isBlank =
      workAvailability.selectedDays.length === 0 &&
      workAvailability.selectedTimes.length === 0 &&
      !workAvailability.have_you_worked_as_delivery_rider &&
      !workAvailability.familiarity_with_local_routes &&
      !workAvailability.have_used_gps_for_deliveries;

    if (isBlank) {
      setWorkAvailability(DEFAULT_WORK_AVAILABILITY);
    }
  }, []);

  const set = (patch: Partial<WorkAvailabilityState>) => {
    LayoutAnimation.easeInEaseOut();
    setWorkAvailability((prev) => ({ ...prev, ...patch }));
  };

  // When days change: rebuild the schedule with current times
  const handleDaysChange = (days: string[]) => {
    set({
      selectedDays: days,
      schedule: buildSchedule(days, workAvailability.selectedTimes),
    });
  };

  // When times change: rebuild the schedule with current days
  const handleTimesChange = (times: string[]) => {
    set({
      selectedTimes: times,
      schedule: buildSchedule(workAvailability.selectedDays, times),
    });
  };

  const workedBefore = workAvailability.have_you_worked_as_delivery_rider === "yes";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text style={[styles.headerText, { color: colors.textPrimary }]}>Work Availability</Text>
          </View>

          <ScrollView
            style={styles.form}
            contentContainerStyle={{ paddingVertical: 10, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >

            {/* ── Days available ────────────────────────────────────────────── */}
            <FormInput
              variant="buttons"
              label="What days are you available?"
              options={[
                { value: "mon", label: "Mon" },
                { value: "tue", label: "Tue" },
                { value: "wed", label: "Wed" },
                { value: "thu", label: "Thu" },
                { value: "fri", label: "Fri" },
                { value: "sat", label: "Sat" },
                { value: "sun", label: "Sun" },
              ]}
              selected={workAvailability.selectedDays}
              onSelect={handleDaysChange}
              multiple={true}
              buttonsPerRow={4}
            />

            {/* ── Time periods available ────────────────────────────────────── */}
            {/* Each option maps to a bitmask value. Selecting multiple periods  */}
            {/* sums them: Morning(1) + Evening(4) = time_mask 5.               */}
            <FormInput
              variant="buttons"
              label="What times of the day are you available?"
              options={[
                { value: "morning",    label: "Morning"    },
                { value: "afternoon",  label: "Afternoon"  },
                { value: "evening",    label: "Evening"    },
                { value: "late_night", label: "Late Night" },
              ]}
              selected={workAvailability.selectedTimes}
              onSelect={handleTimesChange}
              multiple={true}
              buttonsPerRow={2}
            />

            {/* ── Have you worked as a delivery rider? ─────────────────────── */}
            <FormInput
              variant="buttons"
              label="Have you worked as a delivery rider before?"
              options={[
                { value: "yes", label: "Yes" },
                { value: "no",  label: "No"  },
              ]}
              selected={
                workAvailability.have_you_worked_as_delivery_rider
                  ? [workAvailability.have_you_worked_as_delivery_rider]
                  : []
              }
              onSelect={(vals) =>
                set({
                  have_you_worked_as_delivery_rider: vals[0] ?? "",
                  how_long_worked_as_rider:
                    vals[0] === "no" ? "" : workAvailability.how_long_worked_as_rider,
                })
              }
              multiple={false}
              buttonsPerRow={2}
            />

            {/* How long? — only visible when "yes" ──────────────────────────── */}
            {workedBefore && (
              <View style={styles.followUp}>
                <Text style={[styles.followUpLabel, { color: colors.textPrimary }]}>If yes, for how long?</Text>
                <TextInput
                  style={[
                    styles.followUpInput,
                    { backgroundColor: colors.card, color: colors.textPrimary, borderColor: colors.separatorColor },
                  ]}
                  placeholder="e.g. 2 years, 6 months…"
                  placeholderTextColor={colors.textMuted}
                  value={workAvailability.how_long_worked_as_rider}
                  onChangeText={(t) => set({ how_long_worked_as_rider: t })}
                />
              </View>
            )}

            {/* ── Familiarity with local routes ─────────────────────────────── */}
            <FormInput
              variant="buttons"
              label="How familiar are you with local routes?"
              options={[
                { value: "very_familiar",     label: "Very familiar"     },
                { value: "somewhat_familiar", label: "Somewhat familiar" },
                { value: "not_familiar",      label: "Not familiar"      },
              ]}
              selected={
                workAvailability.familiarity_with_local_routes
                  ? [workAvailability.familiarity_with_local_routes]
                  : []
              }
              onSelect={(vals) => set({ familiarity_with_local_routes: vals[0] ?? "" })}
              multiple={false}
              buttonsPerRow={3}
            />

            {/* ── Used GPS before? ─────────────────────────────────────────── */}
            <FormInput
              variant="buttons"
              label="Have you used a GPS or map app for deliveries?"
              options={[
                { value: "yes", label: "Yes" },
                { value: "no",  label: "No"  },
              ]}
              selected={
                workAvailability.have_used_gps_for_deliveries
                  ? [workAvailability.have_used_gps_for_deliveries]
                  : []
              }
              onSelect={(vals) => set({ have_used_gps_for_deliveries: vals[0] ?? "" })}
              multiple={false}
              buttonsPerRow={2}
            />

          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  form: { flex: 1, paddingHorizontal: 20 },
  header: { alignItems: "center", marginBottom: 10, marginTop: 10 },
  headerText: { fontSize: 20, fontWeight: "bold" },

  followUp: { marginTop: 4, marginBottom: 8 },
  followUpLabel: { fontWeight: "600", fontSize: 14, marginBottom: 6 },
  followUpInput: {
    borderWidth: 1, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
});