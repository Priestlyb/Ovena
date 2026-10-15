// services/profile.ts

const BASE_URL =
    "https://ovena-backend-production.up.railway.app/api";

export interface ProfileResponse {
    [key: string]: any;
}

export const fetchProfile = async (token: string) => {
    const response = await fetch(`${BASE_URL}/accounts/profile/`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    console.log("Profile", data)

    return { response, data };
};

export const updateUsername = async (
    token: string,
    name: string
) => {
    const response = await fetch(
        `${BASE_URL}/accounts/customer/update/`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
        }
    );

    const data = await response.json().catch(async () => {
        // Fallback if the API doesn't return JSON
        const text = await response.text();
        return { message: text };
    });

    return { response, data };
};