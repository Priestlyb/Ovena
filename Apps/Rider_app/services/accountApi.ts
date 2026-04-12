// services/accountApi.ts
// Endpoints for updating driver account info from the Account sub-screens.

import * as FileSystem from "expo-file-system/legacy";

const BASE_URL = "https://ovena-backend-production.up.railway.app";

// ── helpers ───────────────────────────────────────────────────────────────────

async function patchJSON(endpoint: string, body: object, token: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const raw = await res.text();
  let data: any;
  try { data = JSON.parse(raw); } catch { throw new Error(`Non-JSON response: ${raw.slice(0, 200)}`); }
  if (!res.ok) throw new Error(data?.message || data?.detail || JSON.stringify(data) || `Error ${res.status}`);
  return data;
}

async function patchFormData(endpoint: string, formData: FormData, token: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const raw = await res.text();
  let data: any;
  try { data = JSON.parse(raw); } catch { throw new Error(`Non-JSON response: ${raw.slice(0, 200)}`); }
  if (!res.ok) throw new Error(data?.message || data?.detail || JSON.stringify(data) || `Error ${res.status}`);
  return data;
}

// ── 1. Update Personal Information ───────────────────────────────────────────

export async function updatePersonalInfo(
  info: {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    password?: string;
    gender: string;
    birth_date: { day: string; month: string; year: string };
    residential_address: string;
    next_of_kin_name?: string;
    next_of_kin_phone?: string;
    next_of_kin_address?: string;
  },
  token: string
) {
  // Format birth_date as YYYY-MM-DD
  const { day, month, year } = info.birth_date;
  const birth_date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  const payload: Record<string, any> = {
    first_name:          info.first_name.trim(),
    last_name:           info.last_name.trim(),
    phone_number:        info.phone_number.trim(),
    email:               info.email.trim(),
    gender:              info.gender,
    birth_date,
    residential_address: info.residential_address.trim(),
    next_of_kin_name:    info.next_of_kin_name?.trim() ?? "",
    next_of_kin_phone:   info.next_of_kin_phone?.trim() ?? "",
    next_of_kin_address: info.next_of_kin_address?.trim() ?? "",
  };

  // Only include password if user typed one
  if (info.password && info.password.trim().length >= 6) {
    payload.password = info.password.trim();
  }

  return patchJSON("/api/accounts/driver/personal-info/", payload, token);
}

// ── 2. Update Documents / Identification ─────────────────────────────────────

export async function updateDocuments(
  doc: {
    drivers_license: string; // local file:// URI (may be unchanged)
    nin: string;
    bvn?: string;
    vehicleType: string;
    vehicleMake: string;
    plateNumber: string;
    guarantorName: string;
    guarantorPhone: string;
    guarantorTwoName: string;
    guarantorTwoPhone: string;
  },
  token: string
) {
  const formData = new FormData();

  // Only upload the license image if it's a local file URI (user picked a new one)
  if (doc.drivers_license && doc.drivers_license.startsWith("file://")) {
    const info = await FileSystem.getInfoAsync(doc.drivers_license);
    if (!info.exists || (info as any).size === 0) {
      throw new Error("License image file is missing or empty. Please re-select and try again.");
    }
    const filename = doc.drivers_license.split("/").pop() ?? "license.jpg";
    const ext = /\.(\w+)$/.exec(filename)?.[1]?.toLowerCase() ?? "jpeg";
    const mimeType = ext === "png" ? "image/png" : "image/jpeg";
    formData.append("drivers_license", { uri: doc.drivers_license, name: filename, type: mimeType } as any);
  }

  formData.append("nin",              doc.nin);
  formData.append("bvn",              doc.bvn ?? "");
  formData.append("vehicle_type",     doc.vehicleType);
  formData.append("vehicle_make",     doc.vehicleMake);
  formData.append("plate_number",     doc.plateNumber);
  formData.append("guarantor1_name",  doc.guarantorName);
  formData.append("guarantor1_phone", doc.guarantorPhone);
  formData.append("guarantor2_name",  doc.guarantorTwoName);
  formData.append("guarantor2_phone", doc.guarantorTwoPhone);

  return patchFormData("/api/accounts/driver/documents/", formData, token);
}

// ── 3. Update Bank Details ────────────────────────────────────────────────────

export async function updateBankDetails(
  bank: {
    bank_name: string;
    bank_code: string;
    account_number: string;
    account_name: string;
  },
  token: string
) {
  return patchJSON("/api/accounts/driver/bank-details/", bank, token);
}