// app/business/BusinessImagesScreen.tsx

import { BusinessImagePicker } from "@/components/BusinessImagePicker";
import { BusinessLogoImagePicker } from "@/components/BusinessLogoImagePicker";
import FeedbackModal from "@/components/FeedbackModal";
import { Header } from "@/components/molecules/Header";
import { useBusinessImageUpdate } from "@/hooks/useBusinessImageUpdate";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

type ImageType = {
  uri: string;
  uploadedUrl?: string;
};

type FeedbackVariant = "success" | "error" | "warning" | "info";

export default function BusinessImagesScreen() {
  const router = useRouter();

  const { updateBusinessImages, loading } = useBusinessImageUpdate();

  const { profile, refreshProfile } = useBusinessProfile();

  const [businessImage, setBusinessImage] = useState<ImageType | null>(null);

  const [businessLogo, setBusinessLogo] = useState<ImageType | null>(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadLogoProgress, setUploadLogoProgress] = useState(0);

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const [feedbackVisible, setFeedbackVisible] = useState(false);

  const [feedbackConfig, setFeedbackConfig] = useState<{
    title: string;
    message: string;
    variant: FeedbackVariant;
  }>({
    title: "",
    message: "",
    variant: "info",
  });

  const showFeedback = (
    title: string,
    message: string,
    variant: FeedbackVariant,
  ) => {
    setFeedbackConfig({
      title,
      message,
      variant,
    });

    setFeedbackVisible(true);
  };

  const showSuccess = (message: string) => {
    showFeedback("Success", message, "success");
  };

  const showError = (message: string) => {
    showFeedback("Error", message, "error");
  };

  const createImageFile = (uri: string, name: string) => {
    const extension = uri.split(".").pop() || "jpg";

    return {
      uri,
      name: `${name}.${extension}`,
      type: extension.toLowerCase() === "png" ? "image/png" : "image/jpeg",
    } as any;
  };

  const handleBusinessImageUpload = async () => {
    try {
      setIsUploadingImage(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;

        setBusinessImage({
          uri: imageUri,
        });

        setUploadProgress(100);

        console.log("[BUSINESS IMAGE SELECTED]", imageUri);
      }
    } catch (error) {
      console.log("[BUSINESS IMAGE PICKER ERROR]", error);

      showError("Failed to select business image.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleBusinessLogoUpload = async () => {
    try {
      setIsUploadingLogo(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;

        setBusinessLogo({
          uri: imageUri,
        });

        setUploadLogoProgress(100);

        console.log("[BUSINESS LOGO SELECTED]", imageUri);
      }
    } catch (error) {
      console.log("[BUSINESS LOGO PICKER ERROR]", error);

      showError("Failed to select business logo.");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSaveBusinessImages = async () => {
    if (!businessImage && !businessLogo) {
      showError("Please upload at least one image.");
      return;
    }

    try {
      const formData = new FormData();

      if (businessImage?.uri) {
        formData.append(
          "business_image",
          createImageFile(businessImage.uri, "business-image"),
        );
      }

      if (businessLogo?.uri) {
        formData.append(
          "business_logo",
          createImageFile(businessLogo.uri, "business-logo"),
        );
      }

      console.log("[BUSINESS IMAGE UPDATE] Uploading form data...");

      const response = await updateBusinessImages(formData);

      console.log("[BUSINESS IMAGE UPDATE SUCCESS]", response);

      await refreshProfile();

      showSuccess(response?.detail || "Business images updated successfully.");
    } catch (error: any) {
      console.log(
        "[BUSINESS IMAGE UPDATE FAILED]",
        error?.response?.data || error,
      );

      showError(
        error?.response?.data?.detail || "Failed to update business images.",
      );
    }
  };

  const removeBusinessImage = () => {
    setBusinessImage(null);
    setUploadProgress(0);
  };

  const removeBusinessLogo = () => {
    setBusinessLogo(null);
    setUploadLogoProgress(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Header
          title="Update Business Images"
          leftIcon={<ArrowLeft size={24} />}
          onLeftIconPress={() => router.back()}
        />

        <BusinessLogoImagePicker
          businessLogo={
            businessLogo ??
            (profile.business_logo
              ? {
                  uri: profile.business_logo,
                }
              : null)
          }
          uploadLogoProgress={uploadLogoProgress}
          handleImageUpload={handleBusinessLogoUpload}
          removeImage={removeBusinessLogo}
          isUploadingLogo={isUploadingLogo}
        />

        <BusinessImagePicker
          productImage={
            businessImage ??
            (profile.business_image
              ? {
                  uri: profile.business_image,
                }
              : null)
          }
          uploadProgress={uploadProgress}
          handleImageUpload={handleBusinessImageUpload}
          removeImage={removeBusinessImage}
          isUploading={isUploadingImage}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSaveBusinessImages}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Uploading..." : "Update"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <FeedbackModal
        visible={feedbackVisible}
        title={feedbackConfig.title}
        message={feedbackConfig.message}
        variant={feedbackConfig.variant}
        onClose={() => setFeedbackVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 55,
    backgroundColor: "#fff",
  },

  content: {
    padding: 20,
  },

  button: {
    height: 55,
    borderRadius: 12,
    backgroundColor: "#FF5920",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
