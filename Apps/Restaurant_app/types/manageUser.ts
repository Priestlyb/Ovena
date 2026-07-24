// /types/manageUser.ts

/* ================= BASE TYPES ================= */

export type TabType = "admin" | "vendor";

export interface Device {
    id: string;
    name: string;
    lastActive: string;
    branch_id?: string;
}

export interface Branch {
    id: string;
    name: string;
}

export interface AdminUser {
    id: string;
    name: string;
    role: string;
}

/* ================= COMPONENT PROPS ================= */

export interface TabsProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
}

export interface AdminSectionProps {
    router: any; // you can replace later with ExpoRouter type if needed
    users: AdminUser[];
}

export interface BranchSelectorProps {
    branches: Branch[];
    selectedBranch: string | null;
    setSelectedBranch: (id: string) => void;
    devices: Device[];
    loading: boolean;
}

export interface DeviceListProps {
    devices: Device[];
    loading: boolean;
    onSelect: (device: Device) => void;
}

export interface OTPModalProps {
  visible: boolean;
  otp: string | null;
  onClose: () => void;
  onCopy: () => void;
}

export interface RevokeModalProps {
    visible: boolean;
    device: Device | null;
    onCancel: () => void;
    onConfirm: () => void;
    loading: boolean;
}