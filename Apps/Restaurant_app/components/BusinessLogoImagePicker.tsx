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
import { IconSymbol } from "./ui/icon-symbol";

type ImageType = {
  uri: string;
  uploadedUrl?: string;
};

type Props = {
  businessLogo: ImageType | null;
  uploadLogoProgress: number;
  handleImageUpload: () => void;
  removeImage: () => void;
  isUploadingLogo?: boolean;
};

export const BusinessLogoImagePicker: React.FC<Props> = ({
  businessLogo,
  uploadLogoProgress,
  handleImageUpload,
  removeImage,
  isUploadingLogo = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={{ fontWeight: "500", fontSize: 16 }}>
          Upload Business Logo
        </Text>
        <Text style={styles.required}> *</Text>
      </View>

      <View style={styles.infoBox}>
        <IconSymbol name="CircleInfoicon" size={18} color={"#000"} />
        <Text style={{ color: "#555", fontSize: 14 }}>
          Recommended size is 60 x 60px. Max file size is 2MB.
        </Text>
      </View>

      {!businessLogo ? (
        <TouchableOpacity
          style={[styles.uploadCard, isUploadingLogo && styles.disabled]}
          onPress={handleImageUpload}
          disabled={isUploadingLogo}
          activeOpacity={0.7}
        >
          {isUploadingLogo ? (
            <ActivityIndicator />
          ) : (
            <ImagePlus size={50} color="#000" />
          )}

          {isUploadingLogo && (
            <>
              <Text style={styles.subtitle}>{uploadLogoProgress}%</Text>

              <View style={styles.progressBar}>
                <View
                  style={{
                    width: `${uploadLogoProgress}%`,
                    height: "100%",
                    backgroundColor: "#000",
                  }}
                />
              </View>
            </>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.previewWrapper}
          onPress={handleImageUpload}
          activeOpacity={0.8}
        >
          <Image
            source={{
              uri: businessLogo.uploadedUrl || businessLogo.uri,
            }}
            style={styles.image}
          />

          <View style={styles.badge}>
            <CheckCircle2 size={16} color="#ffb47e" />
            <Text style={styles.badgeText}>Uploaded</Text>
          </View>

          {/* ✅ FIXED BUTTON */}
          <TouchableOpacity
            onPress={removeImage}
            activeOpacity={0.7}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            style={styles.removeBtn}
          >
            <Trash2 size={22} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },

  infoBox: {
    backgroundColor: "#FF592040",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
  },

  uploadCard: {
    width: 110,
    height: 110,
    borderRadius: 100,
    backgroundColor: "#FFB47E70",
    alignItems: "center",
    justifyContent: "center",
  },

  disabled: {
    opacity: 0.6,
  },

  required: {
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "600",
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },

  subtitle: {
    marginTop: 5,
  },

  progressBar: {
    height: 6,
    width: "100%",
    backgroundColor: "#eee",
    marginTop: 10,
    overflow: "hidden",
    borderRadius: 4,
  },

  previewWrapper: {
    width: 110,
    alignItems: "center",
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 60,
  },

  badge: {
    position: "absolute",
    top: 5,
    right: 5,
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
    bottom: -10,
    right: -10,

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
