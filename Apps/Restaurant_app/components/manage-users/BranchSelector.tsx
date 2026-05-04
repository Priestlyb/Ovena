import React from "react";
import { ActivityIndicator, Alert } from "react-native";

import { CustomDropdown } from "@/components/CustomDropDown";
import { BranchSelectorProps } from "@/types/manageUser";

export const BranchSelector = ({
  branches,
  selectedBranch,
  setSelectedBranch,
  devices,
  loading,
}: BranchSelectorProps) => {
  if (loading) return <ActivityIndicator size="large" color="#F65513" />;

  return (
    <CustomDropdown
      placeholder="Choose a branch"
      value={branches.find((b) => b.id === selectedBranch)?.name || ""}
      options={branches.map((b) => {
        const isOccupied = devices.some((d) => d.branch_id === b.id);
        return isOccupied ? `${b.name} (Assigned)` : b.name;
      })}
      onChange={(selectedName: string) => {
        const branch = branches.find(
          (b) =>
            selectedName === b.name || selectedName === `${b.name} (Assigned)`,
        );

        if (!branch) return;

        const isOccupied = devices.some((d) => d.branch_id === branch.id);

        if (isOccupied) {
          Alert.alert(
            "Unavailable",
            "This branch already has a staff assigned.",
          );
          return;
        }

        setSelectedBranch(branch.id);
      }}
    />
  );
};
