import { CheckCircle2, ImagePlus, Trash2 } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ImageType = {
  uri: string;
  uploadedUrl?: string;
};

type Props = {
  productImage: ImageType | null;
  uploadProgress: number;
  handleImageUpload: () => void;
  removeImage: () => void;
  isUploading?: boolean;
};

export const BusinessImagePicker: React.FC<Props> = ({
  productImage,
  uploadProgress,
  handleImageUpload,
  removeImage,
  isUploading = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={{ fontWeight: "500", fontSize: 16 }}>
          Upload Business Image
        </Text>
        <Text style={styles.required}> *</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={{ color: "#555", fontSize: 14 }}>
          Upload a high-quality image to entice customers
        </Text>
      </View>

      {!productImage ? (
        <TouchableOpacity
          style={[styles.uploadCard, isUploading && styles.disabled]}
          onPress={handleImageUpload}
          disabled={isUploading}
          activeOpacity={0.7}
        >
          {isUploading ? (
            <>
              <ActivityIndicator />
              <Text style={styles.subtitle}>{uploadProgress}%</Text>

              <View style={styles.progressBar}>
                <View
                  style={{
                    width: `${uploadProgress}%`,
                    height: "100%",
                    backgroundColor: "#000",
                  }}
                />
              </View>
            </>
          ) : (
            <View style={styles.uploadContent}>
              <ImagePlus size={40} color="#000" />
              <Text style={styles.title}>Tap to upload image</Text>
              <Text style={styles.subText}>PNG / JPEG • Max 5MB</Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.previewWrapper}
          onPress={handleImageUpload}
          activeOpacity={0.8}
        >
          {/* IMAGE */}
          <Image
            source={{
              uri: productImage.uploadedUrl || productImage.uri,
            }}
            style={styles.image}
          />

          {/* BADGE */}
          <View style={styles.badge}>
            <CheckCircle2 size={16} color="#ffb47e" />
            <Text style={styles.badgeText}>Uploaded</Text>
          </View>

          {/* REMOVE BUTTON (FIXED LIKE LOGO) */}
          <TouchableOpacity
            onPress={removeImage}
            activeOpacity={0.7}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            style={styles.removeBtn}
          >
            <Trash2 size={20} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 27,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },

  required: {
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "600",
  },

  infoBox: {
    backgroundColor: "#FF592040",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },

  uploadCard: {
    height: 160,
    borderRadius: 12,
    backgroundColor: "#E2E2E2",
    justifyContent: "center",
    alignItems: "center",
  },

  disabled: {
    opacity: 0.6,
  },

  uploadContent: {
    alignItems: "center",
    gap: 6,
  },

  title: {
    fontWeight: "700",
    fontSize: 16,
  },

  subText: {
    fontSize: 12,
    color: "#666",
  },

  subtitle: {
    marginTop: 10,
    fontWeight: "600",
  },

  progressBar: {
    height: 6,
    width: "80%",
    backgroundColor: "#eee",
    marginTop: 10,
    borderRadius: 4,
    overflow: "hidden",
  },

  previewWrapper: {
    position: "relative",
    width: "100%",
    height: 200,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },

  badgeText: {
    marginLeft: 5,
    fontWeight: "600",
    color: "#fff",
    fontSize: 10,
  },

  removeBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,

    width: 52,
    height: 52,
    borderRadius: 26,

    backgroundColor: "#FF5920",

    justifyContent: "center",
    alignItems: "center",

    zIndex: 10,
    elevation: 10,
  },
});
