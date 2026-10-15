import { CustomInput } from "@/components/CustomInput";
import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";
import { styles } from "@/constants/styles";
import { TouchableOpacity } from "react-native";

export const AdminLoginForm = ({
  phone,
  setPhone,
  password,
  setPassword,
  onLogin,
  onReset,
  loading,
  errors = {},
}: any) => (
  <>
    <CustomInput
      type="tel"
      placeholder="Enter your Phone Number"
      label="Phone"
      value={phone}
      onChange={setPhone}
    />
    {errors.phone && (
      <Text style={{ color: "red", marginTop: 4 }}>{errors.phone}</Text>
    )}

    <Spacer size="md" />

    <CustomInput
      placeholder="Enter your password"
      label="Password"
      value={password}
      onChange={setPassword}
      type="password"
    />
    {errors.password && (
      <Text style={{ color: "red", marginTop: 4 }}>{errors.password}</Text>
    )}

    <TouchableOpacity onPress={onReset}>
      <Text style={{ color: "#FF5920", textAlign: "right" }}>
        Reset Password?
      </Text>
    </TouchableOpacity>

    <Spacer size="xl" />

    <TouchableOpacity
      style={[
        styles.continueBtn,
        loading && {
          opacity: 0.6,
        },
      ]}
      onPress={onLogin}
      disabled={loading}
      activeOpacity={loading ? 1 : 0.7}
    >
      <Text style={styles.continueBtnText}>Login</Text>
    </TouchableOpacity>
  </>
);
