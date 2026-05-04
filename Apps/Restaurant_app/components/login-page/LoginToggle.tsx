import { Text } from "@/components/atoms/Text";
import { styles } from "@/constants/styles";
import { Briefcase, User } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

export const LoginToggle = ({ loginAs, setLoginAs, onVendorPress }: any) => {
  return (
    <View style={styles.loginToggleContainer}>
      <TouchableOpacity
        style={[
          styles.loginToggleButton,
          loginAs === "admin" && styles.loginToggleButtonActive,
        ]}
        onPress={() => setLoginAs("admin")}
      >
        <User size={20} />
        <Text>Admin Staff</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.loginToggleButton,
          loginAs === "vendor" && styles.loginToggleButtonActive,
        ]}
        onPress={onVendorPress}
      >
        <Briefcase size={20} />
        <Text>Vendor Agent</Text>
      </TouchableOpacity>
    </View>
  );
};
