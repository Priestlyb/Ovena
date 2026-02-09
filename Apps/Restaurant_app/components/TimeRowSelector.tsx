// components/TimeRowSelector.tsx - Row with 3 dropdowns for time selection
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CustomDropdown } from '@/components/CustomDropDown';

interface TimeRowSelectorProps {
  day: string;
  openingTime: string;
  closingTime: string;
  onDayChange: (value: string) => void;
  onOpeningTimeChange: (value: string) => void;
  onClosingTimeChange: (value: string) => void;
  days?: string[];
  times?: string[];
}

export const TimeRowSelector: React.FC<TimeRowSelectorProps> = ({
  day,
  openingTime,
  closingTime,
  onDayChange,
  onOpeningTimeChange,
  onClosingTimeChange,
  days = ['Default', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  times = [
    '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM',
    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM',
  ],
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.dropdown}>
        <CustomDropdown
          options={days}
          placeholder="Default"
          value={day}
          onChange={onDayChange}
        />
      </View>

      <View style={styles.dropdown}>
        <CustomDropdown
          options={times}
          placeholder="00:00 PM"
          value={openingTime}
          onChange={onOpeningTimeChange}
        />
      </View>

      <View style={styles.dropdown}>
        <CustomDropdown
          options={times}
          placeholder="00:00 PM"
          value={closingTime}
          onChange={onClosingTimeChange}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  dropdown: {
    flex: 1,
  },
});