import React from "react";
import { ScrollView } from "react-native";

import { styles } from "@/constants/styles/FoodOrderTabView.styles";
import { DealsTabs } from "@/components/FoodOrderTabView/DealsTabs";

import { FoodOrderTabViewProps } from "@/types";

type Props = FoodOrderTabViewProps & {
  businessId?: number;
  branchId?: number;
  businessName?: string;
};

export default function FoodOrderTabView({
  categories = [],
  businessId,
  branchId,
  businessName,
}: Props) {
  return (
    <DealsTabs
      categories={categories}
      businessId={businessId}
      branchId={branchId}
      businessName={businessName}
    />
  );
}
