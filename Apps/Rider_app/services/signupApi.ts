import * as FileSystem from "expo-file-system/legacy";
import { WorkAvailabilityState } from "../components/signup/WorkAvailability";
import { SafetyReliabilityState } from "../components/signup/SafetyAndReliability";

const BASE_URL = "https://ovena-backend-production.up.railway.app";
// https://ovena-backend-production.up.railway.app

// ── JSON helper (PUT) ─────────────────────────────────────────────────────────
async function putJSON(endpoint: string, body: object, token?: string) {
  console.log("🌐 PUT →", endpoint);
  console.log("📤 Payload:", JSON.stringify(body, null, 2));

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const rawText = await res.text();
  console.log(`📥 Raw response (${res.status}):`, rawText.slice(0, 500));

  let data: any;
  try {
    data = JSON.parse(rawText);
  } catch {
    console.error("❌ Non-JSON response body:", rawText);
    throw new Error(
      `Server returned a non-JSON response (HTTP ${res.status}).\n\nPreview:\n${rawText.slice(0, 300)}`
    );
  }

  if (!res.ok) {
    console.error("❌ Backend error response:", JSON.stringify(data, null, 2));
    throw new Error(
      data?.message || data?.detail || JSON.stringify(data) || `Request failed: ${res.status}`
    );
  }

  console.log("✅ Response:", JSON.stringify(data, null, 2));
  return data;
}

// ── FormData helper (PUT — multipart) ────────────────────────────────────────
async function putFormData(endpoint: string, formData: FormData, token: string) {
  console.log("🌐 PUT (multipart) →", endpoint);
  console.log("🔑 Token:", token);

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      // ⚠️ Do NOT set Content-Type manually — fetch auto-sets it with the
      // correct multipart boundary when body is FormData.
    },
    body: formData,
  });

  const rawText = await res.text();
  console.log(`📥 Raw response (${res.status}):`, rawText.slice(0, 500));

  let data: any;
  try {
    data = JSON.parse(rawText);
  } catch {
    console.error("❌ Non-JSON response body:", rawText);
    throw new Error(
      `Server returned a non-JSON response (HTTP ${res.status}).\n\nPreview:\n${rawText.slice(0, 300)}`
    );
  }

  if (!res.ok) {
    console.error("❌ Backend error response:", JSON.stringify(data, null, 2));
    throw new Error(
      data?.message || data?.detail || JSON.stringify(data) || `Request failed: ${res.status}`
    );
  }

  console.log("✅ Response:", JSON.stringify(data, null, 2));
  return data;
}

// ── Step 1 — Personal Info ────────────────────────────────────────────────────
// Does not require a token. Returns access + refresh JWT on success.
export async function submitPersonalInfo(personalInfo: {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  gender: string;
  residential_address: string;
  birth_date: string;           // "YYYY-MM-DD" — formatted by Signup.tsx
  next_of_kin_name?: string;
  next_of_kin_phone?: string;
  next_of_kin_address?: string;
  password: string;
}): Promise<{ access: string; refresh: string }> {
  return putJSON("/api/accounts/onboard/driver/phase/1/", personalInfo);
}

// ── Step 2 — Identification & Documentation ───────────────────────────────────
// Sends the license image as a multipart file upload.
export async function submitDocInfo(
  docInfo: {
    drivers_license: string;   // local file:// URI
    nin: string;
    bvn: string;
    vehicleType: string;
    vehicleMake: string;
    plateNumber: string;
    guarantorName: string;
    guarantorPhone?: string;
    guarantorTwoName?: string;
    guarantorTwoPhone?: string;
  },
  token: string
) {
  const formData = new FormData();

  if (docInfo.drivers_license) {
    const uri = docInfo.drivers_license;
    const info = await FileSystem.getInfoAsync(uri);
    console.log("📦 License file pre-upload check:", info);

    if (!info.exists || (info as any).size === 0) {
      throw new Error(
        "License image file is missing or empty. Please re-select the photo and try again."
      );
    }

    const filename = uri.split("/").pop() ?? "license.jpg";
    const ext = /\.(\w+)$/.exec(filename)?.[1]?.toLowerCase() ?? "jpeg";
    const mimeType = ext === "png" ? "image/png" : "image/jpeg";

    formData.append("drivers_license", { uri, name: filename, type: mimeType } as any);
    console.log("📸 Attaching license image:", { uri, filename, mimeType, size: (info as any).size });
  } else {
    console.warn("⚠️ No license picture URI provided.");
  }

  formData.append("nin",              docInfo.nin);
  formData.append("bvn",              docInfo.bvn ?? "");
  formData.append("vehicle_type",     docInfo.vehicleType);
  formData.append("vehicle_make",     docInfo.vehicleMake);
  formData.append("plate_number",     docInfo.plateNumber);
  formData.append("guarantor1_name",  docInfo.guarantorName);
  formData.append("guarantor1_phone", docInfo.guarantorPhone ?? "");
  formData.append("guarantor2_name",  docInfo.guarantorTwoName ?? "");
  formData.append("guarantor2_phone", docInfo.guarantorTwoPhone ?? "");

  return putFormData("/api/accounts/onboard/driver/phase/2/", formData, token);
}

// ── Step 3 — Work Availability + Safety & Reliability ────────────────────────
export async function submitWorkAndSafety(
  work: WorkAvailabilityState,
  safety: SafetyReliabilityState,
  token: string
) {
  const formData = new FormData();

  const availabilityPayload = work.schedule;
  formData.append("availability", JSON.stringify(availabilityPayload));
  console.log("📅 availability:", JSON.stringify(availabilityPayload, null, 2));

  const complianceAnswers = {
    have_you_worked_as_delivery_rider: work.have_you_worked_as_delivery_rider,
    how_long_worked_as_rider:          work.how_long_worked_as_rider,
    familiarity_with_local_routes:     work.familiarity_with_local_routes,
    have_used_gps_for_deliveries:      work.have_used_gps_for_deliveries,
    can_handle_cash_on_delivery:       work.can_handle_cash_on_delivery,
    willing_to_follow_traffic_rules:   safety.trafficRules,
    willing_to_wear_helmet_and_gear:   safety.helmet,
    punctuality_self_rating:           safety.punctuality,
    has_health_condition:              safety.healthIssue,
    health_condition_details:          safety.healthDetails ?? "",
    why_work_with_us:                  safety.reason,
    how_soon_can_you_start:            safety.availability,
  };
  formData.append("compliance_answers", JSON.stringify(complianceAnswers));
  console.log("📋 compliance_answers:", JSON.stringify(complianceAnswers, null, 2));

  if (safety.bagImage) {
    const uri = safety.bagImage;
    const info = await FileSystem.getInfoAsync(uri);
    console.log("🎒 Bag image pre-upload check:", info);

    if (!info.exists || (info as any).size === 0) {
      throw new Error(
        "Bag image file is missing or empty. Please re-select the photo and try again."
      );
    }

    const filename = uri.split("/").pop() ?? "bag.jpg";
    const ext = /\.(\w+)$/.exec(filename)?.[1]?.toLowerCase() ?? "jpeg";
    const mimeType = ext === "png" ? "image/png" : "image/jpeg";

    formData.append("delivery_bag", { uri, name: filename, type: mimeType } as any);
    console.log("🎒 delivery_bag:", { uri, filename, mimeType, size: (info as any).size });
  } else {
    throw new Error("Please upload an image of your delivery bag before continuing.");
  }

  console.log("🚀 Submitting phase/3/ with keys: availability, compliance_answers, delivery_bag");
  return putFormData("/api/accounts/onboard/driver/phase/3/", formData, token);
}

// ── Step 4 — Bank Details + Selfie ───────────────────────────────────────────
export async function submitBankAndSelfie(
  bankDetails: {
    bank_name: string;
    bank_code: string;
    account_number: string;
    account_name: string;
  },
  faceImage: string,
  token: string
) {
  const formData = new FormData();

  formData.append("bank_name",      bankDetails.bank_name);
  formData.append("bank_code",      bankDetails.bank_code);
  formData.append("account_number", bankDetails.account_number);
  formData.append("account_name",   bankDetails.account_name);

  if (!faceImage) {
    throw new Error("Please take a selfie before submitting.");
  }

  const info = await FileSystem.getInfoAsync(faceImage);
  console.log("🤳 Selfie file pre-upload check:", info);

  if (!info.exists || (info as any).size === 0) {
    throw new Error(
      "Selfie image is missing or empty. Please retake the photo and try again."
    );
  }

  const filename = faceImage.split("/").pop() ?? "selfie.jpg";
  const ext = /\.(\w+)$/.exec(filename)?.[1]?.toLowerCase() ?? "jpeg";
  const mimeType = ext === "png" ? "image/png" : "image/jpeg";

  formData.append("verified_selfie", { uri: faceImage, name: filename, type: mimeType } as any);

  console.log("📦 Step 4 — Bank + Selfie payload:");
  console.log("  🏦 bank_name:      ", bankDetails.bank_name);
  console.log("  🔢 bank_code:      ", bankDetails.bank_code);
  console.log("  🔢 account_number: ", bankDetails.account_number);
  console.log("  👤 account_name:   ", bankDetails.account_name);
  console.log("  🤳 verified_selfie:", { uri: faceImage, name: filename, type: mimeType, size: (info as any).size });

  return putFormData("/api/accounts/onboard/driver/phase/4/", formData, token);
}

// ── Driver Login ──────────────────────────────────────────────────────────────
// Dedicated endpoint — separate from the onboarding BASE_URL.
// Sends phone_number + password, returns { access, refresh } on success.
//
// Usage in SignInScreen:
//   const { access, refresh } = await driverLogin(phoneNumber, password);
//   navigation.reset({ index: 0, routes: [{ name: "HomeScreen" }] });
//
const DRIVER_LOGIN_URL = "https://ovena-backend-production.up.railway.app/api/accounts/driver-login/";

export async function driverLogin(
  phone_number: string,
  password: string
): Promise<{ access: string; refresh: string }> {
  console.log("🌐 POST →", DRIVER_LOGIN_URL);
  console.log("📤 Payload:", JSON.stringify({ phone_number, password }, null, 2));

  const res = await fetch(DRIVER_LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone_number, password }),
  });

  const rawText = await res.text();
  console.log(`📥 Raw response (${res.status}):`, rawText.slice(0, 500));

  let data: any;
  try {
    data = JSON.parse(rawText);
  } catch {
    console.error("❌ Non-JSON response body:", rawText);
    throw new Error(
      `Server returned a non-JSON response (HTTP ${res.status}).\n\nPreview:\n${rawText.slice(0, 300)}`
    );
  }

  if (!res.ok) {
    console.error("❌ Login error response:", JSON.stringify(data, null, 2));
    throw new Error(
      data?.message || data?.detail || JSON.stringify(data) || `Login failed: ${res.status}`
    );
  }

  console.log("✅ Driver login successful");
  return { access: data.access, refresh: data.refresh };
}