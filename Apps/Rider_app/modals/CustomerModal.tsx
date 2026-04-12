// modals/CustomerModal.tsx
import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  PanResponder,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import { useTheme } from "../context/ThemeContext";

interface CustomerModalProps {
  visible: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onCompleteDelivery: () => void;
  photoTaken: boolean;
}

const PILL_WIDTH = 56;
const THRESHOLD_RATIO = 0.72;

const CustomerModal: React.FC<CustomerModalProps> = ({
  visible,
  onClose,
  onTakePhoto,
  onCompleteDelivery,
  photoTaken,
}) => {
  const { colors } = useTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const gesture = useRef({
    dragX: new Animated.Value(0),
    dragXValue: 0,
    startX: 0,
    trackWidth: 0,
    onComplete: onCompleteDelivery,
  });

  gesture.current.onComplete = onCompleteDelivery;

  const { dragX } = gesture.current;

  useEffect(() => {
    const id = dragX.addListener(({ value }) => {
      gesture.current.dragXValue = value;
    });
    return () => dragX.removeListener(id);
  }, []);

  const resetPill = () => {
    gesture.current.dragX.stopAnimation();
    gesture.current.dragX.setValue(0);
    gesture.current.dragXValue = 0;
    gesture.current.startX = 0;
  };

  useEffect(() => {
    if (!visible) {
      resetPill();
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.95);
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  useEffect(() => {
    if (!photoTaken) resetPill();
  }, [photoTaken]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        gesture.current.dragX.stopAnimation();
        gesture.current.startX = gesture.current.dragXValue;
      },

      onPanResponderMove: (_, { dx }) => {
        const { dragX, startX, trackWidth } = gesture.current;
        const maxDrag = trackWidth - PILL_WIDTH;
        const next = Math.max(0, Math.min(startX + dx, maxDrag));
        dragX.setValue(next);
      },

      onPanResponderRelease: () => {
        const { dragX, dragXValue, trackWidth, onComplete } = gesture.current;
        const maxDrag = trackWidth - PILL_WIDTH;
        const threshold = maxDrag * THRESHOLD_RATIO;

        if (dragXValue >= threshold) {
          Animated.timing(dragX, {
            toValue: maxDrag,
            duration: 120,
            useNativeDriver: false,
          }).start(() => onComplete());
        } else {
          Animated.spring(dragX, {
            toValue: 0,
            friction: 7,
            tension: 80,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlayBg }]}>
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Header row */}
          <View style={[styles.headerRow, { borderBottomColor: colors.separatorColor }]}>
            <TouchableOpacity onPress={onClose} style={styles.headerIcon}>
              <IconSymbol name="ChevronDownIcon" size={20} color={colors.iconColor} />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={[styles.headerStat, { color: colors.textPrimary }]}>10 min</Text>
              <IconSymbol name="BikeIcon" size={20} color={colors.iconColor} />
              <Text style={[styles.headerStat, { color: colors.textPrimary }]}>1.9 mil</Text>
            </View>

            <TouchableOpacity style={styles.headerIcon}>
              <IconSymbol name="NavListIcon" size={20} color={colors.iconColor} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Customer name + actions */}
            <View style={styles.nameRow}>
              <Text style={[styles.customerName, { color: colors.textPrimary }]}>David D.</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.actionBtnBg, borderColor: colors.actionBtnBorder }]}>
                  <IconSymbol name="MessageIcon" size={22} color={colors.iconColor} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.actionBtnBg, borderColor: colors.actionBtnBorder }]}>
                  <IconSymbol name="PhoneIcon" size={22} color={colors.iconColor} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Delivery type */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Delivery type</Text>
              <Text style={[styles.sectionValue, { color: colors.textPrimary }]}>Meet at door</Text>
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Note from customer</Text>
              <Text style={[styles.noteItem, { color: colors.textSecondary }]}>• Leave at door</Text>
            </View>

            {/* Address card */}
            <View style={[styles.addressCard, { backgroundColor: colors.accentYellow }]}>
              <IconSymbol name="LocationArrowIcon" size={18} color={colors.accentOrange} />
              <Text style={[styles.addressText, { color: "#1a1a1a" }]}>
                149 Westminster Crescent, Sheffield, S10 4EW
              </Text>
            </View>

            {/* Order row */}
            <View style={[styles.orderRow, { borderColor: colors.separatorColor }]}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={[styles.orderCode, { color: colors.textPrimary }]}>4593C</Text>
                <Text style={[styles.orderDesc, { color: colors.textSecondary }]}>
                  KFC - Nottingham - Cross Street Retail Park . 3 items
                </Text>
              </View>
              <View
                style={[
                  styles.checkCircle,
                  { backgroundColor: photoTaken ? colors.accentGreen : colors.cardSecondary },
                ]}
              >
                <IconSymbol name="CheckmarkIcon" size={14} color="#fff" />
              </View>
            </View>

            {/* Take photo button */}
            <TouchableOpacity style={[styles.takePhotoBtn, { backgroundColor: colors.accentOrange }]} onPress={onTakePhoto}>
              <IconSymbol name="CameraIcon" size={20} color="#fff" />
              <Text style={styles.takePhotoBtnText}>Take photo</Text>
            </TouchableOpacity>

            {/* Help and Support */}
            <View style={styles.helpSection}>
              <Text style={[styles.helpTitle, { color: colors.textPrimary }]}>Help and Support</Text>
              <View style={styles.helpRow}>
                <IconSymbol name="Warning" size={18} color="#f59e0b" />
                <Text style={[styles.helpText, { color: colors.textSecondary }]}>Trip support</Text>
              </View>
            </View>

            {/* Complete delivery — drag the pill to complete */}
            <View
              style={styles.completeRow}
              onLayout={(e) => { gesture.current.trackWidth = e.nativeEvent.layout.width; }}
            >
              <View
                style={[
                  styles.completeYellowBg,
                  { backgroundColor: photoTaken ? colors.accentYellow : colors.inputBg },
                ]}
              >
                <Text
                  style={[
                    styles.completeText,
                    { color: photoTaken ? "#1a1a1a" : colors.textMuted },
                  ]}
                >
                  {photoTaken ? "Slide to complete →" : "Complete delivery"}
                </Text>
              </View>

              <Animated.View
                style={[
                  styles.completeArrowBox,
                  { backgroundColor: colors.accentDark, transform: [{ translateX: photoTaken ? gesture.current.dragX : 0 }] },
                ]}
                {...(photoTaken ? panResponder.panHandlers : {})}
              >
                <IconSymbol name="ArrowRightLongIcon" size={18} color={colors.card} />
              </Animated.View>
            </View>

            {!photoTaken && (
              <Text style={[styles.lockedHint, { color: colors.textMuted }]}>
                📷 Take a photo first to unlock
              </Text>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CustomerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  card: {
    width: "100%",
    borderRadius: 24,
    maxHeight: "88%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 24,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerIcon: { padding: 4 },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerStat: { fontSize: 15, fontWeight: "600" },
  scrollContent: { padding: 20, paddingBottom: 28 },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  customerName: { fontSize: 26, fontWeight: "700", letterSpacing: -0.5 },
  actionButtons: { flexDirection: "row", gap: 10 },
  actionBtn: {
    borderWidth: 1,
    borderRadius: 12,
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  section: { marginBottom: 18, gap: 2 },
  sectionLabel: { fontSize: 13, fontWeight: "500" },
  sectionValue: { fontSize: 15, fontWeight: "600", marginTop: 2 },
  noteItem: { fontSize: 13, marginTop: 2, marginLeft: 4 },
  addressCard: {
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 20,
  },
  addressText: { flex: 1, fontWeight: "600", fontSize: 15, lineHeight: 22 },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  orderCode: { fontSize: 17, fontWeight: "700", marginBottom: 4 },
  orderDesc: { fontSize: 13 },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  takePhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 50,
    paddingVertical: 16,
    marginBottom: 20,
  },
  takePhotoBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  helpSection: { marginBottom: 20, gap: 8 },
  helpTitle: { fontWeight: "700", fontSize: 15 },
  helpRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  helpText: { fontSize: 14 },
  completeRow: {
    height: 56,
    borderRadius: 50,
    overflow: "hidden",
    position: "relative",
  },
  completeYellowBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  completeArrowBox: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: PILL_WIDTH,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  completeText: { fontWeight: "700", fontSize: 15 },
  lockedHint: { textAlign: "center", fontSize: 12, marginTop: 10 },
});