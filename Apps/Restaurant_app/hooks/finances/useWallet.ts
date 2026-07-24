import api from "@/services/apiClient";
import { Wallet } from "@/types/finances";
import { useEffect, useState } from "react";

export function useWallet() {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchWallet = async () => {
        const res = await api.get("/business/wallet/balance/");
        setWallet(res.data);
    };

    useEffect(() => {
        fetchWallet()
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return {
        wallet,
        loading,
        refreshWallet: fetchWallet,
    };
}