// modals/TakePhotoModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Platform,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import { useTheme } from "../context/ThemeContext";

interface TakePhotoModalProps {
  visible: boolean;
  onClose: () => void;
  onDone: () => void;
}

const TakePhotoModal: React.FC<TakePhotoModalProps> = ({
  visible,
  onClose,
  onDone,
}) => {
  const { colors } = useTheme();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const now = new Date();
  const hours = now.getHours() % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = now.getHours() >= 12 ? "pm" : "am";

  const handleDone = () => {
    if (photoUri) onDone();
  };

  const handleRetake = () => setPhotoUri(null);

  const handlePickPhoto = () => setPhotoUri("placeholder");

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={onClose}>
          <IconSymbol name="ArrowLeftIcon" size={22} color={colors.iconColor} />
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Photo thumbnail + status */}
          <View style={styles.photoRow}>
            <TouchableOpacity
              style={[
                styles.photoBox,
                { backgroundColor: colors.inputBg },
                photoUri && { borderWidth: 2, borderColor: colors.accentGreen },
              ]}
              onPress={handlePickPhoto}
              activeOpacity={0.8}
            >
              {photoUri ? (
                photoUri === "placeholder" ? (
                  <View style={[styles.photoPlaceholderFilled, { backgroundColor: colors.inputBg }]}>
                    <IconSymbol name="CheckmarkIcon" size={28} color={colors.accentGreen} />
                  </View>
                ) : (
                  <Image source={{ uri: photoUri }} style={styles.photoImage} />
                )
              ) : (
                <View style={[styles.photoEmpty, { backgroundColor: colors.inputBg }]} />
              )}
            </TouchableOpacity>

            <Text style={[styles.photoLabel, { color: colors.textPrimary }]}>
              {photoUri ? "Photo added" : "Tap to add photo"}
            </Text>
          </View>

          {/* View photo / Retake */}
          {photoUri && (
            <View style={styles.photoActions}>
              <TouchableOpacity style={[styles.photoActionBtn, { backgroundColor: colors.actionBtnBg, borderColor: colors.actionBtnBorder }]}>
                <IconSymbol name="ImageIcon" size={16} color={colors.iconColor} />
                <Text style={[styles.photoActionText, { color: colors.textPrimary }]}>View photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.photoActionBtn, { backgroundColor: colors.actionBtnBg, borderColor: colors.actionBtnBorder }]}
                onPress={handleRetake}
              >
                <IconSymbol name="RetakeIcon" size={16} color={colors.iconColor} />
                <Text style={[styles.photoActionText, { color: colors.textPrimary }]}>Retake</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Note to Customer */}
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
              placeholder=""
              placeholderTextColor={colors.textMuted}
              textAlignVertical="top"
            />
          </View>

          {/* Time delivered */}
          <View style={styles.timeSection}>
            <Text style={[styles.timeLabel, { color: colors.textPrimary }]}>Time delivered</Text>
            <View style={[styles.timeBox, { backgroundColor: colors.inputBg }]}>
              <Text style={[styles.timeText, { color: colors.textPrimary }]}>
                {hours}
                <Text style={[styles.timeColon, { color: colors.textMuted }]}> : </Text>
                {minutes}
                <Text style={[styles.timeAmpm, { color: colors.textSecondary }]}> {ampm}</Text>
              </Text>
            </View>
          </View>

          {/* Done button */}
          <TouchableOpacity
            style={[
              styles.doneBtn,
              { backgroundColor: photoUri ? colors.accentDark : colors.textMuted },
            ]}
            onPress={handleDone}
            activeOpacity={photoUri ? 0.85 : 1}
          >
            <Text style={[styles.doneBtnText, { color: photoUri ? colors.card : colors.textSecondary }]}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TakePhotoModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 56 : 36,
  },
  backBtn: { paddingHorizontal: 20, paddingBottom: 16 },
  content: { flex: 1, paddingHorizontal: 24, gap: 28 },
  photoRow: { flexDirection: "row", alignItems: "center", gap: 20, marginTop: 8 },
  photoBox: { width: 88, height: 88, borderRadius: 18, overflow: "hidden" },
  photoEmpty: { flex: 1, borderRadius: 18 },
  photoPlaceholderFilled: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  photoImage: { width: "100%", height: "100%" },
  photoLabel: { fontSize: 18, fontWeight: "500" },
  photoActions: { flexDirection: "row", gap: 12 },
  photoActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    borderWidth: 1,
  },
  photoActionText: { fontSize: 14, fontWeight: "500" },
  noteSection: { gap: 8 },
  noteLabelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  noteLabel: { fontSize: 16, fontWeight: "600" },
  noteCount: { fontSize: 13 },
  noteInput: { height: 110, borderRadius: 14, padding: 14, fontSize: 14 },
  timeSection: { alignItems: "center", gap: 12 },
  timeLabel: { fontSize: 16, fontWeight: "600" },
  timeBox: { borderRadius: 50, paddingVertical: 12, paddingHorizontal: 32 },
  timeText: { fontSize: 22, fontWeight: "600", letterSpacing: 2 },
  timeColon: {},
  timeAmpm: { fontSize: 14, fontWeight: "400" },
  doneBtn: {
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 36,
  },
  doneBtnText: { fontSize: 17, fontWeight: "700" },
});