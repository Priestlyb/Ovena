import api from "@/services/apiClient";
import { useEffect, useState } from "react";

export function useTransactionPin() {
    const [hasTransactionPin, setHasTransactionPin] = useState<boolean | null>(
        null,
    );

    useEffect(() => {
        api
            .get("/business/wallet/transaction-pin/")
            .then((res) => {
                setHasTransactionPin(
                    res.data?.data?.has_transaction_pin ?? false,
                );
            })
            .catch(console.error);
    }, []);

    return { hasTransactionPin };
}