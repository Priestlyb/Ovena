import { useQuery } from "@tanstack/react-query";
import api from "@/services/apiClient";

export type AccountResponse = {
    bank_name: string;
    bank_code: string;
    bank_account_number: string;
    bank_account_name: string;
};

const fetchAccount = async (): Promise<AccountResponse | null> => {
    try {
        const { data } = await api.get("/customer/account/");

        return data;
    } catch (error: any) {
        // No bank account exists yet
        if (error?.response?.status === 404) {
            return null;
        }

        throw error;
    }
};

export const useBankAccount = () => {
    return useQuery({
        queryKey: ["customer-account"],
        queryFn: fetchAccount,
        staleTime: 1000 * 60 * 15,
        gcTime: 1000 * 60 * 30,
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });
};