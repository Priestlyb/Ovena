import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface Props {
  data: {
    bank: string;
    accountNumber: string;
    accountName: string;
  };
  setData: (val: any) => void;
}

export default function BankDetails({ data, setData }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bank Details</Text>

      <Text style={styles.label}>What Bank?</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={data.bank}
          onValueChange={(val) => setData({ ...data, bank: val })}
        >
          <Picker.Item label="Select Bank" value="" />
          <Picker.Item label="Access Bank" value="Access Bank" />
          <Picker.Item label="GTBank" value="GTBank" />
          <Picker.Item label="First Bank" value="First Bank" />
          <Picker.Item label="UBA" value="UBA" />
          <Picker.Item label="Zenith Bank" value="Zenith Bank" />
        </Picker>
      </View>

      <Text style={styles.label}>Account Number</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={10}
        value={data.accountNumber}
        onChangeText={(t) => setData({ ...data, accountNumber: t })}
      />

      <Text style={styles.label}>Name on Account</Text>
      <TextInput
        style={styles.input}
        value={data.accountName}
        onChangeText={(t) => setData({ ...data, accountName: t })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  label: { marginTop: 10, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginTop: 5,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 5,
  },
});
