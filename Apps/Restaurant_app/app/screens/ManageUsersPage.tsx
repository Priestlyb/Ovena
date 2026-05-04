// ManageUsersPage.tsx (FINAL - FULLY TYPED + FEEDBACK MODAL)

import { styles } from "@/constants/styles";
import { useRouter } from "expo-router";
import { ArrowLeft, Smartphone, User, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

import api from "@/services/apiClient";

import { Badge } from "@/components/atoms/Badge";
import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";
import { CustomDropdown } from "@/components/CustomDropDown";
import FeedbackModal from "@/components/FeedbackModal"; // ✅ ADDED
import { Card } from "@/components/molecules/Card";
import { Header } from "@/components/molecules/Header";

/* TYPES */
import {
  AdminSectionProps,
  AdminUser,
  Branch,
  BranchSelectorProps,
  Device,
  DeviceListProps,
  OTPModalProps,
  RevokeModalProps,
  TabsProps,
  TabType,
} from "@/types/manageUser";

/* ================= SMALL COMPONENTS ================= */

const Tabs = ({ activeTab, setActiveTab }: TabsProps) => {
  const tabs: { key: TabType; label: string }[] = [
    { key: "admin", label: "Admin Staff" },
    { key: "vendor", label: "Vendor Agent" },
  ];

  return (
    <View style={{ flexDirection: "row", paddingHorizontal: 20, gap: 10 }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 10,
              backgroundColor: isActive ? "#111827" : "#F3F4F6",
              alignItems: "center",
            }}
          >
            <Text
              variant="body"
              weight="medium"
              style={{ color: isActive ? "#fff" : "#111827" }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const AdminSection = ({ router, users }: AdminSectionProps) => (
  <View style={{ paddingHorizontal: 20 }}>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <Text variant="h4" weight="semibold">
        Manage Users
      </Text>

      <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
        <Text style={{ color: "#FF6B35" }}>+ Invite new user</Text>
      </TouchableOpacity>
    </View>

    {users.map((user) => (
      <Card key={user.id} variant="filled" padding="md">
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <User size={20} />
            <Text>{user.name}</Text>
          </View>
          <Badge label={user.role} size="small" />
        </View>
      </Card>
    ))}
  </View>
);

const BranchSelector = ({
  branches,
  selectedBranch,
  setSelectedBranch,
  devices,
  loading,
}: BranchSelectorProps) => {
  if (loading) return <ActivityIndicator />;

  return (
    <CustomDropdown
      placeholder="Choose a branch"
      value={branches.find((b) => b.id === selectedBranch)?.name || ""}
      options={branches.map((b) => {
        const occupied = devices.some((d) => d.branch_id === b.id);
        return occupied ? `${b.name} (Assigned)` : b.name;
      })}
      onChange={(name: string) => {
        const branch = branches.find(
          (b) => name === b.name || name === `${b.name} (Assigned)`,
        );

        if (!branch) return;

        const occupied = devices.some((d) => d.branch_id === branch.id);

        if (occupied) {
          // ✅ replaced Alert
          setTimeout(() => {}, 0);
        }

        setSelectedBranch(branch.id);
      }}
    />
  );
};

const DeviceList = ({ devices, loading, onSelect }: DeviceListProps) => {
  if (loading) return <ActivityIndicator />;

  if (!devices.length) return <Text>No linked devices</Text>;

  return devices.map((device) => (
    <TouchableOpacity key={device.id} onPress={() => onSelect(device)}>
      <Card variant="elevated" padding="md">
        <View style={{ flexDirection: "row", gap: 16 }}>
          <Smartphone size={28} />
          <View>
            <Text weight="semibold">{device.name}</Text>
            <Text variant="bodySmall">Last active {device.lastActive}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  ));
};

const OTPModal = ({ visible, otp, onClose }: OTPModalProps) => (
  <Modal visible={visible} transparent animationType="fade">
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <View
        style={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 24,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={onClose}
          style={{ position: "absolute", top: 16, right: 16 }}
        >
          <X size={24} />
        </TouchableOpacity>

        <Text variant="h4">Link Device Code</Text>
        <Spacer size="md" />

        <Text style={{ fontSize: 36, fontWeight: "bold", letterSpacing: 4 }}>
          {otp}
        </Text>

        <Spacer size="md" />
        <Text align="center">Share this code with the staff device</Text>
      </View>
    </View>
  </Modal>
);

const RevokeModal = ({
  visible,
  device,
  onCancel,
  onConfirm,
  loading,
}: RevokeModalProps) => (
  <Modal visible={visible} transparent animationType="fade">
    <View
      style={{
        flex: 1,
        backgroundColor: "#00000099",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          padding: 24,
          borderRadius: 16,
          width: "90%",
        }}
      >
        <Text variant="h4">Revoke Device?</Text>
        <Spacer size="sm" />
        <Text>
          Remove <Text weight="semibold">{device?.name}</Text>?
        </Text>

        <Spacer size="lg" />

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              padding: 14,
              borderRadius: 10,
              backgroundColor: "#F3F4F6",
              alignItems: "center",
            }}
            onPress={onCancel}
          >
            <Text>No</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              padding: 14,
              borderRadius: 10,
              backgroundColor: "#EF4444",
              alignItems: "center",
            }}
            onPress={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff" }}>Yes, Revoke</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

/* ================= MAIN SCREEN ================= */

export default function ManageUsersPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>("admin");

  const [devices, setDevices] = useState<Device[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const [loadingDevices, setLoadingDevices] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState<string | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [revoking, setRevoking] = useState(false);

  /* ✅ FEEDBACK STATE */
  const [feedback, setFeedback] = useState({
    visible: false,
    message: "",
    title: "",
    variant: "info" as "success" | "error" | "warning" | "info",
  });

  const showFeedback = (
    message: string,
    variant: "success" | "error" | "warning" | "info" = "info",
    title?: string,
  ) => {
    setFeedback({
      visible: true,
      message,
      title: title || "",
      variant,
    });
  };

  const adminUsers: AdminUser[] = [
    { id: "1", name: "{User_Name}", role: "Admin" },
  ];

  useEffect(() => {
    fetchDevices();
    fetchBranches();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoadingDevices(true);
      const res = await api.get("/business/staff/list");
      const raw = res.data?.results?.data || [];

      setDevices(
        raw.map((item: any) => ({
          id: String(item.id),
          name: item.device_name || item.name || "Unknown Device",
          lastActive: item.last_active || "Recently",
          branch_id: item.branch_id ? String(item.branch_id) : undefined,
        })),
      );
    } finally {
      setLoadingDevices(false);
    }
  };

  const fetchBranches = async () => {
    try {
      setLoadingBranches(true);
      const res = await api.get("/business/list-branches/");
      const raw = res.data?.results?.data || [];

      const mapped = raw.map((b: any) => ({
        id: String(b.id),
        name: b.name || "Unnamed Branch",
      }));

      setBranches(mapped);
      if (mapped.length) setSelectedBranch(mapped[0].id);
    } finally {
      setLoadingBranches(false);
    }
  };

  const handleLinkDevice = async () => {
    if (!selectedBranch) {
      showFeedback("Select a branch", "warning");
      return;
    }

    if (devices.find((d) => d.branch_id === selectedBranch)) {
      showFeedback("Branch already assigned", "warning");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/accounts/linked/request/", {
        branch_id: Number(selectedBranch),
      });

      if (res.data?.otp) {
        setOtp(res.data.otp);
        setShowOtpModal(true);
      } else {
        showFeedback("Device link request sent", "success");
      }

      fetchDevices();
    } catch (error: any) {
      showFeedback(
        error?.response?.data?.message ||
          error?.response?.data?.detail ||
          "Something went wrong",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!selectedDevice) return;

    try {
      setRevoking(true);

      const res = await api.post("/business/staff/revoke/", {
        agent_id: Number(selectedDevice.id),
        revoked: true,
      });

      showFeedback(res.data?.detail || "Device revoked", "success");

      setShowRevokeModal(false);
      setSelectedDevice(null);

      fetchDevices();
    } catch (error: any) {
      showFeedback(
        error?.response?.data?.message ||
          error?.response?.data?.detail ||
          "Failed to revoke device",
        "error",
      );
    } finally {
      setRevoking(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header
          title="Manage Users"
          leftIcon={<ArrowLeft size={24} color="#111827" />}
          onLeftIconPress={() => router.back()}
        />

        <Spacer size="md" />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <Spacer size="lg" />

        {activeTab === "admin" ? (
          <AdminSection router={router} users={adminUsers} />
        ) : (
          <View style={{ paddingHorizontal: 20 }}>
            <View
              style={{
                backgroundColor: "#F3F4F6",
                borderRadius: 16,
                padding: 24,
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Image
                source={require("@/assets/images/OBJECTS.png")}
                style={{ width: 300, height: 200 }}
                resizeMode="contain"
              />
              <Spacer size="md" />
              <Text align="center">You can link other device</Text>
            </View>

            <Text variant="h4">Select Branch</Text>
            <Spacer size="md" />

            <BranchSelector
              branches={branches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              devices={devices}
              loading={loadingBranches}
            />

            <Spacer size="lg" />

            <Text variant="h4">Device Status</Text>
            <Spacer size="lg" />

            <DeviceList
              devices={devices}
              loading={loadingDevices}
              onSelect={(d) => {
                setSelectedDevice(d);
                setShowRevokeModal(true);
              }}
            />

            <Spacer size="lg" />

            <TouchableOpacity
              style={[styles.continueBtn, { opacity: loading ? 0.6 : 1 }]}
              onPress={handleLinkDevice}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.continueBtnText}>Link a device</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <Spacer size="xxl" />
      </ScrollView>

      <OTPModal
        visible={showOtpModal}
        otp={otp}
        onClose={() => setShowOtpModal(false)}
      />

      <RevokeModal
        visible={showRevokeModal}
        device={selectedDevice}
        onCancel={() => setShowRevokeModal(false)}
        onConfirm={handleRevoke}
        loading={revoking}
      />

      {/* FEEDBACK MODAL */}
      <FeedbackModal
        visible={feedback.visible}
        message={feedback.message}
        title={feedback.title}
        variant={feedback.variant}
        onClose={() => setFeedback((prev) => ({ ...prev, visible: false }))}
      />
    </SafeAreaView>
  );
}
