import { Text } from "@/components/atoms/Text";
import { Card } from "@/components/molecules/Card";
import { Smartphone } from "lucide-react-native";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

import { DeviceListProps } from "@/types/manageUser";

export const DeviceList = ({ devices, loading, onSelect }: DeviceListProps) => {
  if (loading) return <ActivityIndicator size="large" color="#F65513" />;

  if (devices.length === 0) {
    return <Text>No linked devices</Text>;
  }

  return devices.map((device) => (
    <TouchableOpacity key={device.id} onPress={() => onSelect(device)}>
      <Card variant="elevated" padding="md">
        <View style={{ flexDirection: "row", gap: 16 }}>
          <Smartphone size={28} />
          <View>
            <Text weight="semibold">{device.name}</Text>
            <Text variant="bodySmall">Last active {device.lastActive}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  ));
};
