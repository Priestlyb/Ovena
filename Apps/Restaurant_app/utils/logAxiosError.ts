// utils/logAxiosError.ts

import axios from "axios";

export function logAxiosError(error: unknown) {
    if (!axios.isAxiosError(error)) {
        console.log("Unknown Error:", error);
        return;
    }

    console.log("========== AXIOS ERROR ==========");
    console.log("Message:", error.message);
    console.log("Code:", error.code);
    console.log("URL:", error.config?.url);
    console.log("Method:", error.config?.method);
    console.log("Headers:", error.config?.headers);
    console.log("Request:", error.config?.data);

    if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Response:", error.response.data);
    } else if (error.request) {
        console.log("No response received.");
        console.log(error.request);
    }

    console.log("Stack:", error.stack);
    console.log("=================================");
}