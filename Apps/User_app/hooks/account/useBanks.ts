import { useQuery } from "@tanstack/react-query";
import api from "@/services/apiClient";

export type Bank = {
    id: number;
    name: string;
    code: string;
    country: string;
    active: boolean;
};

const fetchBanks = async (): Promise<Bank[]> => {
    const { data } = await api.get("/banks/");

    //console.log("Banks", data);

    return data;
};

export const useBanks = () => {
    return useQuery({
        queryKey: ["banks"],
        queryFn: fetchBanks,
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};