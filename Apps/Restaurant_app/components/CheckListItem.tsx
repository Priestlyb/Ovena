
import { View, Text, TouchableOpacity } from 'react-native';
import { ChecklistItemProps } from '../types';
import { styles } from '@/constants/styles';

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  iconName,
  text,
  completed,
  onClick,
}) => {
  return (
    <TouchableOpacity 
      style={styles.checklistItem} 
      onPress={onClick}
      activeOpacity={0.7}
    >
      <View style={styles.checklistIconBox}>
        <Text style={styles.checklistIconText}>{iconName}</Text>
      </View>
      <Text style={styles.checklistItemText}>{text}</Text>
      <View style={[styles.checkbox, completed && styles.checkboxCompleted]}>
        {completed && <View style={styles.checkboxInner} />}
      </View>
    </TouchableOpacity>
  );
};
