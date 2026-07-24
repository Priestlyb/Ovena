import api from "@/services/apiClient";
import { useState } from "react";
import uuid from "react-native-uuid";

export function useWithdraw(refreshWallet: () => Promise<void>) {
    const [withdrawing, setWithdrawing] = useState(false);
    const [withdrawError, setWithdrawError] = useState<string | null>(null);

    const withdraw = async (
        amount: string,
        pin: string[],
    ) => {
        const fullPin = pin.join("");

        if (!amount || Number(amount) <= 0) {
            throw new Error("Enter a valid amount");
        }

        if (fullPin.length !== 4) {
            throw new Error("Enter your 4-digit PIN");
        }

        try {
            setWithdrawing(true);

            await api.post(
                "/business/wallet/withdraw/",
                {
                    amount_kobo: Number(amount) * 100,
                    transaction_pin: fullPin,
                },
                {
                    headers: {
                        "Idempotency-Key": uuid.v4(),
                    },
                },
            );

            await refreshWallet();

            return true;
        } catch (error: any) {
            const err =
                error?.response?.data?.error || "Withdrawal failed";

            if (err.toLowerCase().includes("transaction_pin")) {
                setWithdrawError("Incorrect PIN. Please try again.");
            } else {
                setWithdrawError(err);
            }

            throw error;
        } finally {
            setWithdrawing(false);
        }
    };

    return {
        withdraw,
        withdrawing,
        withdrawError,
        setWithdrawError,
    };
}