import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "delivery_passphrases";

export const saveDeliveryPassphrase = async (
  orderId: number | string,
  passphrase: string,
) => {
  const existing = await AsyncStorage.getItem(KEY);

  const data = existing ? JSON.parse(existing) : {};

  data[String(orderId)] = passphrase;

  await AsyncStorage.setItem(KEY, JSON.stringify(data));
};

export const getDeliveryPassphrase = async (
  orderId: number | string,
) => {
  const existing = await AsyncStorage.getItem(KEY);

  if (!existing) return null;

  const data = JSON.parse(existing);

  return data[String(orderId)] ?? null;
};

export const removeDeliveryPassphrase = async (
  orderId: number | string,
) => {
  const existing = await AsyncStorage.getItem(KEY);

  if (!existing) return;

  const data = JSON.parse(existing);

  delete data[String(orderId)];

  await AsyncStorage.setItem(KEY, JSON.stringify(data));
};