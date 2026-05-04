import { CustomInput } from "@/components/CustomInput";
import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";
import { Card } from "@/components/molecules/Card";
import { styles } from "@/constants/styles";
import { Modal, TouchableOpacity, View } from "react-native";

export const ResetPasswordModal = ({
  visible,
  phone,
  setPhone,
  onSubmit,
  onClose,
}: any) => (
  <Modal visible={visible} animationType="slide">
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Card>
        <CustomInput
          placeholder="Enter yur Phone Number"
          label="Phone"
          value={phone}
          onChange={setPhone}
        />

        <Spacer size="lg" />

        <TouchableOpacity style={styles.continueBtn} onPress={onSubmit}>
          <Text style={styles.continueBtnText}>Send OTP</Text>
        </TouchableOpacity>

        <Spacer size="sm" />

        <TouchableOpacity onPress={onClose}>
          <Text align="center">Cancel</Text>
        </TouchableOpacity>
      </Card>
    </View>
  </Modal>
);
