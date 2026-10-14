// utils/idempotencyKey.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY  = "@withdrawal_idempotency_key_v1";
const KEY_MAX_AGE  = 24 * 60 * 60 * 1000; // 24h — after this, treat as stale and rotate

interface StoredKey {
  key:       string;
  amount:    number;
  createdAt: number;
}

// RFC4122-v4-shaped UUID via Math.random. We only need client-side
// uniqueness here, not cryptographic randomness, so no extra dependency
// (e.g. expo-crypto) is required.
function generateUUIDv4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Returns the idempotency key to send with a withdrawal POST for `amount`.
//
// - If a key already exists for the SAME amount and is < 24h old, it is
//   reused. This is what makes retries safe: if the first request timed
//   out or the app was killed mid-request, tapping "Confirm" again sends
//   the identical key, so the backend can recognize it as a retry of the
//   same logical transaction rather than creating a second withdrawal.
// - If the amount differs from what's stored (the user changed the
//   amount after a failed attempt) or the stored key is stale, a fresh
//   key is generated — this is intentionally a NEW logical transaction.
export async function getOrCreateWithdrawalIdempotencyKey(amount: number): Promise<string> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored: StoredKey = JSON.parse(raw);
      const isFresh = Date.now() - stored.createdAt < KEY_MAX_AGE;
      if (isFresh && stored.amount === amount) {
        return stored.key;
      }
    }
  } catch (err) {
    console.warn("[Idempotency] Failed to read stored key, generating new one:", err);
  }

  const newKey: StoredKey = { key: generateUUIDv4(), amount, createdAt: Date.now() };
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newKey));
  } catch (err) {
    console.warn("[Idempotency] Failed to persist key:", err);
  }
  return newKey.key;
}

// Call this ONLY after a withdrawal is confirmed successful — clears the
// key so the next withdrawal (even for the same amount) gets a fresh one.
// Deliberately NOT called on failure — a failed/ambiguous attempt must
// keep its key so a retry reuses it.
export async function clearWithdrawalIdempotencyKey(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn("[Idempotency] Failed to clear key:", err);
  }
}