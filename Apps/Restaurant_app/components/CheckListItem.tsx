import { styles } from "@/constants/styles";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ChecklistItemProps {
  iconSource: ImageSourcePropType;
  text: string;
  completed: boolean;
  onPress: () => void;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  iconSource,
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
          <Image
            source={iconSource}
            style={{ width: 30, height: 30 }}
            resizeMode="contain"
          />
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
