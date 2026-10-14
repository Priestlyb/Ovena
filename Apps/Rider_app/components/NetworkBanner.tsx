// // components/NetworkBanner.tsx
// //
// // Renders a slim pill at the very top of the screen (below the status bar).
// // • Green  — "Connected"   — auto-dismisses after 2.5 s so it doesn't crowd the UI
// // • Red    — "No connection" — stays visible until the connection is restored
// //
// // Usage: mount once near the root of every screen, or in a shared layout.
// // It manages its own animation so callers just render <NetworkBanner />.

// import React, { useEffect, useRef, useState } from "react";
// import {
//   Animated, Text, StyleSheet, Platform, View,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useNetworkStatus } from "../hooks/useNetworkStatus";

// const BANNER_HEIGHT   = 36;
// const DISMISS_DELAY   = 2500; // ms — how long the "connected" banner stays visible

// export default function NetworkBanner() {
//   const { isConnected, isKnown } = useNetworkStatus();
//   const insets = useSafeAreaInsets();

//   // Track the previous connection state so we only show the "connected"
//   // banner when transitioning FROM offline → online (not on first load).
//   const prevConnected   = useRef<boolean | null>(null);
//   const [visible, setVisible]     = useState(false);
//   const [showGreen, setShowGreen] = useState(false);

//   const translateY = useRef(new Animated.Value(-BANNER_HEIGHT - 20)).current;
//   const opacity    = useRef(new Animated.Value(0)).current;
//   const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const slideIn = () => {
//     if (dismissTimer.current) clearTimeout(dismissTimer.current);
//     setVisible(true);
//     Animated.parallel([
//       Animated.spring(translateY, { toValue: 0, friction: 10, tension: 80, useNativeDriver: true }),
//       Animated.timing(opacity,    { toValue: 1, duration: 200, useNativeDriver: true }),
//     ]).start();
//   };

//   const slideOut = (onDone?: () => void) => {
//     Animated.parallel([
//       Animated.timing(translateY, { toValue: -BANNER_HEIGHT - 20, duration: 260, useNativeDriver: true }),
//       Animated.timing(opacity,    { toValue: 0, duration: 200, useNativeDriver: true }),
//     ]).start(() => {
//       setVisible(false);
//       onDone?.();
//     });
//   };

//   useEffect(() => {
//     if (!isKnown) return;

//     const prev = prevConnected.current;
//     prevConnected.current = isConnected;

//     if (!isConnected) {
//       // Offline — always show the red banner; cancel any pending dismiss
//       if (dismissTimer.current) clearTimeout(dismissTimer.current);
//       setShowGreen(false);
//       slideIn();
//       return;
//     }

//     // Connected
//     if (prev === false) {
//       // Just recovered — briefly show the green "connected" banner then hide it
//       setShowGreen(true);
//       slideIn();
//       dismissTimer.current = setTimeout(() => slideOut(), DISMISS_DELAY);
//     } else if (prev === null) {
//       // First load with connection — stay silent (no banner)
//     }
//     // prev === true: already connected, nothing changed — do nothing

//     return () => { if (dismissTimer.current) clearTimeout(dismissTimer.current); };
//   }, [isConnected, isKnown]);

//   if (!visible) return null;

//   const bg   = showGreen ? "#22C55E" : "#EF4444";
//   const text = showGreen ? "Connected to the internet" : "Hmm… no connection";
//   const icon = showGreen ? "✓" : "✕";

//   return (
//     <Animated.View
//       style={[
//         styles.banner,
//         {
//           backgroundColor: bg,
//           top:             insets.top + 10,
//           transform:       [{ translateY }],
//           opacity,
//         },
//       ]}
//       pointerEvents="none"
//     >
//       <Text style={styles.icon}>{icon}</Text>
//       <Text style={styles.label}>{text}</Text>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   banner: {
//     position:       "absolute",
//     alignSelf:      "center",
//     flexDirection:  "row",
//     alignItems:     "center",
//     gap:            6,
//     paddingVertical:  8,
//     paddingHorizontal: 18,
//     borderRadius:   50,
//     zIndex:         9998,
//     // Shadow so it floats over map tiles / content
//     shadowColor:    "#000",
//     shadowOpacity:  0.18,
//     shadowOffset:   { width: 0, height: 3 },
//     shadowRadius:   8,
//     elevation:      12,
//   },
//   icon:  { color: "#fff", fontSize: 12, fontWeight: "700" },
//   label: { color: "#fff", fontSize: 13, fontWeight: "600" },
// });