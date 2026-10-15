import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";

import { useTheme } from "@/constants/theme";
import { MONTHS } from "@/src/utils/date";

const { height } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;

  day: number;
  month: number;
  year: number;

  setDay: (v: number) => void;
  setMonth: (v: number) => void;
  setYear: (v: number) => void;

  days: number[];
  years: number[];
};

export default function DobPickerModal({
  visible,
  onClose,
  day,
  month,
  year,
  setDay,
  setMonth,
  setYear,
  days,
  years,
}: Props) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <SafeAreaView edges={["bottom"]} style={styles.container}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.doneBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <Picker
              selectedValue={day}
              onValueChange={setDay}
              style={styles.dayPicker}
              dropdownIconColor={theme.icon}
              mode={Platform.OS === "android" ? "dropdown" : undefined}
            >
              {days.map((d) => (
                <Picker.Item
                  key={d}
                  label={`${d}`}
                  value={d}
                  color={"#000000"}
                />
              ))}
            </Picker>

            <Picker
              selectedValue={month}
              onValueChange={setMonth}
              style={styles.monthPicker}
              dropdownIconColor={theme.icon}
              mode={Platform.OS === "android" ? "dropdown" : undefined}
            >
              {MONTHS.map((m, i) => (
                <Picker.Item key={m} label={m} value={i} color={"#000000"} />
              ))}
            </Picker>

            <Picker
              selectedValue={year}
              onValueChange={setYear}
              style={styles.yearPicker}
              dropdownIconColor={theme.icon}
              mode={Platform.OS === "android" ? "dropdown" : undefined}
            >
              {years.map((y) => (
                <Picker.Item
                  key={y}
                  label={`${y}`}
                  value={y}
                  color={"#000000"}
                />
              ))}
            </Picker>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.4)",
    },

    container: {
      backgroundColor: theme.background,
      paddingTop: 10,
      paddingBottom: 20,
      minHeight: 280,
      maxHeight: height * 0.45,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },

    doneBtn: {
      alignItems: "flex-end",
      paddingHorizontal: 20,
      paddingVertical: 10,
    },

    doneText: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.primary,
    },

    row: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
    },

    dayPicker: {
      flex: 0.8,
      color: theme.textPrimary,
    },

    monthPicker: {
      flex: 1.5,
      color: theme.textPrimary,
    },

    yearPicker: {
      flex: 1,
      color: theme.textPrimary,
    },
  });
