import React, { useMemo } from "react";

import { View, ScrollView } from "react-native";

import { createStyles } from "@/constants/styles/RestaurantsPage.styles";
import { useTheme } from "@/constants/theme";

import { FoodCard } from "./FoodCard";
import { Section } from "./Section";
import { AddonsItem } from "@/components/FoodOrderTabView/AddonsItem";

type Props = {
  categories?: any[];

  businessId?: number;
  branchId?: number;
  businessName?: string;

  targetMenuId?: string;

  targetCategoryId?: string | number;

  targetCategoryName?: string;
};

export const FoodsTab = ({
  categories = [],
  businessId,
  branchId,
  businessName,
  targetMenuId,
  targetCategoryId,
  targetCategoryName,
}: Props) => {
  const theme = useTheme();

  const styles = createStyles(theme);

  /* ================= ALL MENU ITEMS ================= */

  const allMenuItems = useMemo(() => {
    return categories.flatMap((category: any) =>
      (category.items || []).map((item: any) => ({
        ...item,

        categoryName: category.name,

        categoryId: category.id,
      })),
    );
  }, [categories]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingBottom: 60,
        },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ================= MAIN MENU ================= */}

      <Section title="Main Menu">
        <FoodCard
          items={allMenuItems}
          businessId={businessId}
          branchId={branchId}
          businessName={businessName}
          targetMenuId={targetMenuId}
          targetCategoryId={targetCategoryId}
          targetCategoryName={targetCategoryName}
        />
      </Section>

      {/* ================= ADDONS ================= */}

      <View style={styles.addonsContainer}>
        <AddonsItem items={allMenuItems} />
      </View>
    </ScrollView>
  );
};
