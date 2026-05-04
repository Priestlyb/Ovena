import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";

const BASE_URL = "https://ovena-backend-production.up.railway.app/api";

interface ProfileData {
  name: string;
  email: string;
  points: number;
}

const ProfileHeader: React.FC = () => {
  const { accessToken, logout } = useAuth();

  const [profile, setProfile] = useState<ProfileData>({
    name: "Ovena User",
    email: "Member",
    points: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<any>(null);

  const fetchProfile = async () => {
    if (!accessToken) {
      console.warn("No access token available");
      setError("No access token");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching profile with token:", accessToken);

      const res = await fetch(`${BASE_URL}/accounts/profile/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Profile response status:", res.status);

      if (!res.ok) {
        const text = await res.text();
        console.warn("Profile fetch failed", res.status, text);
        setError(`Server returned ${res.status}`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("Profile data fetched:", data);

      setRawData(data);

      setProfile({
        name: data?.user?.name || "User",
        email: data?.user?.phone_number || "Member",
        points: Number(data?.profile?.points ?? 0),
      });
    } catch (err) {
      console.warn("Profile fetch error:", err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) fetchProfile();

    return () => {
      mounted = false;
    };
  }, [accessToken]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#D9502E" />
        <Text style={{ marginTop: 8 }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.profileHeader}>
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />
        <TouchableOpacity
          onPress={() => {
            router.replace("/(auth)/screens/HelpScreen");
          }}
          style={{ position: "absolute", top: 60, right: 16 }}
        >
          <Text
            style={{
              backgroundColor: "#D9502E",
              color: "#fff",
              fontSize: 16,
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderRadius: 20,
              width: 80,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Help
          </Text>
        </TouchableOpacity>

        <View style={styles.profileContent}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.name?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileTitle}>{profile.email}</Text>
          </View>

          <View style={styles.pointsSection}>
            <Text style={styles.pointsValue}>{profile.points}</Text>
            <Text style={styles.pointsLabel}>Pts</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loader: { paddingVertical: 40, alignItems: "center" },
  profileHeader: {
    height: 250,
    backgroundColor: "#f6d44fff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    position: "relative",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    paddingTop: 110,
    flexGrow: 20,
  },
  decorCircle1: {
    position: "absolute",
    top: -64,
    right: -64,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  decorCircle2: {
    position: "absolute",
    bottom: -48,
    left: -48,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  profileContent: { flexDirection: "row", alignItems: "center", gap: 16 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#D9502E",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 28, fontWeight: "bold" },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: "bold", color: "#333" },
  profileTitle: { fontSize: 14, color: "#555" },
  pointsSection: { alignItems: "flex-end" },
  pointsValue: { fontSize: 28, fontWeight: "bold", color: "#333" },
  pointsLabel: { fontSize: 12, color: "#555" },
});

export default ProfileHeader;
