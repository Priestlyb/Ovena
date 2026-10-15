import { useMutation } from "@tanstack/react-query";
import api from "@/services/apiClient";

export type CreateAccountPayload = {
    transaction_pin: string;
    bank_name: string;
    bank_code: string;
    bank_account_number: string;
    bank_account_name: string;
};

export type CreateAccountResponse = {
    message: string;
};

const CreateBankDetails = async (
    payload: CreateAccountPayload
): Promise<CreateAccountResponse> => {
    const { data } = await api.post(
        "/customer/account/create/",
        payload
    );

    return data;
};

export const useCreateBankDetails = () => {
    return useMutation({
        mutationFn: CreateBankDetails,
    });
};