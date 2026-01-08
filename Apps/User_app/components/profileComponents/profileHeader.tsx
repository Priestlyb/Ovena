import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "@/context/AuthContext"; // adjust path if needed

const BASE_URL =
  "https://ovena-backend-production.up.railway.app/api";

/* =========================
   TYPES
========================= */
interface ProfileData {
  name: string;
  title: string;
  points: number;
}

/* =========================
   COMPONENT
========================= */
const ProfileHeader: React.FC = () => {
  const { getValidAccessToken, logout } = useAuth();

  const [profile, setProfile] = useState<ProfileData>({
    name: "Ovena User",
    title: "Member",
    points: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        const token = await getValidAccessToken();

        if (!token || token === "guest") {
          throw new Error("Unauthenticated");
        }

        const res = await fetch(`${BASE_URL}/accounts/profile/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          await logout();
          return;
        }

        if (!res.ok) {
          throw new Error("Profile fetch failed");
        }

        const data = await res.json();

        // 🔒 GUARANTEED STRING
        const name =
          typeof data?.name === "string" && data.name.trim()
            ? data.name
            : typeof data?.user?.name === "string"
            ? data.user.name
            : typeof data?.profile?.name === "string"
            ? data.profile.name
            : "User";

        const updatedProfile: ProfileData = {
          name,
          title:
            typeof data?.title === "string"
              ? data.title
              : "Member",
          points:
            Number(data?.points ?? 0),
        };

        if (mounted) {
          setProfile(updatedProfile);
        }
      } catch (err) {
        console.warn("Profile error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, [getValidAccessToken, logout]);

  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#D9502E" />
      </View>
    );
  }

  /* =========================
     UI
  ========================= */
  return (
    <View style={styles.profileHeader}>
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      <View style={styles.profileContent}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile.name[0].toUpperCase()}
          </Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {profile.name}
          </Text>
          <Text style={styles.profileTitle}>
            {profile.title}
          </Text>
        </View>

        <View style={styles.pointsSection}>
          <Text style={styles.pointsValue}>
            {profile.points}
          </Text>
          <Text style={styles.pointsLabel}>Pts</Text>
        </View>
      </View>
    </View>
  );
};

/* =========================
   STYLES
========================= */
const styles = StyleSheet.create({
  loader: {
    paddingVertical: 40,
    alignItems: "center",
  },
  profileHeader: {
    backgroundColor: '#f6d44fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    paddingTop: 80,
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
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#D9502E",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  profileTitle: {
    fontSize: 14,
    color: "#555",
  },
  pointsSection: {
    alignItems: "flex-end",
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  pointsLabel: {
    fontSize: 12,
    color: "#555",
  },
});

export default ProfileHeader;
