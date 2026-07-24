import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { styles } from "@/constants/styles";
import { useStoreDetails } from "@/hooks/storeDetails/useStoreDetails";
import { useUpdateStoreDetails } from "@/hooks/storeDetails/useUpdateStoreDetails";

import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";
import { CustomInput } from "@/components/CustomInput";
import FeedbackModal from "@/components/FeedbackModal";
import { Header } from "@/components/molecules/Header";

type ImageType = {
  uri: string;
  uploadedUrl?: string;
};

const StoreDetailsPage: React.FC = () => {
  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [businessLogo, setBusinessLogo] = useState<ImageType | null>(null);
  const [businessImage, setBusinessImage] = useState<ImageType | null>(null);

  const [logoProgress, setLogoProgress] = useState(0);
  const [imageProgress, setImageProgress] = useState(0);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");

  const [feedback, setFeedback] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as "success" | "error" | "info",
  });

  const showFeedback = (
    message: string,
    variant: "success" | "error" | "info",
    title?: string,
  ) => {
    setFeedback({
      visible: true,
      message,
      variant,
      title: title || "",
    });
  };

  const { data, loading, error, refetch } = useStoreDetails();
  const { mutateAsync, isPending: updating } = useUpdateStoreDetails();

  const isReady = !!data && !loading;

  useEffect(() => {
    if (!data) return;

    setShopName(data.business_name || "");
    setDescription(data.business_type || "");
    setEmail(data.email || "");
    setPhone(data.phone_number || "");
    setAddress(data.business_address || "");

    if (data.business_logo) {
      setBusinessLogo({
        uri: data.business_logo,
        uploadedUrl: data.business_logo,
      });
    }

    if (data.business_image) {
      setBusinessImage({
        uri: data.business_image,
        uploadedUrl: data.business_image,
      });
    }
  }, [data]);

  const pickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setBusinessLogo({
        uri: result.assets[0].uri,
      });
      setLogoProgress(100);
    }
  };

  const pickBusinessImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setBusinessImage({
        uri: result.assets[0].uri,
      });
      setImageProgress(100);
    }
  };

  const handleSave = () => {
    setPassword("");
    setShowPasswordModal(true);
  };

  const handleConfirmSave = async () => {
    if (!password.trim()) {
      setShowPasswordModal(false);
      setPassword("");

      showFeedback(
        "Please enter your password to continue.",
        "error",
        "Password Required",
      );

      return;
    }

    try {
      await mutateAsync({
        business_name: shopName.trim(),
        business_type: description.trim(),
        email: email.trim(),
        phone_number: phone.trim(),
        business_address: address.trim(),
        password,

        business_logo: businessLogo
          ? {
              uri: businessLogo.uri,
              name: "logo.jpg",
              type: "image/jpeg",
            }
          : null,

        business_image: businessImage
          ? {
              uri: businessImage.uri,
              name: "business.jpg",
              type: "image/jpeg",
            }
          : null,
      });

      setShowPasswordModal(false);
      setPassword("");

      showFeedback("Store details updated successfully.", "success", "Success");

      await refetch();
    } catch (err: any) {
      setPassword("");

      const apiError =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update store details.";

      showFeedback(apiError, "error", "Update Failed");
    }
  };

  if (loading && !data) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#F84E10" />
        </View>
      </SafeAreaView>
    );
  }

  if (error && !data) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text variant="caption" color="error">
            Failed to load store details
          </Text>

          <Spacer size="md" />

          <TouchableOpacity onPress={refetch}>
            <Text style={{ color: "#F84E10" }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Header
            title="Store Details"
            leftIcon={<ArrowLeft size={24} color="#111827" />}
            onLeftIconPress={() => router.back()}
          />

          <Spacer size="lg" />

          {isReady && (
            <>
              <CustomInput
                label="Shop name"
                placeholder="Enter your shop name"
                value={shopName}
                onChange={setShopName}
              />

              {/* <Spacer size="md" />

              <CustomInput
                label="Business Type"
                placeholder="e.g. Restaurant, Grocery, Fashion"
                value={description}
                onChange={setDescription}
              />
              */}

              <Spacer size="md" />

              <CustomInput
                label="Email"
                placeholder="Enter official business email"
                value={email}
                onChange={setEmail}
              />

              <Spacer size="md" />

              <CustomInput
                label="Phone"
                placeholder="Enter phone number"
                value={phone}
                onChange={setPhone}
              />

              <Spacer size="md" />

              <CustomInput
                label="Address"
                placeholder="Enter business address"
                value={address}
                onChange={setAddress}
              />

              <Spacer size="xxl" />

              <TouchableOpacity
                style={[styles.continueBtn, updating && { opacity: 0.7 }]}
                disabled={updating}
                onPress={handleSave}
              >
                {updating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.continueBtnText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </ScrollView>

        {/* PASSWORD MODAL */}
        <Modal visible={showPasswordModal} transparent animationType="fade">
          <TouchableWithoutFeedback onPress={() => setShowPasswordModal(false)}>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                padding: 24,
              }}
            >
              <TouchableWithoutFeedback>
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 16,
                    padding: 20,
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: "600" }}>
                    Confirm Changes
                  </Text>

                  <Spacer size="md" />

                  <CustomInput
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={setPassword}
                    type="password"
                  />

                  <Spacer size="lg" />

                  <TouchableOpacity
                    style={[styles.continueBtn, updating && { opacity: 0.7 }]}
                    onPress={handleConfirmSave}
                  >
                    <Text style={styles.continueBtnText}>Confirm Update</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <FeedbackModal
          visible={feedback.visible}
          title={feedback.title}
          message={feedback.message}
          variant={feedback.variant}
          onClose={() => setFeedback((p) => ({ ...p, visible: false }))}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default StoreDetailsPage;
