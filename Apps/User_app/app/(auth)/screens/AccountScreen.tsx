import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  ActivityIndicator,
} from "react-native";

import React, { useEffect, useState } from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";

import { createStyles } from "@/constants/styles/account.styles";
import { useTheme } from "@/constants/theme";

import { useAccountAnimations } from "@/services/Account/account.animations";
import FeedbackModal from "@/components/FeedbackModal";

import { useProfile } from "@/hooks/account/useProfile";
import { useUpdateUsername } from "@/hooks/account/useUpdateUsername";
import { DeleteAccountButton } from "@/components/homepage/DeleteAccountButton";

export default function AccountScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { data, isLoading: loading } = useProfile();
  const updateUsernameMutation = useUpdateUsername();

  const [username, setUsername] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalVariant, setModalVariant] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

  const updating = updateUsernameMutation.isPending;
  const hasChanges = username.trim() !== originalUsername.trim();

  const profile = data?.profile;
  const user = data?.user;

  // Animations
  const { scaleAnim, underlineAnim, animateFocus, animateBlur } =
    useAccountAnimations();

  const showToast = (
    message: string,
    variant: "success" | "error" | "warning" | "info" = "info",
  ) => {
    setModalMessage(message);
    setModalVariant(variant);
    setModalVisible(true);
  };

  // Sync local state with React Query
  useEffect(() => {
    if (!editing) {
      const name = profile?.name ?? "";
      const emailAddress = user?.email ?? "";

      setUsername(name);
      setOriginalUsername(name);
      setEmail(emailAddress);
    }
  }, [profile, user, editing]);

  const handleCancelEdit = () => {
    setUsername(originalUsername);
    setEditing(false);
    animateBlur();
    Keyboard.dismiss();
  };

  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      showToast("Username cannot be empty", "warning");
      return;
    }

    if (!hasChanges) {
      setEditing(false);
      animateBlur();
      Keyboard.dismiss();
      return;
    }

    try {
      await updateUsernameMutation.mutateAsync(username.trim());

      setOriginalUsername(username.trim());
      setEditing(false);

      animateBlur();
      Keyboard.dismiss();

      showToast("Username updated successfully", "success");
    } catch (error) {
      console.log(error);
      showToast("Update failed", "error");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleCancelEdit}>
      <View style={styles.container}>
        <FeedbackModal
          visible={modalVisible}
          message={modalMessage}
          variant={modalVariant}
          onClose={() => setModalVisible(false)}
        />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/profile")}
            style={styles.backButton}
          >
            <IconSymbol
              name="ArrowLeftIcon"
              size={22}
              color={theme.textPrimary}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Account</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.accountContainer}>
          {/* Username */}
          <View style={styles.row}>
            <IconSymbol name="UserIcon" size={20} color={theme.textPrimary} />

            {loading ? (
              <Animated.View style={styles.blurPlaceholder} />
            ) : editing ? (
              <Animated.View
                style={{
                  flex: 1,
                  transform: [{ scale: scaleAnim }],
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                    autoFocus
                    onFocus={animateFocus}
                    onBlur={animateBlur}
                  />

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.confirmButton]}
                      onPress={handleUpdateUsername}
                      disabled={updating || !hasChanges}
                    >
                      {updating ? (
                        <ActivityIndicator
                          size="small"
                          color={theme.background}
                        />
                      ) : (
                        <IconSymbol
                          name="CheckIcon"
                          size={20}
                          color={theme.background}
                        />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.cancelButton]}
                      onPress={handleCancelEdit}
                    >
                      <IconSymbol
                        name="CloseIcon"
                        size={20}
                        color={theme.background}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <Animated.View
                  style={{
                    height: 2,
                    backgroundColor: theme.primary,
                    width: underlineAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  }}
                />
              </Animated.View>
            ) : (
              <TouchableOpacity
                style={styles.usernameWrapper}
                onPress={() => setEditing(true)}
              >
                <Text style={styles.rowText}>
                  {username || "Tap to set name"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.row}>
            <IconSymbol name="EmailIcon" size={20} color={theme.textPrimary} />

            {loading ? (
              <Animated.View style={styles.blurPlaceholder} />
            ) : (
              <Text style={styles.rowText}>{email || "No email set"}</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/screens/PaymentDetailsScreen")}
          >
            <View style={styles.row}>
              <IconSymbol
                name="CreditCardIcon"
                size={20}
                color={theme.textPrimary}
              />
              <Text style={styles.rowText}>Payment Method</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/screens/ChangePhoneNumber")}
          >
            <View style={styles.row}>
              <IconSymbol
                name="LockClosedOutline"
                size={20}
                color={theme.textPrimary}
              />
              <Text style={styles.rowText}>Change Phone Number</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/screens/ManagePrivacy")}
          >
            <View style={styles.row}>
              <IconSymbol
                name="PrivateConnectivityIcon"
                size={20}
                color={theme.textPrimary}
              />
              <Text style={styles.rowText}>Manage Privacy</Text>
            </View>
          </TouchableOpacity>

          {/* Delete Account Button 
        <View style={styles.row}>
          <IconSymbol name="TrashOutline" size={20} color="#000" />
          <DeleteAccountButton />
        </View>
        */}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
