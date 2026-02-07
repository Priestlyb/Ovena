import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { styles } from '@/constants/styles';

interface ChecklistItemProps {
  iconName: string;
  text: string;
  completed: boolean;
  onPress: () => void;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  iconName,
  text,
  completed,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.checklistItemCard}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View style={styles.checklistItemContent}>
        {/* Icon */}
        <View style={styles.checklistOrangeIconBox}>
          <Text style={styles.checklistIconEmoji}>{iconName}</Text>
        </View>

        {/* Label + Arrow */}
        <View style={styles.checklistItemTextSection}>
          <Text style={styles.checklistItemLabel}>{text}</Text>
          <ChevronRight size={16} color="#111827" />
        </View>

        {/* Completion Indicator */}
        <View
          style={[
            styles.checklistCompletionCircle,
            completed && styles.checklistCompletionCircleCompleted,
          ]}
        >
          {completed && <View style={styles.checklistCheckmark} />}
        </View>
      </View>
    </TouchableOpacity>
  );
};
