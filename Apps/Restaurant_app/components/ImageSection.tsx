import React from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  CheckCircle2,
  ImagePlus,
  RefreshCcw,
  XCircle,
} from "lucide-react-native";

/* ================================
   TYPES
================================ */
type ImageType = {
  uri: string;
  uploadedUrl?: string;
};

type ImageSectionProps = {
  productImage: ImageType | null;
  uploadProgress: number;
  handleImageUpload: () => void;
  hasPendingImageChange: boolean;
  cancelImageChange: () => void;
  isUploading?: boolean;
};

/* ================================
   COMPONENT
================================ */
export const ImageSection: React.FC<ImageSectionProps> = ({
  productImage,
  uploadProgress,
  handleImageUpload,
  hasPendingImageChange,
  cancelImageChange,
  isUploading = false,
}) => {
  /* ================================
     EMPTY STATE
  ================================ */
  if (!productImage) {
    return (
      <TouchableOpacity
        style={[styles.uploadCard, isUploading && styles.uploadCardDisabled]}
        onPress={handleImageUpload}
        disabled={isUploading}
        activeOpacity={0.85}
      >
        <View style={styles.iconWrapper}>
          {isUploading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <ImagePlus size={26} color="#FFFFFF" />
          )}
        </View>

        {isUploading ? (
          <>
            <Text style={styles.uploadTitle}>Uploading Image...</Text>

            <Text style={styles.uploadSubtitle}>
              {uploadProgress}% completed
            </Text>

            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${uploadProgress}%`,
                  },
                ]}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.uploadTitle}>Upload Product Image</Text>

            <Text style={styles.uploadSubtitle}>
              Tap to select an image from your gallery
            </Text>
          </>
        )}
      </TouchableOpacity>
    );
  }

  /* ================================
     IMAGE PREVIEW
  ================================ */
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: productImage.uri || "",
          }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.successBadge}>
          <CheckCircle2 size={18} color="#ffb47e" />

          <Text style={styles.successText}>
            {hasPendingImageChange ? "New Image" : "Current Image"}
          </Text>
        </View>
      </View>

      {/* ================================
          ACTION BUTTONS
      ================================= */}
      <View style={styles.actionsRow}>
        {/* CHANGE IMAGE */}
        <TouchableOpacity
          style={styles.changeButton}
          onPress={handleImageUpload}
          activeOpacity={0.85}
          disabled={isUploading}
        >
          <RefreshCcw size={18} color="#FFFFFF" />

          <Text style={styles.changeText}>Change Image</Text>
        </TouchableOpacity>

        {/* CANCEL CHANGE */}
        {hasPendingImageChange && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={cancelImageChange}
            activeOpacity={0.85}
            disabled={isUploading}
          >
            <XCircle size={18} color="#FFFFFF" />

            <Text style={styles.cancelText}>Cancel Change</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* INFO TEXT */}
      {hasPendingImageChange && (
        <Text style={styles.pendingText}>
          The new image will be uploaded when you tap "Update Menu".
        </Text>
      )}
    </View>
  );
};

/* ================================
   STYLES
================================ */
const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 14,
  },

  /* ================================
     UPLOAD CARD
  ================================ */
  uploadCard: {
    width: "100%",
    minHeight: 230,
    borderRadius: 24,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#D0D5DD",
    backgroundColor: "#FCFCFD",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 28,
  },

  uploadCardDisabled: {
    opacity: 0.9,
  },

  iconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 999,
    backgroundColor: "#101828",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  uploadTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#101828",
    textAlign: "center",
    marginBottom: 8,
  },

  uploadSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: "#667085",
    textAlign: "center",
  },

  /* ================================
     PROGRESS BAR
  ================================ */
  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#EAECF0",
    borderRadius: 999,
    marginTop: 22,
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    backgroundColor: "#101828",
    borderRadius: 999,
  },

  /* ================================
     IMAGE
  ================================ */
  imageWrapper: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: 260,
    borderRadius: 24,
    backgroundColor: "#F2F4F7",
  },

  successBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  successText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffb47e",
  },

  /* ================================
     ACTION BUTTONS
  ================================ */
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },

  changeButton: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#101828",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  changeText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  cancelButton: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#F84E10",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  cancelText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  pendingText: {
    marginTop: 14,
    fontSize: 13,
    lineHeight: 20,
    color: "#667085",
    textAlign: "center",
  },
});
