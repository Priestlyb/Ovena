import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import GoogleAddressItem from "./GoogleAddressItem";
import GoogleLoading from "./GoogleLoading";
import GooglePoweredBy from "./GooglePoweredBy";

import { PlacePrediction } from "@/types/google";

interface GoogleAddressDropdownProps {
  visible: boolean;

  loading: boolean;

  suggestions: PlacePrediction[];

  onSelect: (prediction: PlacePrediction) => void;

  emptyMessage?: string;
}

const GoogleAddressDropdown: React.FC<GoogleAddressDropdownProps> = ({
  visible,
  loading,
  suggestions,
  onSelect,
  emptyMessage = "No addresses found.",
}) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Loading */}
      <GoogleLoading visible={loading} />

      {/* Suggestions */}
      {!loading && (
        <>
          {suggestions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{emptyMessage}</Text>
            </View>
          ) : (
            <>
              <FlatList
                keyboardShouldPersistTaps="handled"
                data={suggestions}
                keyExtractor={(item) => item.place_id}
                renderItem={({ item }) => (
                  <GoogleAddressItem item={item} onPress={onSelect} />
                )}
                showsVerticalScrollIndicator={false}
                style={styles.list}
                contentContainerStyle={styles.listContent}
              />

              <GooglePoweredBy />
            </>
          )}
        </>
      )}
    </View>
  );
};

export default GoogleAddressDropdown;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",

    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,

    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#E5E7EB",

    overflow: "hidden",

    marginTop: -2,

    elevation: 4,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    maxHeight: 260,
  },

  list: {
    flexGrow: 0,
  },

  listContent: {
    paddingBottom: 0,
  },

  emptyContainer: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    fontSize: 14,
    color: "#6B7280",
  },
});
