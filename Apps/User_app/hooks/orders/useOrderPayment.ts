import { useMutation } from "@tanstack/react-query";
import api from "@/services/apiClient";

type PaymentMethod = "points" | "paystack";

interface OrderPaymentPayload {
    method: PaymentMethod;
}

interface OrderPaymentResponse {
    message?: string;
    data?: any;
    [key: string]: any;
}

const makeOrderPayment = async (
    orderId: string,
    method: PaymentMethod
): Promise<OrderPaymentResponse> => {
    const response = await api.post(
        `/menu/order/payment/${orderId}/`,
        {
            method,
        }
    );

    return response.data;
};

export const useOrderPayment = () => {
    return useMutation({
        mutationFn: ({
            orderId,
            method,
        }: {
            orderId: string;
            method: PaymentMethod;
        }) => makeOrderPayment(orderId, method),
    });
};