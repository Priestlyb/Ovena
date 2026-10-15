import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "@/constants/theme";
import { IconSymbol } from "@/components/ui/icon-symbol";

import DobPickerModal from "./DobPickerModal";
import { MONTHS } from "@/src/utils/date";
import { useDobPicker } from "@/hooks/signup/useDobPicker";

type DobFieldProps = {
  dob: ReturnType<typeof useDobPicker>;
  label?: string;
};

export default function DobField({
  dob,
  label = "Date of Birth",
}: DobFieldProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <>
      <View style={styles.labelRow}>
        <IconSymbol
          name="CalendarIcon"
          size={18}
          color={theme.primary}
          style={styles.labelIcon}
        />
        <Text style={styles.label}>{label}</Text>
      </View>

      <TouchableOpacity
        style={styles.dateBox}
        activeOpacity={0.8}
        onPress={() => dob.setShowPicker(true)}
      >
        <Text style={styles.dateText}>
          {`${dob.day} ${MONTHS[dob.month]} ${dob.year}`}
        </Text>
        <IconSymbol name="CalendarIcon" size={18} color={theme.textSecondary} />
      </TouchableOpacity>

      <DobPickerModal
        visible={dob.showPicker}
        onClose={() => dob.setShowPicker(false)}
        day={dob.day}
        month={dob.month}
        year={dob.year}
        setDay={dob.setDay}
        setMonth={dob.setMonth}
        setYear={dob.setYear}
        days={dob.days}
        years={dob.years}
      />
    </>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    labelRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 24,
      marginBottom: 10,
    },

    labelIcon: {
      marginRight: 8,
    },

    label: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textPrimary,
    },

    dateBox: {
      height: 55,
      borderWidth: 1.5,
      borderColor: theme.border,
      borderRadius: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 18,
      backgroundColor: theme.surface,
    },

    dateText: {
      fontSize: 15,
      color: theme.textPrimary,
    },
  });
