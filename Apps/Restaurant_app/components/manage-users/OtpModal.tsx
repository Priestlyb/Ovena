import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";
import { Modal, TouchableOpacity, View } from "react-native";

import { OTPModalProps } from "@/types/manageUser";

export const OtpModal = ({ visible, otp, onClose }: OTPModalProps) => (
  <Modal visible={visible} transparent animationType="fade">
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          padding: 24,
          borderRadius: 16,
        }}
      >
        <Text variant="h4">Link Device Code</Text>

        <Spacer size="md" />

        <Text style={{ fontSize: 36, fontWeight: "bold" }}>{otp}</Text>

        <Spacer size="md" />

        <TouchableOpacity onPress={onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);
