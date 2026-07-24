// components/TimeRowSelector.tsx
import { CustomDropdown } from "@/components/CustomDropDown";
import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

interface TimeRowSelectorProps {
  openingTime: string;
  closingTime: string;
  isClosed?: boolean;
  onOpeningTimeChange: (value: string) => void;
  onClosingTimeChange: (value: string) => void;
  onClosedChange?: (value: boolean) => void;
  times?: string[];
}

export const StoreHubTimeSelector: React.FC<TimeRowSelectorProps> = ({
  openingTime,
  closingTime,
  isClosed = false,
  onOpeningTimeChange,
  onClosingTimeChange,
  onClosedChange,
  times = [
    "12:00 AM",
    "01:00 AM",
    "02:00 AM",
    "03:00 AM",
    "04:00 AM",
    "05:00 AM",
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
    "09:00 PM",
    "10:00 PM",
    "11:00 PM",
  ],
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <View style={styles.dropdown}>
          <CustomDropdown
            options={times}
            placeholder="Opening"
            value={openingTime}
            onChange={onOpeningTimeChange}
            disabled={isClosed}
          />
        </View>

        <View style={styles.dropdown}>
          <CustomDropdown
            options={times}
            placeholder="Closing"
            value={closingTime}
            onChange={onClosingTimeChange}
            disabled={isClosed}
          />
        </View>
      </View>

      <View style={styles.closedContainer}>
        <Text style={styles.closedText}>Closed</Text>

        <Switch
          value={isClosed}
          onValueChange={onClosedChange}
          trackColor={{
            false: "#D1D5DB",
            true: "#FF8C42",
          }}
          thumbColor={isClosed ? "#FFFFFF" : "#FF8C42"}
          ios_backgroundColor="#D1D5DB"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },

  timeContainer: {
    flexDirection: "row",
    gap: 8,
  },

  dropdown: {
    flex: 1,
  },

  closedContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },

  closedText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
