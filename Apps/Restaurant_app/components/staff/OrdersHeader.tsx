import { styles } from "@/constants/ordertabs";
import { Search } from "lucide-react-native";
import { Text, TextInput, View } from "react-native";

type Props = {
  search: string;
  onSearchChange: (text: string) => void;
};

export const OrdersHeader = ({ search, onSearchChange }: Props) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Orders</Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#F5F5F5",
          borderRadius: 10,
          paddingHorizontal: 12,
          height: 42,
          flex: 1,
          marginLeft: 16,
        }}
      >
        <Search size={18} color="#666" />

        <TextInput
          style={{
            flex: 1,
            marginLeft: 8,
            fontSize: 15,
          }}
          placeholder="Order ID"
          value={search}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
};
