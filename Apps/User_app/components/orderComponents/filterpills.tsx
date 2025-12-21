import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FilterPillsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  filters: string[];
}

const FilterPills: React.FC<FilterPillsProps> = ({ activeFilter, onFilterChange, filters }) => (
  <View style={styles.filterContainer}>
    {filters.map((filter) => (
      <TouchableOpacity
        key={filter}
        onPress={() => onFilterChange(filter)}
        style={[
          styles.filterPill,
          activeFilter === filter ? styles.activeFilter : styles.inactiveFilter
        ]}
      >
        <Text style={[
          styles.filterText,
          activeFilter === filter ? styles.activeFilterText : styles.inactiveFilterText
        ]}>
          {filter}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  filterPill: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexGrow: 1,
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#F6D44F',
  },
  inactiveFilter: {
    backgroundColor: '#F5F5F5',
  },
  filterText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#000',
  },
  inactiveFilterText: {
    color: '#666',
  },
});

export default FilterPills;
