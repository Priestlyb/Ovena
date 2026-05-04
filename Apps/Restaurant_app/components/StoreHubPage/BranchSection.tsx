import { CustomDropdown } from "@/components/CustomDropDown";
import { CustomInput } from "@/components/CustomInput";
import { Spacer } from "@/components/atoms/Spacer";
import { Branch } from "@/types/storeHub";
import React from "react";

type Props = {
  branches: Branch[];
  selectedBranch: Branch | null;
  setSelectedBranch: React.Dispatch<React.SetStateAction<Branch | null>>;
};

export const BranchSection: React.FC<Props> = ({
  branches,
  selectedBranch,
  setSelectedBranch,
}) => {
  return (
    <>
      <CustomDropdown
        placeholder="Select Branch"
        label="Select Branch"
        options={branches.map((b) => b.name)}
        value={selectedBranch?.name || ""}
        onChange={(name) => {
          const branch = branches.find((b) => b.name === name);
          if (branch) setSelectedBranch(branch);
        }}
      />

      <Spacer size="sm" />

      <CustomInput
        placeholder="Enter a Branch name"
        label="Branch Name"
        value={selectedBranch?.name || ""}
        onChange={(text) =>
          setSelectedBranch((prev) => (prev ? { ...prev, name: text } : prev))
        }
      />

      <Spacer size="sm" />

      <CustomInput
        placeholder="Enter the branch address"
        label="Branch Address"
        value={selectedBranch?.address || ""}
        onChange={(text) =>
          setSelectedBranch((prev) =>
            prev ? { ...prev, address: text } : prev,
          )
        }
      />
    </>
  );
};
