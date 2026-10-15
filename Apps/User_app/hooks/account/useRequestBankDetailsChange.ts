import { useMutation } from "@tanstack/react-query";
import api from "@/services/apiClient";

export interface RequestBankDetailsChangePayload {
    transaction_pin: string;
}

const requestBankDetailsChange = async (
    payload: RequestBankDetailsChangePayload,
) => {
    const { data } = await api.post(
        "/customer/account/change/request/",
        payload,
    );

    return data;
};

export const useRequestBankDetailsChange = () => {
    return useMutation({
        mutationFn: requestBankDetailsChange,
    });
};