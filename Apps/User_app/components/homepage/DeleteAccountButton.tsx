import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
} from "react-native";
import { useAuth } from "@/context/AuthContext"; 
import { router } from "expo-router";

export const DeleteAccountButton = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const { accessToken, logout } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteUser = async () => {
    if (!accessToken) {
      setError("You are not authenticated.");
      return;
    }

    setError("");
    setDeleting(true);

    try {
      const response = await fetch(
        "https://ovena-backend-production.up.railway.app/api/accounts/profile/delete/",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = { message: response.statusText || "Unexpected server response" };
      }

    if (response.ok) {
      console.log("Account deleted");

      await logout();

      if (onSuccess) onSuccess();
    } else {
      if (response.status === 401) {
        await logout();
        router.replace("/login");
      }

      setError(data.message || "Failed to delete account.");
    }
  } catch (err) {
    console.error("Error deleting account:", err);
    setError("An error occurred while deleting your account.");
  } finally {
    setDeleting(false);
  }
};

return (
    <View style={{ alignItems: "center", width: "100%" }}>
      <TouchableOpacity
        style={[styles.deleteBtn, deleting && { opacity: 0.6 }]}
        onPress={handleDeleteUser}
        disabled={deleting}
      >
        {deleting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.deleteText}>Delete Account</Text>
        )}
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  deleteBtn: {
    backgroundColor: "#CD3131",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "#ff4d4f",
    marginTop: 8,
    textAlign: "center",
  },
});
