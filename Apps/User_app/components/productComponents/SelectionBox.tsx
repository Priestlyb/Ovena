import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

interface SelectionBoxProps {
  icon?: string;
  selected: boolean;
  onPress: () => void;
}

export const SelectionBox: React.FC<SelectionBoxProps> = ({ icon, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.selectionBox, selected && styles.selectionBoxActive]}
    onPress={onPress}
  >
    {icon ? (
      <Text style={styles.selectionIcon}>{icon}</Text>
    ) : (
      <View style={styles.emptyBox} />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  selectionBox: {
    width: 80,
    height: 80,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectionBoxActive: {
    borderColor: '#ff6347',
    backgroundColor: '#fff',
  },
  selectionIcon: {
    fontSize: 36,
  },
  emptyBox: {
    width: '100%',
    height: '100%',
  },
});
