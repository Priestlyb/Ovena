// modals/CustomerModal.tsx
// Opened from DeliveryingModal via the hamburger button.
// Shows full delivery details + slide-to-complete pill (locked until photo taken).
import React, { useEffect, useRef, useState } from "react";
import {
  Modal, View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Animated, Easing, PanResponder, Linking, Alert,
  TextInput,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import { useTheme } from "../context/ThemeContext";
import { MockOrder } from "../data/mockOrders";
import { RouteSummary } from "../components/DriverMapView";

export interface CustomerModalProps {
  visible:            boolean;
  onClose:            () => void;
  onTakePhoto:        () => void;
  onCompleteDelivery: (orderCode: string) => Promise<boolean> | void;  // ← now can report success/fail
  photoTaken:         boolean;
  order:              MockOrder | null;
  routeSummary:       RouteSummary | null;
}

const PILL_WIDTH      = 56;
const THRESHOLD_RATIO = 0.72;

const CustomerModal: React.FC<CustomerModalProps> = ({
  visible, onClose, onTakePhoto, onCompleteDelivery, photoTaken, order, routeSummary,
}) => {
  const { colors } = useTheme();
  const [origin_order_code, setOrigin_order_code] = useState("");

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Slide-to-complete gesture state stored in a ref so PanResponder callbacks
  // always have the latest values without recreating the responder.
  const gesture = useRef({
    dragX:      new Animated.Value(0),
    dragXValue: 0,
    startX:     0,
    trackWidth: 0,
    onComplete: onCompleteDelivery,
  });
  gesture.current.onComplete = onCompleteDelivery;
  const { dragX } = gesture.current;

  // Ref so PanResponder closure can read the latest orderCode without stale closure
  const orderCodeRef = useRef("");

  useEffect(() => {
    const id = dragX.addListener(({ value }) => { gesture.current.dragXValue = value; });
    return () => dragX.removeListener(id);
  }, []);

  const resetPill = () => {
    dragX.stopAnimation();
    dragX.setValue(0);
    gesture.current.dragXValue = 0;
    gesture.current.startX     = 0;
  };

  useEffect(() => {
    if (!visible) {
      resetPill();
      setOrigin_order_code("");
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.95);
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 250, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 100, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  // Keep ref in sync with orderCode state (for PanResponder closure)
  useEffect(() => { orderCodeRef.current = origin_order_code; }, [origin_order_code]);

  // Reset pill when photo status changes
  useEffect(() => { if (!photoTaken) resetPill(); }, [photoTaken]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,
      onPanResponderGrant: () => {
        gesture.current.dragX.stopAnimation();
        gesture.current.startX = gesture.current.dragXValue;
      },
      onPanResponderMove: (_, { dx }) => {
        const { dragX, startX, trackWidth } = gesture.current;
        dragX.setValue(Math.max(0, Math.min(startX + dx, trackWidth - PILL_WIDTH)));
      },
      onPanResponderRelease: () => {
        const { dragX, dragXValue, trackWidth, onComplete } = gesture.current;
        const maxDrag   = trackWidth - PILL_WIDTH;
        const threshold = maxDrag * THRESHOLD_RATIO;

        if (dragXValue >= threshold) {
          Animated.timing(dragX, { toValue: maxDrag, duration: 120, useNativeDriver: false }).start(async () => {
            const result = onComplete(orderCodeRef.current);
            const success = result instanceof Promise ? await result : true;

            // If the parent couldn't complete the delivery (e.g. invalid
            // code), snap the pill back so the driver can try again instead
            // of leaving it stranded at the end of the track.
            if (!success) {
              Animated.spring(dragX, { toValue: 0, friction: 7, tension: 80, useNativeDriver: false }).start();
            }
          });
        } else {
          Animated.spring(dragX, { toValue: 0, friction: 7, tension: 80, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  if (!order) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.45)" }]}>
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: colors.card, opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* ── Header ── */}
          <View style={[styles.headerRow, { borderBottomColor: colors.separatorColor }]}>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <IconSymbol name="ChevronDownIcon" size={22} color={colors.iconColor} />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={[styles.headerStat, { color: colors.textPrimary }]}>
                {routeSummary?.duration ?? "…"}
              </Text>
              <IconSymbol name="Bicycle" size={20} color={colors.iconColor} />
              <Text style={[styles.headerStat, { color: colors.textPrimary }]}>
                {routeSummary?.distance ?? ""}
              </Text>
            </View>

            <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <IconSymbol name="NavListIcon" size={20} color={colors.iconColor} />
            </TouchableOpacity>
            <TouchableOpacity
  onPress={onClose}
  style={[styles.closeIconBtn, { backgroundColor: colors.inputBg }]}
  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
>
  <IconSymbol name="XMarkIcon" size={18} color={colors.iconColor} />
</TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

            {/* Customer name + contact */}
            <View style={styles.nameRow}>
              <Text style={[styles.customerName, { color: colors.textPrimary }]}>
                {order.customerName}
              </Text>
              <View style={styles.contactBtns}>
                {/* Chat — coming soon */}
                <TouchableOpacity
                  style={[styles.contactBtn, { backgroundColor: colors.actionBtnBg, borderColor: colors.actionBtnBorder }]}
                  activeOpacity={0.7}
                  onPress={() =>
                    Alert.alert("Coming Soon", "In-app chat is coming soon.", [{ text: "OK" }])
                  }
                >
                  <IconSymbol name="MessageIcon" size={22} color={colors.iconColor} />
                </TouchableOpacity>

                {/* Phone — opens dialler */}
                <TouchableOpacity
                  style={[styles.contactBtn, { backgroundColor: colors.actionBtnBg, borderColor: colors.actionBtnBorder }]}
                  activeOpacity={0.7}
                  onPress={() => {
                    const phone = order.customerPhone;
                    if (!phone) return;
                    Linking.openURL(`tel:${phone}`).catch(() =>
                      Alert.alert("Error", "Could not open the phone app.")
                    );
                  }}
                >
                  <IconSymbol name="PhoneIcon" size={22} color={colors.iconColor} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Delivery type */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Delivery type</Text>
              <Text style={[styles.sectionValue, { color: colors.textPrimary }]}>{order.deliveryType}</Text>
              {!!order.customerNote && (
                <>
                  <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Note from customer</Text>
                  <Text style={[styles.noteItem, { color: colors.textSecondary }]}>• {order.customerNote}</Text>
                </>
              )}
            </View>

            {/* Address */}
            <View style={[styles.addressCard, { backgroundColor: colors.accentYellow }]}>
              <IconSymbol name="LocationArrowIcon" size={18} color={colors.accentOrange} />
              <Text style={styles.addressText}>{order.deliveryAddress}</Text>
            </View>

            {/* Order row */}
            <View style={[styles.orderRow, { borderColor: colors.separatorColor }]}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={[styles.orderIdLabel, { color: colors.textMuted }]}>Order ID</Text>
                <Text style={[styles.orderIdValue, { color: colors.textPrimary }]}>#{order.order_id}</Text>
                <Text style={[styles.orderDesc, { color: colors.textSecondary }]}>
                  {order.restaurantName} · {order.itemCount} items
                </Text>
              </View>
              <View style={[styles.checkCircle, { backgroundColor: photoTaken ? colors.accentGreen : colors.cardSecondary }]}>
                <IconSymbol name="CheckmarkIcon" size={14} color="#fff" />
              </View>
            </View>

            {/* Take photo */}
            <TouchableOpacity
              style={[styles.takePhotoBtn, { backgroundColor: colors.accentOrange }]}
              onPress={onTakePhoto}
              activeOpacity={0.85}
            >
              <IconSymbol name="CameraIcon" size={20} color="#fff" />
              <Text style={styles.takePhotoBtnText}>Take photo</Text>
            </TouchableOpacity>

            {/* Delivery code input — customer provides this verbally */}
            <View style={styles.codeSection}>
              <Text style={[styles.codeLabel, { color: colors.textPrimary }]}>
                Delivery Code
              </Text>
              <Text style={[styles.codeHint, { color: colors.textMuted }]}>
                Ask the customer for their delivery code
              </Text>
              <TextInput
                style={[
                  styles.codeInput,
                  {
                    backgroundColor: colors.inputBg,
                    color: colors.textPrimary,
                    borderColor: origin_order_code.trim() ? colors.accentGreen : colors.separatorColor,
                  },
                ]}
                value={origin_order_code}
                onChangeText={setOrigin_order_code}
                placeholder="Enter code from customer"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
              />
            </View>

            {/* Help */}
            <View style={styles.helpSection}>
              <Text style={[styles.helpTitle, { color: colors.textPrimary }]}>Help and Support</Text>
              <View style={styles.helpRow}>
                <IconSymbol name="Warning" size={18} color="#f59e0b" />
                <Text style={[styles.helpText, { color: colors.textSecondary }]}>Trip support</Text>
              </View>
            </View>

            {/* ── Slide-to-complete ── */}
            <View
              style={styles.completeRow}
              onLayout={(e) => { gesture.current.trackWidth = e.nativeEvent.layout.width; }}
            >
              {/* Yellow / grey background */}
              <View style={[
                styles.completeBg,
                { backgroundColor: photoTaken ? colors.accentYellow : colors.inputBg },
              ]}>
                <Text style={[
                  styles.completeText,
                  { color: (photoTaken && origin_order_code.trim()) ? "#1a1a1a" : colors.textMuted },
                ]}>
                  {(photoTaken && origin_order_code.trim()) ? "Slide to complete  →" : !photoTaken ? "Take a photo first" : "Enter delivery code"}
                </Text>
              </View>

              {/* Draggable pill */}
              <Animated.View
                style={[
                  styles.completePill,
                  {
                    backgroundColor: colors.accentDark,
                    transform: [{ translateX: photoTaken ? dragX : 0 }],
                  },
                ]}
{...(( photoTaken && origin_order_code.trim()) ? panResponder.panHandlers : {})}
              >
                <IconSymbol name="ArrowRightLongIcon" size={18} color={colors.card} />
              </Animated.View>
            </View>

            {(!photoTaken || !origin_order_code.trim()) && (
              <Text style={[styles.lockedHint, { color: colors.textMuted }]}>
                {!photoTaken && !origin_order_code.trim()
                  ? "📷 Take a photo and enter the delivery code to complete"
                  : !photoTaken
                  ? "📷 Take a photo first to unlock"
                  : "🔑 Enter the delivery code from the customer"}
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
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerCenter: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerStat:   { fontSize: 15, fontWeight: "600" },
  scroll:       { padding: 20, paddingBottom: 32 },

  nameRow:    { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  customerName: { fontSize: 26, fontWeight: "700", letterSpacing: -0.5 },
  contactBtns:  { flexDirection: "row", gap: 10 },
  contactBtn: {
    borderWidth: 1, borderRadius: 12,
    width: 46, height: 46,
    alignItems: "center", justifyContent: "center",
  },
  section:      { marginBottom: 18, gap: 2 },
  sectionLabel: { fontSize: 13, fontWeight: "500" },
  sectionValue: { fontSize: 15, fontWeight: "600", marginTop: 2 },
  noteItem:     { fontSize: 13, marginTop: 2, marginLeft: 4 },

  addressCard: {
    borderRadius: 14, padding: 14,
    flexDirection: "row", alignItems: "flex-start",
    gap: 10, marginBottom: 20,
  },
  addressText: { flex: 1, fontWeight: "600", fontSize: 15, lineHeight: 22, color: "#1a1a1a" },

  orderRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, marginBottom: 20,
  },
  orderIdLabel: { fontSize: 12, fontWeight: "500", marginBottom: 2 },
  orderIdValue: { fontSize: 17, fontWeight: "700", marginBottom: 4 },
  codeSection:  { marginBottom: 20, gap: 4 },
  codeLabel:    { fontSize: 15, fontWeight: "600" },
  codeHint:     { fontSize: 12 },
  codeInput: {
    height: 50, borderRadius: 12, borderWidth: 1.5,
    paddingHorizontal: 14, fontSize: 16, fontWeight: "600",
    letterSpacing: 2, marginTop: 4,
  },
  orderDesc: { fontSize: 13 },
  checkCircle: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },

  takePhotoBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, borderRadius: 50, paddingVertical: 16, marginBottom: 20,
  },
  takePhotoBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  helpSection: { marginBottom: 20, gap: 8 },
  helpTitle:   { fontWeight: "700", fontSize: 15 },
  helpRow:     { flexDirection: "row", alignItems: "center", gap: 8 },
  helpText:    { fontSize: 14 },

  completeRow: {
    height: 56, borderRadius: 50,
    overflow: "hidden", position: "relative",
  },
  completeBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 50,
    alignItems: "center", justifyContent: "center",
  },
  completePill: {
    position: "absolute", top: 0, bottom: 0, left: 0,
    width: PILL_WIDTH, borderRadius: 50,
    alignItems: "center", justifyContent: "center",
  },
  completeText: { fontWeight: "700", fontSize: 15 },
  lockedHint:   { textAlign: "center", fontSize: 12, marginTop: 10 },
  closeIconBtn: {
  width: 36, height: 36, borderRadius: 18,
  alignItems: "center", justifyContent: "center",
},
});