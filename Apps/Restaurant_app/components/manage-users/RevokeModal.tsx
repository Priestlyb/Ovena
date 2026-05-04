import { Text } from "@/components/atoms/Text";
import { ActivityIndicator, Modal, TouchableOpacity, View } from "react-native";

import { RevokeModalProps } from "@/types/manageUser";

export const RevokeModal = ({
  visible,
  device,
  onCancel,
  onConfirm,
  loading,
}: RevokeModalProps) => (
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
        <Text variant="h4">Revoke Device?</Text>

        <Text>{device?.name}</Text>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity onPress={onCancel}>
            <Text>No</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onConfirm} disabled={loading}>
            {loading ? <ActivityIndicator /> : <Text>Yes</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);
