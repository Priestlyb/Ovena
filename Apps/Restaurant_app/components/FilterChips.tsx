import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

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
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
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
    marginBottom: 16,
  },
  contentContainer: {
    paddingRight: 16,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: '#FFCCBC',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeChipText: {
    color: '#000',
    fontWeight: '600',
  },
});
