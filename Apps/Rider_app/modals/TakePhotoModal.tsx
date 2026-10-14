// modals/TakePhotoModal.tsx
//
// Full-screen camera modal.
// • Uses expo-camera CameraView to take a real photo
// • Driver can add a note (sent via onDone callback)
// • "Done" is disabled until a photo has been taken
// • onDone(photoUri, note) → DeliveryingModal marks photoTaken = true

import React, { useRef, useState, useEffect } from "react";
import {
  Modal, View, Text, TouchableOpacity, StyleSheet,
  TextInput, Platform, Alert, ActivityIndicator, Image,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { IconSymbol } from "../components/ui/icon-symbol";
import { useTheme } from "../context/ThemeContext";
import { MockOrder } from "../data/mockOrders";

interface TakePhotoModalProps {
  visible:  boolean;
  onClose:  () => void;
  onDone:   (photoUri: string, note: string) => void;
  order:    MockOrder | null;
}

const TakePhotoModal: React.FC<TakePhotoModalProps> = ({
  visible, onClose, onDone, order,
}) => {
  const { colors } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [photoUri,    setPhotoUri]    = useState<string | null>(null);
  const [note,        setNote]        = useState("");
  const [capturing,   setCapturing]   = useState(false);
  const [submitting,  setSubmitting]  = useState(false);

  // Reset every time the modal opens
  useEffect(() => {
    if (visible) {
      setPhotoUri(null);
      setNote("");
      setCapturing(false);
      setSubmitting(false);
    }
  }, [visible]);

  useEffect(() => {
    if (visible && permission && !permission.granted) {
      requestPermission();
    }
  }, [visible, permission]);

  const now     = new Date();
  const hours   = now.getHours() % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm    = now.getHours() >= 12 ? "pm" : "am";

  const handleCapture = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const result = await cameraRef.current.takePictureAsync({ quality: 0.75 });
      if (result?.uri) {
        setPhotoUri(result.uri);
      } else {
        Alert.alert("Camera Error", "Could not capture photo. Try again.");
      }
    } catch (e) {
      Alert.alert("Camera Error", "Something went wrong with the camera.");
    } finally {
      setCapturing(false);
    }
  };

  const handleRetake = () => setPhotoUri(null);

  const handleDone = async () => {
    if (!photoUri) return;
    setSubmitting(true);

    // ── Submit note to backend ────────────────────────────────────────────────
    // TODO: replace with your real API call, e.g.:
    //   await fetch("https://ovena-backend-production.up.railway.app/api/driver/delivery/note/", {
    //     method: "POST",
    //     headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       order_id: order?.id,
    //       photo_uri: photoUri,
    //       note: note.trim(),
    //       delivered_at: new Date().toISOString(),
    //     }),
    //   });
    await new Promise((r) => setTimeout(r, 600)); // simulate network
    // ─────────────────────────────────────────────────────────────────────────

    setSubmitting(false);
    onDone(photoUri, note.trim());
  };

  if (!visible) return null;

  // ── Permission gate ───────────────────────────────────────────────────────
  if (!permission?.granted) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={[styles.permissionBox, { backgroundColor: colors.background }]}>
          <IconSymbol name="CameraIcon" size={48} color={colors.textMuted} />
          <Text style={[styles.permTitle, { color: colors.textPrimary }]}>Camera Access Required</Text>
          <Text style={[styles.permBody, { color: colors.textSecondary }]}>
            Allow camera access to take a proof-of-delivery photo.
          </Text>
          <TouchableOpacity
            style={[styles.permBtn, { backgroundColor: colors.accentOrange }]}
            onPress={requestPermission}
          >
            <Text style={styles.permBtnText}>Allow Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 12 }} onPress={onClose}>
            <Text style={[styles.permCancel, { color: colors.textMuted }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>

        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={onClose} disabled={submitting}>
          <IconSymbol name="ChevronForwardIcon" size={22} color={colors.iconColor} />
        </TouchableOpacity>

        {/* ── Delivery photo warning ── */}
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>
            ⚠️  Photo of delivery should have the food inside the expected delivery bag for proper confirmation
          </Text>
        </View>

        <View style={styles.content}>

          {/* ── Camera or preview ── */}
          {!photoUri ? (
            <View style={styles.cameraWrap}>
              <CameraView
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                facing={"back" as CameraType}
              />
              {/* Capture button */}
              <TouchableOpacity
                style={[styles.captureBtn, { backgroundColor: colors.accentOrange }]}
                onPress={handleCapture}
                disabled={capturing}
                activeOpacity={0.85}
              >
                {capturing
                  ? <ActivityIndicator color="#fff" />
                  : <IconSymbol name="CameraIcon" size={26} color="#fff" />
                }
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.previewWrap}>
              <Image source={{ uri: photoUri }} style={styles.preview} resizeMode="cover" />
              {/* Retake overlay button */}
              <TouchableOpacity
                style={[styles.retakeBtn, { backgroundColor: colors.inputBg }]}
                onPress={handleRetake}
              >
                <IconSymbol name="RetakeIcon" size={18} color={colors.iconColor} />
                <Text style={[styles.retakeText, { color: colors.textPrimary }]}>Retake</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Photo status row */}
          <View style={styles.photoStatusRow}>
            <View style={[
              styles.photoStatusDot,
              { backgroundColor: photoUri ? colors.accentGreen : colors.inputBg },
            ]} />
            <Text style={[styles.photoStatusText, { color: colors.textPrimary }]}>
              {photoUri ? "Photo ready" : "Tap the camera to take a photo"}
            </Text>
          </View>

          {/* Note to customer */}
          <View style={styles.noteSection}>
            <View style={styles.noteLabelRow}>
              <Text style={[styles.noteLabel, { color: colors.textPrimary }]}>Note to Customer</Text>
              <Text style={[styles.noteCount, { color: colors.textMuted }]}>{note.length}/175</Text>
            </View>
            <TextInput
              style={[styles.noteInput, { backgroundColor: colors.inputBg, color: colors.textPrimary }]}
              multiline
              maxLength={175}
              value={note}
              onChangeText={setNote}
              placeholder="Add a note for the customer…"
              placeholderTextColor={colors.textMuted}
              textAlignVertical="top"
            />
          </View>

          {/* Time delivered */}
          <View style={styles.timeRow}>
            <Text style={[styles.timeLabel, { color: colors.textPrimary }]}>Time delivered</Text>
            <View style={[styles.timePill, { backgroundColor: colors.inputBg }]}>
              <Text style={[styles.timeText, { color: colors.textPrimary }]}>
                {hours}:{minutes} {ampm}
              </Text>
            </View>
          </View>

          {/* Done button */}
          <TouchableOpacity
            style={[
              styles.doneBtn,
              { backgroundColor: photoUri ? colors.accentDark : colors.separatorColor },
            ]}
            onPress={handleDone}
            disabled={!photoUri || submitting}
            activeOpacity={photoUri ? 0.85 : 1}
          >
            {submitting
              ? <ActivityIndicator color={colors.card} />
              : <Text style={[styles.doneBtnText, { color: photoUri ? colors.card : colors.textMuted }]}>
                  Done
                </Text>
            }
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default TakePhotoModal;

const styles = StyleSheet.create({
  // ── Delivery photo warning ─────────────────────────────────────────────────
  warningBanner: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: "#FFF0F0",
    borderLeftWidth: 4,
    borderLeftColor: "#D32F2F",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  warningText: {
    color: "#D32F2F",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
  },

  // ── Permission screen ────────────────────────────────────────────────────
  permissionBox: {
    flex: 1, alignItems: "center", justifyContent: "center",
    padding: 32, gap: 12,
  },
  permTitle:  { fontSize: 20, fontWeight: "700", textAlign: "center" },
  permBody:   { fontSize: 14, textAlign: "center", lineHeight: 22 },
  permBtn:    { borderRadius: 50, paddingVertical: 14, paddingHorizontal: 40, marginTop: 8 },
  permBtnText:{ color: "#fff", fontWeight: "700", fontSize: 16 },
  permCancel: { fontSize: 14 },

  // ── Main layout ──────────────────────────────────────────────────────────
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 56 : 36,
  },
  backBtn:  { paddingHorizontal: 20, paddingBottom: 12 },
  content:  { flex: 1, paddingHorizontal: 20, gap: 20 },

  // ── Camera / preview ─────────────────────────────────────────────────────
  cameraWrap: {
    height: 260, borderRadius: 20, overflow: "hidden",
    backgroundColor: "#000", position: "relative",
  },
  captureBtn: {
    position: "absolute", bottom: 16, alignSelf: "center",
    width: 64, height: 64, borderRadius: 32,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 8,
  },
  previewWrap: {
    height: 260, borderRadius: 20, overflow: "hidden",
    position: "relative",
  },
  preview: { width: "100%", height: "100%" },
  retakeBtn: {
    position: "absolute", bottom: 12, right: 12,
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 50,
  },
  retakeText: { fontSize: 13, fontWeight: "600" },

  // ── Status row ────────────────────────────────────────────────────────────
  photoStatusRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  photoStatusDot: { width: 10, height: 10, borderRadius: 5 },
  photoStatusText:{ fontSize: 13 },

  // ── Note ─────────────────────────────────────────────────────────────────
  noteSection:  { gap: 8 },
  noteLabelRow: { flexDirection: "row", justifyContent: "space-between" },
  noteLabel:    { fontSize: 15, fontWeight: "600" },
  noteCount:    { fontSize: 13 },
  noteInput:    { height: 96, borderRadius: 14, padding: 14, fontSize: 14 },

  // ── Time ─────────────────────────────────────────────────────────────────
  timeRow:   { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  timeLabel: { fontSize: 15, fontWeight: "600" },
  timePill:  { borderRadius: 50, paddingVertical: 10, paddingHorizontal: 22 },
  timeText:  { fontSize: 16, fontWeight: "600", letterSpacing: 1 },

  // ── Done button ───────────────────────────────────────────────────────────
  doneBtn: {
    borderRadius: 50, paddingVertical: 18,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: Platform.OS === "ios" ? 32 : 20,
  },
  doneBtnText: { fontSize: 17, fontWeight: "700" },
});