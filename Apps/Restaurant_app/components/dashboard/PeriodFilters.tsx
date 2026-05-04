import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export const PeriodFilters = ({
  periods,
  selectedPeriod,
  setSelectedPeriod,
  styles,
}: any) => {
  return (
    <View style={styles.periodsContainer}>
      {periods.map((period: any) => (
        <TouchableOpacity
          key={period.key}
          style={[
            styles.periodChip,
            selectedPeriod === period.key && styles.activePeriodChip,
          ]}
          onPress={() => setSelectedPeriod(period.key)}
        >
          <Text
            style={[
              styles.periodText,
              selectedPeriod === period.key && styles.activePeriodText,
            ]}
          >
            {period.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
