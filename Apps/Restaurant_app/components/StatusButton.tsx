import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface StatusButtonProps {
  status: string;
  onPress?: () => void;
}

export function StatusButton({ status, onPress }: StatusButtonProps) {
  const getButtonConfig = () => {
    switch (status) {
      case 'incoming':
        return { text: 'Accept', bg: '#FF5722', color: '#FFF' };
      case 'preparing':
        return { text: 'Ready', bg: '#FF5722', color: '#FFF' };
      case 'ready':
        return { text: 'Send out', bg: '#FF5722', color: '#FFF' };
      case 'completed':
        return { text: 'Successful', bg: '#4CAF50', color: '#FFF' };
      case 'rejected':
        return { text: 'Failed', bg: '#F44336', color: '#FFF' };
      default:
        return { text: status, bg: '#FF5722', color: '#FFF' };
    }
  };

  const config = getButtonConfig();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: config.bg }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, { color: config.color }]}>
        {config.text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
