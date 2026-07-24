import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { GoogleAddressInputProps, PlacePrediction } from "@/types/google";

import { MIN_SEARCH_LENGTH, SEARCH_DEBOUNCE } from "@/constants/google";

import { getPlaceDetails, searchPlaces } from "@/services/googlePlaces";

import GoogleAddressDropdown from "./GoogleAddressDropdown";

/* =========================================================
   COMPONENT
========================================================= */

const GoogleAddressInput: React.FC<GoogleAddressInputProps> = ({
  label,
  placeholder = "Search address...",
  required = false,

  value,

  apiKey,

  country,

  onChangeText,

  onSelectLocation,
}) => {
  /* =========================================================
     STATE
  ========================================================= */

  const [query, setQuery] = useState(value);

  const [loading, setLoading] = useState(false);

  const [detailsLoading, setDetailsLoading] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);

  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mounted = useRef(true);

  /* =========================================================
     KEEP VALUE IN SYNC
  ========================================================= */

  useEffect(() => {
    setQuery(value);
  }, [value]);

  /* =========================================================
     CLEANUP
  ========================================================= */

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  const performSearch = async (text: string) => {
    if (text.trim().length < MIN_SEARCH_LENGTH) {
      setSuggestions([]);
      setShowDropdown(false);

      return;
    }

    try {
      setLoading(true);

      const results = await searchPlaces({
        query: text,
        apiKey,
        country,
      });

      if (!mounted.current) return;

      setSuggestions(results);

      setShowDropdown(true);
    } catch (error) {
      console.log("Google search failed:", error);

      setSuggestions([]);

      setShowDropdown(false);
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  /* =========================================================
     INPUT CHANGE
  ========================================================= */

  const handleChange = (text: string) => {
    setQuery(text);

    onChangeText?.(text);

    // Hide dropdown when input is cleared
    if (!text.trim()) {
      setSuggestions([]);
      setShowDropdown(false);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }

      return;
    }

    // Cancel previous search
    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current);
    }

    // Debounce search
    debounceRef.current = setTimeout(async () => {
      await performSearch(text);
      debounceRef.current = null;
    }, SEARCH_DEBOUNCE);
  };

  /* =========================================================
     PLACE SELECTION
     (Implemented in Part 2)
  ========================================================= */

  /* =========================================================
   PLACE SELECTION
========================================================= */

  const handleSelect = async (prediction: PlacePrediction) => {
    try {
      setDetailsLoading(true);

      setShowDropdown(false);

      const location = await getPlaceDetails({
        placeId: prediction.place_id,
        apiKey,
      });

      if (!location) {
        setShowDropdown(true);
        return;
      }

      if (!mounted.current) {
        return;
      }

      setQuery(location.address);

      onChangeText?.(location.address);

      onSelectLocation(location);

      setSuggestions([]);
    } catch (error) {
      console.log("Failed to fetch place details:", error);

      setShowDropdown(true);
    } finally {
      if (mounted.current) {
        setDetailsLoading(false);
      }
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <View style={styles.container}>
      {!!label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>

          {required && <Text style={styles.required}> *</Text>}
        </View>
      )}

      <View style={styles.inputWrapper}>
        <TextInput
          value={query}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          autoCorrect={false}
          autoCapitalize="words"
          onChangeText={handleChange}
        />

        {(loading || detailsLoading) && (
          <ActivityIndicator
            size="small"
            color="#FF6B35"
            style={styles.loader}
          />
        )}
      </View>

      <GoogleAddressDropdown
        visible={showDropdown}
        loading={loading}
        suggestions={suggestions}
        onSelect={handleSelect}
      />
    </View>
  );
};

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 18,
  },

  labelRow: {
    flexDirection: "row",
    marginBottom: 8,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  required: {
    color: "#DC2626",
    fontSize: 15,
    fontWeight: "700",
  },

  inputWrapper: {
    position: "relative",

    borderWidth: 1,
    borderColor: "#D1D5DB",

    borderRadius: 10,

    backgroundColor: "#FFFFFF",
  },

  input: {
    height: 52,

    paddingHorizontal: 16,

    paddingRight: 44,

    fontSize: 15,

    color: "#111827",
  },

  loader: {
    position: "absolute",

    right: 14,

    top: 14,
  },
});

export default GoogleAddressInput;
