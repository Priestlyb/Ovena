import { useQuery } from "@tanstack/react-query";
import api from "@/services/apiClient";


export interface BusinessDetail {
    id: number;
    name?: string;
    email?: string;
    phone?: string;

    [key: string]: any;
}


export const STAFF_DETAIL_QUERY_KEY = (
    branchId: number
) => [
        "staff-detail",
        branchId,
    ];


const fetchBusinessDetail = async (
    branchId: number
): Promise<BusinessDetail> => {
    const response = await api.get(
        `/customer/staff/detail/${branchId}/`
    );

    //console.log("Full Response:", response);
    //console.log("Response Data:", response.data);

    return response.data;
};


export const useBusinessDetail = (
    branchId?: number
) => {
    return useQuery({
        queryKey: STAFF_DETAIL_QUERY_KEY(
            branchId as number
        ),

        queryFn: () =>
            fetchBusinessDetail(
                branchId as number
            ),

        enabled: !!branchId,

        staleTime: 1000 * 60 * 5,

        retry: 2,
    });
};