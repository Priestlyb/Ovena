import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
} from "expo-camera";

interface Props {
  image: string;
  setImage: (v: string) => void;
  onContinue: () => void;
  onBack?: () => void;
  isSubmitting?: boolean; // passed from SignupScreen to drive the spinner
}

export default function VerifyIdentity({
  image,
  setImage,
  onContinue,
  isSubmitting = false,
}: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [faceOk, setFaceOk] = useState(true);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Camera permission required</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionBtn}>
          <Text style={styles.permissionText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const capturePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const result = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (!result?.uri) {
        Alert.alert("Error", "Failed to capture image");
        return;
      }
      setImage(result.uri);
    } catch (err) {
      Alert.alert("Camera Error", "Unable to take photo");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Identity</Text>

      {!image ? (
        <>
          <View style={styles.cameraWrapper}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={"front" as CameraType}
            />
            <View style={styles.circleMask} />
          </View>

          <Text style={styles.infoText}>
            Make sure your face is inside the circle. Remove glasses & face mask.
          </Text>

          <TouchableOpacity
            style={[styles.captureBtn, { opacity: faceOk ? 1 : 0.5 }]}
            disabled={!faceOk}
            onPress={capturePhoto}
          >
            <Text style={styles.captureText}>Capture Photo</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Image source={{ uri: image }} style={styles.captured} />

          {/* Retake — hidden while submitting */}
          {!isSubmitting && (
            <TouchableOpacity
              style={[styles.captureBtn, { backgroundColor: "#000" }]}
              onPress={() => setImage("")}
            >
              <Text style={styles.captureText}>Retake Photo</Text>
            </TouchableOpacity>
          )}

          {/* Continue — shows spinner while API call is in flight */}
          <TouchableOpacity
            style={[styles.continueBtn, isSubmitting && { opacity: 0.6 }]}
            onPress={onContinue}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.continueText}>Continue</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold" },

  cameraWrapper: {
    width: 280,
    height: 340,
    overflow: "hidden",
    marginTop: 10,
    borderRadius: 20,
  },
  camera: { width: "100%", height: "100%" },
  circleMask: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 150,
    borderWidth: 3,
    borderColor: "#D44C0C",
    alignSelf: "center",
    top: 40,
  },

  infoText: {
    width: "85%",
    textAlign: "center",
    marginTop: 10,
    fontSize: 13,
  },

  captureBtn: {
    marginTop: 15,
    backgroundColor: "#D44C0C",
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 40,
  },
  captureText: { color: "#fff", fontWeight: "bold" },

  captured: {
    width: 260,
    height: 260,
    borderRadius: 150,
    marginTop: 20,
    borderWidth: 3,
    borderColor: "#D44C0C",
  },

  continueBtn: {
    marginTop: 20,
    backgroundColor: "#D44C0C",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 40,
    alignItems: "center",
    minWidth: 160,
  },
  continueText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  permissionBtn: { backgroundColor: "#D44C0C", padding: 12, borderRadius: 8 },
  permissionText: { color: "#fff" },
});