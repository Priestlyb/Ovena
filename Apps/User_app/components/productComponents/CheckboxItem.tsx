import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";

import { useTheme } from "@/constants/theme";


interface CheckboxItemProps {
  label: string;
  price: number;
  checked: boolean;
  onToggle: () => void;
}


export const CheckboxItem: React.FC<CheckboxItemProps> = ({
  label,
  price,
  checked,
  onToggle,
}) => {

  const theme = useTheme();

  const styles = createStyles(theme);


  return (

    <TouchableOpacity
      style={styles.checkboxItem}
      onPress={onToggle}
      activeOpacity={0.7}
    >

      <View
        style={[
          styles.checkbox,
          checked && styles.checkboxChecked,
        ]}
      >

        {checked && (

          <Text style={styles.checkmark}>
            ✓
          </Text>

        )}

      </View>



      <Text style={styles.checkboxLabel}>
        {label}
      </Text>



      <Text style={styles.checkboxPrice}>
        ₦{price.toFixed(2)}
      </Text>


    </TouchableOpacity>

  );
};



const createStyles = (theme: any) =>
  StyleSheet.create({

    checkboxItem: {

      flexDirection: "row",

      alignItems: "center",

      paddingVertical: 14,

      borderBottomWidth: 1,

      borderBottomColor: theme.border,

    },


    checkbox: {

      width: 20,

      height: 20,

      borderWidth: 2,

      borderColor: theme.border,

      borderRadius: 20,

      marginRight: 12,

      alignItems: "center",

      justifyContent: "center",

    },


    checkboxChecked: {

      backgroundColor: theme.primary,

      borderColor: theme.primary,

    },


    checkmark: {

      color: theme.background,

      fontSize: 12,

      fontWeight: "bold",

    },


    checkboxLabel: {

      flex: 1,

      fontSize: 14,

      color: theme.textPrimary,

    },


    checkboxPrice: {

      fontSize: 14,

      fontWeight: "600",

      color: theme.textPrimary,

    },

  });