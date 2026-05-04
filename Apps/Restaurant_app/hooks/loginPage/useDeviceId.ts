import * as Application from "expo-application";
import * as Device from "expo-device";
import { useEffect, useState } from "react";

export const useDeviceId = () => {
    const [deviceId, setDeviceId] = useState("");

    useEffect(() => {
        const generateDeviceId = async () => {
            try {
                let id: string | null = null;

                if (Device.osName === "Android") {
                    id = Application.androidId || null;
                } else if (Device.osName === "iOS") {
                    id = await Application.getIosIdForVendorAsync?.();
                }

                if (!id) {
                    id = `${Device.brand}-${Device.modelName}`;
                }

                setDeviceId(id || "fallback-device");
            } catch {
                setDeviceId("fallback-device");
            }
        };

        generateDeviceId();
    }, []);

    return deviceId;
};