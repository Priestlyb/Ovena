import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';

const SECTIONS = [
  { label: '50 Coins' },
  { label: 'Try Again' },
  { label: '100 Coins' },
  { label: 'Bonus Spin' },
];

const SECTION_ANGLE = 360 / SECTIONS.length;

interface Props {
  onClose: () => void;
  onResult: (result: string) => void;
}

export default function SpinningWheelScreen({ onClose, onResult }: Props) {
  const rotation = useRef(new Animated.Value(0)).current;
  const [spinning, setSpinning] = useState(false);

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);

    const spinDuration = Math.random() * 3000 + 2000; // 2–5 seconds
    const spins = Math.floor(Math.random() * 4) + 4; // 4–7 full spins
    const finalAngle = Math.random() * 360;

    const totalRotation = spins * 360 + finalAngle;

    Animated.timing(rotation, {
      toValue: totalRotation,
      duration: spinDuration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setSpinning(false);

      const normalizedAngle = totalRotation % 360;
      const index =
        Math.floor((360 - normalizedAngle) / SECTION_ANGLE) %
        SECTIONS.length;

      const prize = SECTIONS[index].label;
      onResult(prize);
    });
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      {/* Pointer */}
      <View style={styles.pointer} />

      {/* Wheel */}
      <Animated.View
        style={[
          styles.wheel,
          { transform: [{ rotate: rotateInterpolate }] },
        ]}
      >
        {SECTIONS.map((section, index) => (
          <View
            key={index}
            style={[
              styles.section,
              {
                transform: [{ rotate: `${index * SECTION_ANGLE}deg` }],
              },
            ]}
          >
            <Text style={styles.sectionText}>{section.label}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Spin Button */}
      <TouchableOpacity
        style={[styles.spinButton, spinning && { opacity: 0.5 }]}
        onPress={spinWheel}
        disabled={spinning}
      >
        <Text style={styles.spinText}>
          {spinning ? 'Spinning...' : 'Spin'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  closeText: {
    fontSize: 24,
    color: '#fff',
  },

  pointer: {
    position: 'absolute',
    top: '38%',
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#facc15',
    zIndex: 5,
  },

  wheel: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },

  section: {
    position: 'absolute',
    width: '100%',
    height: '50%',
    top: 0,
    alignItems: 'center',
  },

  sectionText: {
    marginTop: 12,
    color: '#fff',
    fontWeight: '600',
  },

  spinButton: {
    marginTop: 40,
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: '#22c55e',
    borderRadius: 30,
  },

  spinText: {
    color: '#022c22',
    fontSize: 18,
    fontWeight: '700',
  },
});
