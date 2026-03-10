const BASE_URL = "https://ovena-backend-production.up.railway.app";

async function postJSON(endpoint: string, body: object, token?: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || `Request failed: ${res.status}`);
  return data;
}

async function postFormData(endpoint: string, formData: FormData, token: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      // No Content-Type — fetch sets it automatically with boundary for FormData
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || `Request failed: ${res.status}`);
  return data;
}

// Step 1 — No token needed. Returns token from backend.
export async function submitPersonalInfo(personalInfo: {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  gender: string;
  residential_address: string;
  birth_date: string;        // ✅ now a string, not an object
  next_of_kin_name?: string;
  next_of_kin_phone?: string;
  next_of_kin_address?: string;
  referre_code?: string;
  password: string;
}): Promise<{ token: string }> {
  return postJSON("/api/accounts/onboard/driver/phase/1/", personalInfo);
}

// Step 2 — Requires token
export async function submitDocInfo(
  docInfo: {
    licensePicture: string;
    nin: string;
    bvn: string;
    vehicleType: string;
    vehicleMake: string;
    plateNumber: string;
    guarantorName: string;
    guarantorPhone?: string;
  },
  token: string
) {
  const formData = new FormData();

  if (docInfo.licensePicture) {
    const filename = docInfo.licensePicture.split("/").pop() ?? "license.jpg";
    const match = /\.(\w+)$/.exec(filename);
    formData.append("licensePicture", {
      uri: docInfo.licensePicture,
      name: filename,
      type: match ? `image/${match[1]}` : "image/jpeg",
    } as any);
  }

  formData.append("nin", docInfo.nin);
  formData.append("bvn", docInfo.bvn);
  formData.append("vehicleType", docInfo.vehicleType);
  formData.append("vehicleMake", docInfo.vehicleMake);
  formData.append("plateNumber", docInfo.plateNumber);
  formData.append("guarantorName", docInfo.guarantorName);
  formData.append("guarantorPhone", docInfo.guarantorPhone ?? "");

  return postFormData("/api/accounts/onboard/driver/phase/2/", formData, token);
}

// Step 3 — Requires token
export async function submitWorkAvailability(
  workAvailability: {
    fullTime: boolean;
    partTime: boolean;
    days: string[];
    times: string[];
    previousDelivery: string[];
    localRoutes: string[];
    gpsUsed: string[];
    cashOnDelivery: string[];
  },
  token: string
) {
  return postJSON("/api/accounts/onboard/driver/phase/3/", workAvailability, token);
}

// Step 4 — Requires token
export async function submitSafetyReliability(
  safetyReliability: {
    trafficRules: string;
    helmet: string;
    punctuality: string;
    healthIssue: string;
    healthDetails: string;
    reason: string;
    availability: string;
    bagImage: string;
  },
  token: string
) {
  const formData = new FormData();

  if (safetyReliability.bagImage) {
    const filename = safetyReliability.bagImage.split("/").pop() ?? "bag.jpg";
    const match = /\.(\w+)$/.exec(filename);
    formData.append("bagImage", {
      uri: safetyReliability.bagImage,
      name: filename,
      type: match ? `image/${match[1]}` : "image/jpeg",
    } as any);
  }

  formData.append("trafficRules", safetyReliability.trafficRules);
  formData.append("helmet", safetyReliability.helmet);
  formData.append("punctuality", safetyReliability.punctuality);
  formData.append("healthIssue", safetyReliability.healthIssue);
  formData.append("healthDetails", safetyReliability.healthDetails);
  formData.append("reason", safetyReliability.reason);
  formData.append("availability", safetyReliability.availability);

  return postFormData("/api/accounts/onboard/driver/phase/3/", formData, token);
}

// Step 5 — Requires token
export async function submitBankDetails(
  bankDetails: {
    bank: string;
    accountNumber: string;
    accountName: string;
  },
  token: string
) {
  return postJSON("/auth/register/bank", bankDetails, token);
}

// Step 6 — Requires token
export async function submitSelfie(faceImage: string, token: string) {
  const formData = new FormData();

  const filename = faceImage.split("/").pop() ?? "selfie.jpg";
  const match = /\.(\w+)$/.exec(filename);
  formData.append("faceImage", {
    uri: faceImage,
    name: filename,
    type: match ? `image/${match[1]}` : "image/jpeg",
  } as any);

  return postFormData("/api/accounts/onboard/driver/phase/4/", formData, token);
}