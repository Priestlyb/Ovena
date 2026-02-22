// modals/TakePhotoModal.tsx
import React, { useRef, useState } from "react";
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
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [note, setNote] = useState("");

  // Current time for "Time delivered"
  const now = new Date();
  const hours = now.getHours() % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = now.getHours() >= 12 ? "pm" : "am";

  const handleDone = () => {
    if (photoUri) {
      onDone();
    }
  };

  const handleRetake = () => {
    setPhotoUri(null);
  };

  // Simulate picking a photo (replace with real image picker in production)
  const handlePickPhoto = () => {
    // Placeholder: In production use expo-image-picker or react-native-image-picker
    // For demo, set a placeholder URI
    setPhotoUri("placeholder");
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={onClose}>
          <IconSymbol name="ArrowLeftIcon" size={22} color="#000" />
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Photo thumbnail + status */}
          <View style={styles.photoRow}>
            <TouchableOpacity
              style={[styles.photoBox, photoUri && styles.photoBoxFilled]}
              onPress={handlePickPhoto}
              activeOpacity={0.8}
            >
              {photoUri ? (
                photoUri === "placeholder" ? (
                  <View style={styles.photoPlaceholderFilled}>
                    <IconSymbol name="CheckmarkIcon" size={28} color="#10AA08" />
                  </View>
                ) : (
                  <Image
                    source={{ uri: photoUri }}
                    style={styles.photoImage}
                  />
                )
              ) : (
                <View style={styles.photoEmpty} />
              )}
            </TouchableOpacity>

            <Text style={styles.photoLabel}>
              {photoUri ? "Photo added" : "Tap to add photo"}
            </Text>
          </View>

          {/* View photo / Retake */}
          {photoUri && (
            <View style={styles.photoActions}>
              <TouchableOpacity style={styles.photoActionBtn}>
                <IconSymbol name="ImageIcon" size={16} color="#000" />
                <Text style={styles.photoActionText}>View photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.photoActionBtn}
                onPress={handleRetake}
              >
                <IconSymbol name="RetakeIcon" size={16} color="#000" />
                <Text style={styles.photoActionText}>Retake</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Note to Customer */}
          <View style={styles.noteSection}>
            <View style={styles.noteLabelRow}>
              <Text style={styles.noteLabel}>Note to Customer</Text>
              <Text style={styles.noteCount}>{note.length}/175</Text>
            </View>
            <TextInput
              style={styles.noteInput}
              multiline
              maxLength={175}
              value={note}
              onChangeText={setNote}
              placeholder=""
              placeholderTextColor="#ccc"
              textAlignVertical="top"
            />
          </View>

          {/* Time delivered */}
          <View style={styles.timeSection}>
            <Text style={styles.timeLabel}>Time delivered</Text>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>
                {hours}
                <Text style={styles.timeColon}> : </Text>
                {minutes}
                <Text style={styles.timeAmpm}> {ampm}</Text>
              </Text>
            </View>
          </View>

          {/* Done button */}
          <TouchableOpacity
            style={[styles.doneBtn, !photoUri && styles.doneBtnDisabled]}
            onPress={handleDone}
            activeOpacity={photoUri ? 0.85 : 1}
          >
            <Text style={styles.doneBtnText}>Done</Text>
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
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 56 : 36,
  },

  backBtn: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 28,
  },

  /* Photo */
  photoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 8,
  },
  photoBox: {
    width: 88,
    height: 88,
    borderRadius: 18,
    backgroundColor: "#e8e8e8",
    overflow: "hidden",
  },
  photoBoxFilled: {
    borderWidth: 2,
    borderColor: "#10AA08",
  },
  photoEmpty: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    borderRadius: 18,
  },
  photoPlaceholderFilled: {
    flex: 1,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  photoLabel: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111",
  },

  /* Photo actions */
  photoActions: {
    flexDirection: "row",
    gap: 12,
  },
  photoActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  photoActionText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },

  /* Note */
  noteSection: {
    gap: 8,
  },
  noteLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  noteCount: {
    fontSize: 13,
    color: "#999",
  },
  noteInput: {
    height: 110,
    backgroundColor: "#f0f0f0",
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: "#333",
    borderWidth: 0,
  },

  /* Time */
  timeSection: {
    alignItems: "center",
    gap: 12,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  timeBox: {
    backgroundColor: "#f0f0f0",
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  timeText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111",
    letterSpacing: 2,
  },
  timeColon: {
    color: "#999",
  },
  timeAmpm: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
  },

  /* Done */
  doneBtn: {
    backgroundColor: "#111",
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 36,
  },
  doneBtnDisabled: {
    backgroundColor: "#ccc",
  },
  doneBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});