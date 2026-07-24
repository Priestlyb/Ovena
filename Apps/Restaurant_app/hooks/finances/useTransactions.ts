import api from "@/services/apiClient";
import { Transaction } from "@/types/finances";
import { useEffect, useState } from "react";

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        const txRes = await api.get("/business/wallet/transactions/");
        const wdRes = await api.get("/business/wallet/withdrawals/");

        const txs =
            txRes.data?.results?.data?.map((tx: any) => ({
                id: `tx-${tx.id}`,
                amount: tx.amount_kobo,
                type: tx.transaction_type,
                status: tx.status,
                reference: tx.reference,
                created_at: tx.created_at,
                description: tx.description,
            })) || [];

        const withdrawals =
            wdRes.data?.results?.map((wd: any) => ({
                id: `wd-${wd.id}`,
                amount: wd.amount_kobo,
                type: "debit",
                status: wd.status,
                reference: wd.reference,
                created_at: wd.created_at,
                description: "Withdrawal",
            })) || [];

        const merged = [...txs, ...withdrawals];

        merged.sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
        );

        setTransactions(merged);
    };

    useEffect(() => {
        fetchTransactions()
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return {
        transactions,
        loading,
        refreshTransactions: fetchTransactions,
    };
}