import { useState } from "react";

export type VariantOption = {
  name: string;
  price_diff: string;
};

export type VariantGroup = {
  name: string;
  is_required: boolean;
  options: VariantOption[];
};

/* =========================================
   HOOK
========================================= */
export const useVariants = () => {
  const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([]);

  /* =========================================
     ADD GROUP
  ========================================= */
  const addVariantGroup = () => {
    setVariantGroups((prev) => [
      ...prev,
      {
        name: "",
        is_required: false,
        options: [],
      },
    ]);
  };

  /* =========================================
     ADD OPTION
  ========================================= */
  const addVariantOption = (groupIndex: number) => {
    setVariantGroups((prev) =>
      prev.map((group, idx) =>
        idx === groupIndex
          ? {
            ...group,
            options: [
              ...group.options,
              {
                name: "",
                price_diff: "0.00",
              },
            ],
          }
          : group
      )
    );
  };

  /* =========================================
     UPDATE GROUP FIELD (SAFE)
  ========================================= */
  const updateGroupField = <
    K extends keyof VariantGroup
  >(
    index: number,
    field: K,
    value: VariantGroup[K]
  ) => {
    setVariantGroups((prev) =>
      prev.map((group, idx) =>
        idx === index
          ? {
            ...group,
            [field]: value,
          }
          : group
      )
    );
  };

  /* =========================================
     UPDATE OPTION FIELD (SAFE)
  ========================================= */
  const updateOptionField = <
    K extends keyof VariantOption
  >(
    groupIndex: number,
    optionIndex: number,
    field: K,
    value: VariantOption[K]
  ) => {
    setVariantGroups((prev) =>
      prev.map((group, gIdx) => {
        if (gIdx !== groupIndex) return group;

        return {
          ...group,
          options: group.options.map((option, oIdx) =>
            oIdx === optionIndex
              ? {
                ...option,
                [field]: value,
              }
              : option
          ),
        };
      })
    );
  };

  return {
    variantGroups,
    setVariantGroups,

    addVariantGroup,
    addVariantOption,

    updateGroupField,
    updateOptionField,
  };
};