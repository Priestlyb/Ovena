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
    console.log("🗑️ ===============================");
    console.log("🗑️ DELETE ACCOUNT STARTED");
    console.log("🗑️ ===============================");

    if (!accessToken) {
      console.error("❌ No access token found");
      setError("You are not authenticated.");
      return;
    }

    console.log("🔑 Access token exists:", !!accessToken);
    console.log(
      "🔑 Token Preview:",
      `${accessToken.slice(0, 20)}...${accessToken.slice(-10)}`,
    );

    setError("");
    setDeleting(true);

    try {
      const url =
        "https://ovena-backend-production.up.railway.app/api/accounts/profile/delete/";

      console.log("📡 Sending DELETE request");
      console.log("🌍 URL:", url);

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("📥 Response received");
      console.log("📊 Status:", response.status);
      console.log("📊 OK:", response.ok);
      console.log("📊 Status Text:", response.statusText);

      try {
        console.log(
          "📊 Headers:",
          Object.fromEntries(response.headers.entries()),
        );
      } catch (headerError) {
        console.log("⚠️ Unable to read response headers");
      }

      const responseText = await response.text();

      console.log("📄 Raw Response Length:", responseText.length);

      console.log(
        "📄 Response Preview (first 2000 chars):\n",
        responseText.substring(0, 2000),
      );

      // Detect Django HTML debug pages
      if (
        responseText.includes("<!DOCTYPE html>") ||
        responseText.includes("<html") ||
        responseText.includes("DEBUG = True") ||
        responseText.includes("Django")
      ) {
        console.error("🚨 SERVER RETURNED HTML INSTEAD OF JSON");
        console.error("🚨 THIS IS A BACKEND ERROR");
      }

      let data: any = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};

        console.log("✅ Parsed JSON Response:");
        console.log(JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.error("❌ JSON Parse Error:", parseError);

        data = {
          message: responseText || response.statusText,
        };
      }

      if (response.ok) {
        console.log("✅ Account deleted successfully");
        console.log("📄 Success Payload:", data);

        await logout();

        if (onSuccess) {
          console.log("🚀 Running onSuccess callback");
          onSuccess();
        }
      } else {
        console.error("❌ DELETE REQUEST FAILED");
        console.error("❌ Status:", response.status);
        console.error("❌ Response Data:", data);

        if (response.status === 401) {
          console.warn("⚠️ Unauthorized");
          console.warn("⚠️ Logging user out");

          await logout();

          router.replace("/login");
          return;
        }

        let errorMessage =
          data?.message ||
          data?.detail ||
          data?.error ||
          `Server Error (${response.status})`;

        // Special handling for Django debug pages
        if (
          typeof data?.message === "string" &&
          data.message.includes("DEBUG = True")
        ) {
          errorMessage =
            "Backend server error. Check Railway logs for the delete account endpoint.";
        }

        setError(errorMessage);

        console.error("❌ Displayed Error:", errorMessage);
      }
    } catch (err: any) {
      console.error("🚨 NETWORK ERROR");
      console.error("🚨 Name:", err?.name);
      console.error("🚨 Message:", err?.message);
      console.error("🚨 Stack:", err?.stack);
      console.error("🚨 Full Error:", err);

      setError(
        err?.message || "An error occurred while deleting your account.",
      );
    } finally {
      console.log("🏁 DELETE ACCOUNT FINISHED");
      console.log("🏁 ===============================");

      setDeleting(false);
    }
  };

  return (
    <View>
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

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  deleteBtn: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    color: "#CD3131",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "#ff4d4f",
    marginTop: 8,
    textAlign: "center",
  },
});
