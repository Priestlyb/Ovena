import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { ChecklistItemProps } from '../types';
import { styles } from '@/constants/styles';

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  iconName,
  text,
  completed,
  link,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      style={styles.checklistItem} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.checklistIconBox}>
        <Text style={styles.checklistIconText}>{iconName}</Text>
      </View>
      <View style={styles.checklistTextContainer}>
        <Text style={styles.checklistItemText}>{text}</Text>
        {link && (
          <View style={styles.checklistLinkContainer}>
            <Text style={styles.checklistLinkText}>{link}</Text>
            <ChevronRight size={16} color="#666" style={styles.chevronIcon} />
          </View>
        )}
      </View>
      <View style={[styles.checkbox, completed && styles.checkboxCompleted]}>
        {completed ? (
          <View style={styles.checkboxCheckmark}>
            <Text style={styles.checkboxCheckmarkText}>✓</Text>
          </View>
        ) : (
          <View style={styles.checkboxOrangeIndicator} />
        )}
      </View>
    </TouchableOpacity>
  );
};