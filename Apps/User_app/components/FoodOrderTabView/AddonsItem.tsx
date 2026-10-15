import React, { useMemo, useState } from "react";

import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";

import { createStyles } from "@/constants/styles/RestaurantsPage.styles";

import { useTheme } from "@/constants/theme";

import { AddonsAddBtn } from "./AddonsAddBtn";
import { IconSymbol } from "../ui/icon-symbol";

type Props = {
  items?: any[];
};

export const AddonsItem = ({ items = [] }: Props) => {
  const theme = useTheme();

  const styles = createStyles(theme);

  /* ================= FLATTEN ADDON GROUPS ================= */

  const addonGroups = useMemo(() => {
    if (!Array.isArray(items)) return [];

    return items

      .filter((item) => item?.is_available === true)

      .flatMap((item) =>
        (item?.addon_groups || []).map((group: any) => ({
          ...group,
          parentItem: item,
        })),
      );
  }, [items]);

  /* ================= FILTER STATE ================= */

  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  /* ================= NORMALIZED GROUP NAMES ================= */

  const groupNames = useMemo(() => {
    return Array.from(
      new Set(
        addonGroups

          .map((g: any) => g?.name?.trim())

          .filter(Boolean),
      ),
    );
  }, [addonGroups]);

  /* ================= FILTERED GROUPS ================= */

  const filteredGroups = useMemo(() => {
    if (!activeGroup) return addonGroups;

    return addonGroups.filter(
      (group: any) => group?.name?.trim() === activeGroup,
    );
  }, [activeGroup, addonGroups]);

  /* ================= EMPTY STATE ================= */

  if (!addonGroups.length) return null;

  return (
    <View>
      {/* ================= FILTER CHIPS ================= */}

      <ScrollView
        horizontal

        nestedScrollEnabled

        showsHorizontalScrollIndicator={false}

        style={styles.addonsFilterScroll}
      >
        {/* ALL CHIP */}

        <TouchableOpacity
          onPress={() => setActiveGroup(null)}

          style={[
            styles.categoryChip,

            activeGroup === null && styles.activeCategoryChip,
          ]}
        >
          <Text
            style={[
              styles.categoryText,

              activeGroup === null && styles.activeCategoryText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {/* GROUP CHIPS */}

        {groupNames.map((name) => (
          <TouchableOpacity
            key={name}

            onPress={() => setActiveGroup(name)}

            style={[
              styles.categoryChip,

              activeGroup === name && styles.activeCategoryChip,
            ]}
          >
            <Text
              style={[
                styles.categoryText,

                activeGroup === name && styles.activeCategoryText,
              ]}
            >
              {name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ================= ADDON LIST ================= */}

      {filteredGroups.map((group: any) => {
        const item = group.parentItem;

        return (
          <View
            key={group.id}

            style={styles.addonsGroupContainer}
          >
            {group.addons?.map((addon: any) => {
              const imageUri = addon?.image || item?.image;

              return (
                <View
                  key={addon.id}

                  style={styles.addonsItem}
                >
                  {/* IMAGE */}

                  <View>
                    {imageUri ? (
                      <Image
                        source={{
                          uri: imageUri,
                        }}

                        style={styles.addonsImage}
                      />
                    ) : (
                      <IconSymbol
                        name="FastFoodIcon"

                        size={100}

                        color={theme.icon}
                      />
                    )}
                  </View>

                  {/* INFO */}

                  <View style={styles.addonsInfo}>
                    <Text style={styles.addonsName}>{addon.name}</Text>
                  </View>

                  {/* ACTIONS */}

                  <View style={styles.addonActions}>
                    <Text style={styles.price}>
                      ₦
                      {Number(addon.price || 0).toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>

                    {/* 
                        <AddonsAddBtn />
                        */}
                  </View>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};
