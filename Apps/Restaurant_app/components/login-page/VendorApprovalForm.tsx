import { CustomInput } from "@/components/CustomInput";
import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";
import { Card } from "@/components/molecules/Card";
import { styles } from "@/constants/styles";
import { TouchableOpacity } from "react-native";

export const VendorApprovalForm = ({
  otp,
  setOtp,
  phone,
  setPhone,
  username,
  setUsername,
  onSubmit,
  loading,
  errors = {},
}: any) => (
  <Card>
    <Text align="center">Vendor Device Approval</Text>

    <Spacer size="md" />
    <CustomInput
      type="tel"
      placeholder="Enter given OTP code"
      label="OTP"
      value={otp}
      onChange={setOtp}
    />
    {errors.otp && <Text style={{ color: "red" }}>{errors.otp}</Text>}

    <Spacer size="md" />
    <CustomInput
      type="tel"
      placeholder="Enter your Phone Number"
      label="Phone"
      value={phone}
      onChange={setPhone}
    />
    {errors.phone && <Text style={{ color: "red" }}>{errors.phone}</Text>}

    <Spacer size="md" />
    <CustomInput
      placeholder="Choose a Username"
      label="Username"
      value={username}
      onChange={setUsername}
    />
    {errors.username && <Text style={{ color: "red" }}>{errors.username}</Text>}

    <Spacer size="lg" />

    <TouchableOpacity style={styles.continueBtn} onPress={onSubmit}>
      <Text style={styles.continueBtnText}>
        {loading ? "Processing..." : "Approve Device"}
      </Text>
    </TouchableOpacity>
  </Card>
);
