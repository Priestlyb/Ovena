import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet, Animated } from "react-native";
import { IconSymbol } from "../ui/icon-symbol";

interface DeliveryAddressFormProps {
  visible: boolean;
}

export const DeliveryAddressForm: React.FC<DeliveryAddressFormProps> = ({
  visible,
}) => {
  const [address, setAddress] = useState("");
  const [sendToOther, setSendToOther] = useState("");

  const showRecipientFields = sendToOther.trim().length > 0;

  /* =========================================
     FORM ANIMATION
  ========================================= */

  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(-20)).current;
  const formScaleY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(formOpacity, {
        toValue: visible ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(formTranslateY, {
        toValue: visible ? 0 : -20,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(formScaleY, {
        toValue: visible ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  /* =========================================
     FRIEND DETAILS ANIMATION
  ========================================= */

  const recipientOpacity = useRef(new Animated.Value(0)).current;
  const recipientTranslateY = useRef(new Animated.Value(-10)).current;
  const recipientScaleY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showRecipientFields) {
      Animated.parallel([
        Animated.timing(recipientOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(recipientTranslateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(recipientScaleY, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(recipientOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(recipientTranslateY, {
          toValue: -10,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(recipientScaleY, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showRecipientFields]);

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[
        styles.container,
        {
          opacity: formOpacity,
          transform: [{ translateY: formTranslateY }, { scaleY: formScaleY }],
        },
      ]}
    >
      {/* ADDRESS INPUT */}
      <View style={styles.addressWrapper}>
        <View style={styles.userField}>
          <IconSymbol name="LocationDotIcon" color="#000" size={25} />

          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your delivery address"
            style={styles.userInput}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* SEND TO SOMEONE ELSE */}
      <View style={styles.field}>
        <IconSymbol name="GiftIcon" color="#000" size={25} />

        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Sending to someone else?</Text>

          <TextInput
            value={sendToOther}
            onChangeText={setSendToOther}
            placeholder="Add their address to help courier"
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* FRIEND DETAILS */}
      {showRecipientFields && (
        <Animated.View
          style={[
            styles.extraSection,
            {
              opacity: recipientOpacity,
              transform: [
                { translateY: recipientTranslateY },
                { scaleY: recipientScaleY },
              ],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Friend's Details</Text>

          <View style={styles.detailField}>
            <Text style={styles.label}>Name</Text>

            <TextInput
              placeholder="Full name"
              style={styles.detailInput}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.detailField}>
            <Text style={styles.label}>Phone</Text>

            <TextInput
              placeholder="Phone number"
              keyboardType="phone-pad"
              style={styles.detailInput}
              placeholderTextColor="#999"
            />
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },

  addressWrapper: {
    width: "100%",
    paddingVertical: 10,
  },

  userField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  userInput: {
    flex: 1,
    fontSize: 15,
    minHeight: 50,
  },

  field: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },

  input: {
    fontSize: 15,
    paddingVertical: 6,
  },

  extraSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    overflow: "hidden",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
  },

  detailField: {
    marginBottom: 12,
  },

  detailInput: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
});
