// components/FilterChips.tsx - Filter chips component
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

interface Filter {
  key: string;
  label: string;
  count?: number;
}

interface FilterChipsProps {
  filters: Filter[];
  activeFilter: string;
  onFilterChange: (key: string) => void;
}

export function FilterChips({
  filters,
  activeFilter,
  onFilterChange,
}: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.key}
          style={[
            styles.chip,
            activeFilter === filter.key && styles.activeChip,
          ]}
          onPress={() => onFilterChange(filter.key)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.chipText,
              activeFilter === filter.key && styles.activeChipText,
            ]}
          >
            {filter.label}
            {filter.count !== undefined && ` (${filter.count})`}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 20,
    paddingRight: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  activeChip: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  activeChipText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
