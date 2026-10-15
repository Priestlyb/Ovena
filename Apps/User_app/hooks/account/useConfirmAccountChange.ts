import { useMutation } from "@tanstack/react-query";
import api from "@/services/apiClient";

export type ConfirmAccountChangePayload = {
    otp_code: string;
    bank_name: string;
    bank_code: string;
    bank_account_number: string;
    bank_account_name: string;
};

export type ConfirmAccountChangeResponse = {
    message: string;
};

const confirmAccountChange = async (
    payload: ConfirmAccountChangePayload
): Promise<ConfirmAccountChangeResponse> => {
    const { data } = await api.post(
        "/customer/account/change/confirm/",
        payload
    );

    return data;
};

export const useConfirmAccountChange = () => {
    return useMutation({
        mutationFn: confirmAccountChange,
    });
};