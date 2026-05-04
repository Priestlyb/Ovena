import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Easing,
  ToastAndroid,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router/build/exports";
import { useAuth } from "@/context/AuthContext";

const BASE_URL = "https://ovena-backend-production.up.railway.app/api";

export default function AccountScreen() {
  const { accessToken } = useAuth();

  const [username, setUsername] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // 🔥 Animation
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const underlineAnim = useRef(new Animated.Value(0)).current;

  const animateFocus = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.03,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(underlineAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const animateBlur = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(underlineAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // 🔹 Toast helper
  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      console.log(message);
    }
  };

  // 🔹 Fetch Profile
  const fetchProfile = async () => {
    if (!accessToken) return;

    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/accounts/profile/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        const name = data?.user?.name || "";
        const emailFetched = data?.user?.email || "";

        setUsername(name);
        setOriginalUsername(name);
        setEmail(emailFetched);
      } else {
        showToast("Failed to fetch profile");
      }
    } catch (error) {
      showToast("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [accessToken]);

  const handleCancelEdit = () => {
    setUsername(originalUsername);
    setEditing(false);
    animateBlur();
    Keyboard.dismiss();
  };

  const handleUpdateUsername = async () => {
    if (!accessToken) return;

    try {
      setUpdating(true);

      const response = await fetch(
        `${BASE_URL}/accounts/customer/update/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: username }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.log("Update error:", text);
        showToast("Update failed");
        return;
      }

      setOriginalUsername(username);
      setEditing(false);
      animateBlur();
      Keyboard.dismiss();

      showToast("Username updated ✅");
    } catch (error) {
      console.log(error);
      showToast("Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleCancelEdit}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/profile")}
            style={styles.backButton}
          >
            <IconSymbol name="ArrowLeftIcon" size={22} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Account</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Username */}
        <View style={styles.row}>
          <IconSymbol name="UserIcon" size={20} color="#000" />

          {loading ? (
            <Animated.View style={styles.blurPlaceholder} />
          ) : editing ? (
            <Animated.View
              style={{
                flex: 1,
                transform: [{ scale: scaleAnim }],
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  style={styles.input}
                  autoFocus
                  onFocus={animateFocus}
                  onBlur={animateBlur}
                />
                <TouchableOpacity
                  onPress={handleUpdateUsername}
                  disabled={updating}
                >
                  {updating ? (
                    <Animated.View
                      style={[styles.blurPlaceholder, { width: 22, height: 22 }]}
                    />
                  ) : (
                    <IconSymbol name="CheckIcon" size={22} color="green" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCancelEdit}>
                  <IconSymbol name="CloseIcon" size={22} color="red" />
                </TouchableOpacity>
              </View>
              <Animated.View
                style={{
                  height: 2,
                  backgroundColor: "black",
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

        {/* Email */}
        <View style={styles.row}>
          <IconSymbol name="EmailIcon" size={20} color="#000" />
          {loading ? (
            <Animated.View style={styles.blurPlaceholder} />
          ) : (
            <Text style={styles.rowText}>{email || "No email set"}</Text>
          )}
        </View>

        {/* Change Phone */}
        <TouchableOpacity
          onPress={() =>
            router.replace("/(auth)/screens/ChangePhoneNumber")
          }
        >
          <View style={styles.row}>
            <IconSymbol name="LockClosedOutline" size={20} color="#000" />
            <Text style={styles.rowText}>Change Phone Number</Text>
          </View>
        </TouchableOpacity>

        {/* Payment */}
        <TouchableOpacity
          onPress={() =>
            router.replace("/(auth)/screens/PaymentMethodScreen")
          }
        >
          <View style={styles.row}>
            <IconSymbol name="CreditCardIcon" size={20} color="#000" />
            <Text style={styles.rowText}>Payment Method</Text>
          </View>
        </TouchableOpacity>

        {/* Privacy */}
        <TouchableOpacity
          onPress={() =>
            router.replace("/(auth)/screens/ManagePrivacy")
          }
        >
          <View style={styles.row}>
            <IconSymbol
              name="PrivateConnectivityIcon"
              size={20}
              color="#000"
            />
            <Text style={styles.rowText}>Manage Privacy</Text>
          </View>
        </TouchableOpacity>

        {/* Delete */}
        <View style={styles.row}>
          <IconSymbol name="TrashOutline" size={20} color="#000" />
          <Text style={styles.rowText}>Delete my account</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 55,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSpacer: {
    width: 34,
  },
  row: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowText: {
    fontSize: 18,
  },
  usernameWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    fontSize: 18,
    flex: 1,
    paddingVertical: 4,
    marginRight: 10,
  },
  blurPlaceholder: {
    flex: 1,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#ccc",
    opacity: 0.3,
  },
});