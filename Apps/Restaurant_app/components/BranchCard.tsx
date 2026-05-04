// BranchCard.tsx → now using CustomDropdown
import React from "react";
import { View } from "react-native";

import { Text } from "@/components/atoms/Text";
import { Spacer } from "@/components/atoms/Spacer";
import { storeHubStyles } from "@/constants/store-hub-styles";
import { InfoTooltip } from "@/components/InfoTooltip";
import { CustomDropdown } from "@/components/CustomDropDown";

/* =========================================================
   TYPES
========================================================= */
export interface Branch {
  id: number;
  name: string;
  address: string;
  created_at: string;
}

/* =========================================================
   COMPONENT
========================================================= */
interface BranchCardProps {
  branch: Branch;
  allBranches: Branch[];
  onBranchChange: (branch: Branch) => void;
}

export const BranchCard: React.FC<BranchCardProps> = ({
  branch,
  allBranches,
  onBranchChange,
}) => {
  return (
    <View style={storeHubStyles.inputContainer}>
      {/* Header */}
      <View style={storeHubStyles.labelRow}>
        <Text variant="body" weight="semibold">
          Branch Information
        </Text>
        <InfoTooltip />
      </View>

      <Spacer size="xs" />

      {/* Info */}
      <View style={storeHubStyles.infoBox}>
        <Text variant="bodySmall" color="secondary">
          This is your currently registered business branch
        </Text>
      </View>

      <Spacer size="md" />

      {/* Card */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: "#E5E7EB",
        }}
      >
        {/* Branch Name Dropdown */}
        <CustomDropdown
          label="Branch Name"
          options={allBranches.map((b) => b.name)}
          value={branch.name}
          placeholder="Select a branch"
          onChange={(name) => {
            const selected = allBranches.find((b) => b.name === name);
            if (selected) onBranchChange(selected);
          }}
          required
        />

        <Spacer size="sm" />

        {/* Address Dropdown (read-only) */}
        <CustomDropdown
          label="Address"
          options={branch ? [branch.address] : []}
          value={branch.address}
          placeholder="Branch address"
          onChange={() => {}}
        />

        <Spacer size="sm" />

        {/* ID */}
        <Text variant="label" color="secondary">
          Branch ID
        </Text>
        <Text variant="body">#{branch.id}</Text>

        <Spacer size="sm" />

        {/* Created */}
        <Text variant="label" color="secondary">
          Created At
        </Text>
        <Text variant="body">
          {new Date(branch.created_at).toLocaleString()}
        </Text>
      </View>
    </View>
  );
};
