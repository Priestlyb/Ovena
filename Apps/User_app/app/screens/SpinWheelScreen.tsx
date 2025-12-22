import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing } from "react-native";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";

const { width } = Dimensions.get("window");
const wheelSize = width * 0.8;
const segments = ["100", "200", "300", "400", "500", "600"];
const segmentAngle = 360 / segments.length;

export default function SpinWheelScreen() {
  const [spinning, setSpinning] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);

    const randomSpin = Math.floor(Math.random() * 360) + 720; // At least 2 full rotations
    Animated.timing(spinAnim, {
      toValue: randomSpin,
      duration: 4000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setSpinning(false);
      const selectedIndex = Math.floor(((randomSpin % 360) / segmentAngle)) % segments.length;
      alert(`You won: ${segments[segments.length - 1 - selectedIndex]}!`);
      spinAnim.setValue(0); // reset for next spin
    });
  };

  const rotateInterpolation = spinAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spin the Wheel!</Text>
      <Animated.View style={{ transform: [{ rotate: rotateInterpolation }] }}>
        <Svg width={wheelSize} height={wheelSize} viewBox={`0 0 ${wheelSize} ${wheelSize}`}>
          <G rotation={-90} originX={wheelSize / 2} originY={wheelSize / 2}>
            {segments.map((seg, i) => (
              <G key={i}>
                <Circle
                  cx={wheelSize / 2}
                  cy={wheelSize / 2}
                  r={wheelSize / 2}
                  fill={i % 2 === 0 ? "#ff6347" : "#ffa500"}
                  stroke="#fff"
                  strokeWidth={2}
                  strokeDasharray={`${segmentAngle * Math.PI * wheelSize / 360} ${360}`}
                  strokeDashoffset={(i * segmentAngle * Math.PI * wheelSize) / 360}
                />
                <SvgText
                  fill="#fff"
                  fontSize="20"
                  x={wheelSize / 2}
                  y={wheelSize / 4}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  rotation={(i + 0.5) * segmentAngle}
                  originX={wheelSize / 2}
                  originY={wheelSize / 2}
                >
                  {seg}
                </SvgText>
              </G>
            ))}
          </G>
        </Svg>
      </Animated.View>

      <TouchableOpacity style={styles.button} onPress={spinWheel} disabled={spinning}>
        <Text style={styles.buttonText}>{spinning ? "Spinning..." : "Spin"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#222" },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 40 },
  button: {
    marginTop: 40,
    backgroundColor: "#32cd32",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
});
