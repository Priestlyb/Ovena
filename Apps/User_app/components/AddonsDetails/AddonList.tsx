import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { IconSymbol } from "../ui/icon-symbol";

type Props = {
  addonGroups: any[];
  addonQty: Record<string, number>;
  increaseAddon: (group: any, addon: any) => void;
  decreaseAddon: (addon: any) => void;
  styles: any;
};

const AddonList = ({
  addonGroups,
  addonQty,
  increaseAddon,
  decreaseAddon,
  styles,
}: Props) => {
  return (
    <View>
      {addonGroups.map((group: any) => (
        <View key={group.id} style={{ marginBottom: 24 }}>
          {/* Group Title */}
          <Text
            style={[
              styles.productTitle,
              {
                fontSize: 18,
                marginBottom: 4,
              },
            ]}
          >
            {group.name}
          </Text>

          {/* Optional helper text */}
          {(group.is_required || group.max_selection > 0) && (
            <Text
              style={{
                color: "#777",
                marginBottom: 12,
              }}
            >
              {group.is_required ? "Required" : "Optional"}
              {group.max_selection > 0
                ? ` • Select up to ${group.max_selection}`
                : ""}
            </Text>
          )}

          {/* Horizontal list for this group */}
          <ScrollView
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.addonsScrollContent}
          >
            {group.addons?.map((addon: any) => {
              const qty = addonQty[addon.id] || 0;

              return (
                <View key={addon.id} style={styles.addonCard}>
                  {addon.image ? (
                    <Image
                      source={{ uri: addon.image }}
                      style={styles.addonImage}
                    />
                  ) : (
                    <View style={styles.addonImagePlaceholder}>
                      <IconSymbol name="FastFoodIcon" size={100} color="#999" />
                    </View>
                  )}

                  <View style={styles.addonInfoRow}>
                    <Text style={styles.addonText}>{addon.name}</Text>

                    <Text style={styles.addonText}>
                      ₦{Number(addon.price).toLocaleString()}
                    </Text>
                  </View>

                  <View style={styles.addonCounterRow}>
                    <TouchableOpacity onPress={() => decreaseAddon(addon)}>
                      <Text style={styles.addonIncrement}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.addonText}>{qty}</Text>

                    <TouchableOpacity
                      onPress={() => increaseAddon(group, addon)}
                    >
                      <Text style={styles.addonIncrement}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      ))}
    </View>
  );
};

export default AddonList;
