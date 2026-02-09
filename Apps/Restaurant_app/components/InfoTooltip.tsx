// components/InfoTooltip.tsx - Information tooltip icon
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Info } from 'lucide-react-native';

interface InfoTooltipProps {
  onPress?: () => void;
  size?: number;
  color?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  onPress,
  size = 20,
  color = '#FFFFFF',
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress || (() => console.log('Info pressed'))}
      activeOpacity={0.7}
    >
      <Info size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
});