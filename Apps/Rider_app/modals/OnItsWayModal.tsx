import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import Separator from "../components/Separator ";

interface ConfirmPickupModalProps {
  visible: boolean;
  onClose: () => void;
}

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ConfirmPickupModal: React.FC<ConfirmPickupModalProps> = ({
  visible,
  onClose,
}) => {
  const [expanded, setExpanded] = useState(false);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(40)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      setExpanded(false);
    }
  }, [visible]);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        300,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.scaleY,
      ),
    );

    setExpanded((prev) => !prev);
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        {/* Top Card */}
        <Animated.View
          style={[styles.cardOne, { transform: [{ translateY: slideAnim }] }]}
        >
          <IconSymbol name="LocationOutline" size={24} color="#000" />

          <View style={styles.cardOneTextWrapper}>
            <Text style={styles.destinationWay}>
              KFC - Nottingham - Cross Street Retails Park
            </Text>
            <Text style={styles.address}>
              Cross Street Retail Park, New Street, Long Eaton, Nottingham
            </Text>
          </View>
        </Animated.View>

        {/* Bottom Card */}
        <Animated.View
          style={[
            styles.bottomCard,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Always visible */}
          <View style={styles.bottomCardContent}>
            <Text style={styles.statusText}>On it's way</Text>
            <Text style={styles.bottomAddress}>
              KFC - Nottingham - Cross Street Retails Park
            </Text>
          </View>

          {/* Expandable content */}
          {expanded && (
            <View style={styles.expandSection}>
              <View style={{ alignItems: "flex-start", gap: 10 }}>
                <Text style={styles.noteHeader}>Note from business</Text>
                <Text style={styles.noteItems}>
                  Please check the guidance on where to collect the orders from
                  on the front door of the restaurant
                </Text>
              </View>

              <Separator color="black" />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  paddingHorizontal: 25,
                }}
              >
                <IconSymbol name="Location" size={24} color="#000" />
                <Text
                  style={{ flex: 1, paddingHorizontal: 10, lineHeight: 20 }}
                >
                  KFC - Nottingham - Cross Street Retails Park, new Street, Long
                  Eaton, Notttingham
                </Text>
              </View>

              <Text
                style={{
                  width: "100%",
                  backgroundColor: "#FFDA71",
                  color: "#000",
                  padding: 10,
                  borderRadius: 10,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                1 order from pick-up
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  paddingHorizontal: 25,
                }}
              >
                <View>
                  <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                    David D.
                  </Text>
                  <Text style={{ color: "#555" }}>4593C • 3 items</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {}}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    backgroundColor: "#D44C0C",
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 16 }}>Details</Text>
                </TouchableOpacity>
              </View>

              <View style={{ alignItems: "center", marginTop: 10, gap: 10 }}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  How did the pickup go?
                </Text>
                <View style={{ flexDirection: "row", gap: 100, marginTop: 10 }}>
                  <IconSymbol name="ThumbsUpIcon" size={24} color="#10AA08" />
                  <IconSymbol name="ThumbsDownIcon" size={24} color="#F12100" />
                </View>
              </View>

              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <View
                  style={{
                    width: 100,
                    height: 100,
                    backgroundColor: "white",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <IconSymbol name="Warning" size={24} color="#000" />
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.confirmButton}
                >
                  <IconSymbol
                    name="ArrowRightLongIcon"
                    size={18}
                    color="#fff"
                  />
                  <Text style={styles.confirmText}>Start delivery</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Expand Button */}
          <TouchableOpacity onPress={toggleExpand} style={styles.closeButton}>
            <IconSymbol name="NavListIcon" size={22} color="#000" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default ConfirmPickupModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  /* Top Card */
  cardOne: {
    position: "absolute",
    top: "5%",
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F9FD",
    borderRadius: 20,
    padding: 25,
    borderWidth: 2,
    borderColor: "#000",
  },
  cardOneTextWrapper: {
    flex: 1,
    gap: 8,
    paddingHorizontal: 10,
  },
  destinationWay: {
    fontSize: 18,
    fontWeight: "600",
  },
  address: {
    color: "#555",
  },

  /* Bottom Card */
  bottomCard: {
    position: "absolute",
    bottom: "5%",
    width: "90%",
    backgroundColor: "#F4F9FD",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#000",
    padding: 20,
  },
  bottomCardContent: {
    alignItems: "center",
    gap: 18,
  },
  statusText: {
    fontWeight: "600",
    fontSize: 18,
  },
  bottomAddress: {
    textAlign: "center",
  },

  /* Expanded */
  expandSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 25,
  },
  noteHeader: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
  noteItems: {
    paddingHorizontal: 10,
    color: "#333",
    lineHeight: 20,
  },

  confirmButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 10,
    backgroundColor: "#D44C0C",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 20,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  /* Button */
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
  },
});
