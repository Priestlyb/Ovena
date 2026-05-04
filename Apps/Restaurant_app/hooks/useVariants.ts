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

export const useVariants = () => {
  const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([]);

  const addVariantGroup = () => {
    setVariantGroups((prev) => [
      ...prev,
      { name: "", is_required: false, options: [] },
    ]);
  };

  const addVariantOption = (index: number) => {
    setVariantGroups((prev) => {
      const updated = [...prev];
      updated[index].options.push({ name: "", price_diff: "0.00" });
      return updated;
    });
  };

  return {
    variantGroups,
    setVariantGroups,
    addVariantGroup,
    addVariantOption,
  };
};