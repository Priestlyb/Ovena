// hooks/orders/useOrderCalculations.ts

import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/apiClient";

const ORDER_CALCULATION_CACHE_KEY =
    "@order_calculation_defaults";

const DEFAULT_CACHE = {
    delivery_amount: 100,
    service_fee_percent: 4,
};

export interface OrderCalculationsPayload {
    branch_id: number;
    lat: number;
    long: number;

    coupon_code?: string;
    wallet_entry_id?: number;
}

export interface OrderCalculationResponse {
    subtotal: number;
    delivery_price: number;
    service_fee: number;
    service_fee_percent: number;
    discount_total: number;
    grand_total: number;

    coupons?: {
        id?: number;
        code?: string;
        description?: string;
        discount_type?: string;
        discount_value?: number;
        item_id?: number;
    } | null;

    raw?: any;
}

const useOrderCalculations = () => {
    const [loading, setLoading] = useState(false);

    const [calculationData, setCalculationData] =
        useState<OrderCalculationResponse | null>(null);

    const [error, setError] = useState<any>(null);

    const [cachedConfig, setCachedConfig] =
        useState(DEFAULT_CACHE);

    /**
     * Load cache immediately on mount
     */
    useEffect(() => {
        loadCache();
    }, []);

    const loadCache = async () => {
        try {
            const cached = await AsyncStorage.getItem(
                ORDER_CALCULATION_CACHE_KEY
            );

            if (cached) {
                setCachedConfig(JSON.parse(cached));
            } else {
                setCachedConfig(DEFAULT_CACHE);
            }
        } catch (err) {
            console.log(
                "[ORDER CALCULATION CACHE LOAD ERROR]",
                err
            );

            setCachedConfig(DEFAULT_CACHE);
        }
    };

    const saveCache = async (
        delivery_amount: number,
        service_fee_percent: number
    ) => {
        try {
            const data = {
                delivery_amount,
                service_fee_percent,
            };

            await AsyncStorage.setItem(
                ORDER_CALCULATION_CACHE_KEY,
                JSON.stringify(data)
            );

            setCachedConfig(data);
        } catch (err) {
            console.log(
                "[ORDER CALCULATION CACHE SAVE ERROR]",
                err
            );
        }
    };

    const normalizeResponse = (
        data: any,
        cartItems: any[] = [],
        cache = cachedConfig
    ): OrderCalculationResponse => {
        const subtotal = cartItems.reduce(
            (sum, item) =>
                sum + Number(item.line_total || 0),
            0
        );

        const delivery_price = Number(
            data?.delivery_amount ??
            cache.delivery_amount ??
            100
        );

        const service_fee_percent = Number(
            data?.service_fee_percent ??
            cache.service_fee_percent ??
            4
        );

        const service_fee =
            (subtotal * service_fee_percent) / 100;

        const coupon = data?.coupons ?? null;

        let discount_total = 0;

        if (coupon?.coupon_type === "itemdiscount") {
            const discountableItems = cartItems.filter(
                (item) =>
                    item.menu_item_id === coupon.item_id
            );

            const discountableTotal =
                discountableItems.reduce(
                    (sum, item) =>
                        sum +
                        Number(item.line_total || 0),
                    0
                );

            if (coupon.discount_type === "percent") {
                discount_total =
                    (discountableTotal *
                        Number(
                            coupon.discount_value || 0
                        )) /
                    100;
            }
        }

        const grand_total =
            subtotal +
            delivery_price +
            service_fee -
            discount_total;

        return {
            subtotal,
            delivery_price,
            service_fee,
            service_fee_percent,
            discount_total,
            grand_total,
            coupons: coupon,
            raw: data,
        };
    };

    const calculateOrder = async (
        payload: OrderCalculationsPayload,
        cartItems: any[] = []
    ) => {
        try {
            setError(null);

            /**
             * Show cached values immediately
             */
            const cachedCalculation =
                normalizeResponse(
                    {},
                    cartItems,
                    cachedConfig
                );

            setCalculationData(cachedCalculation);

            /**
             * Silent refresh
             */
            setLoading(true);

            const response = await api.post(
                "/customer/order/calculations/",
                payload
            );

            {/* console.log(
                "[ORDER CALCULATION RESPONSE]",
                response.data
            ); */}

            const deliveryAmount = Number(
                response.data?.delivery_amount ??
                cachedConfig.delivery_amount
            );

            const serviceFeePercent = Number(
                response.data?.service_fee_percent ??
                cachedConfig.service_fee_percent
            );

            await saveCache(
                deliveryAmount,
                serviceFeePercent
            );

            const normalized =
                normalizeResponse(
                    response.data,
                    cartItems,
                    {
                        delivery_amount:
                            deliveryAmount,
                        service_fee_percent:
                            serviceFeePercent,
                    }
                );

            setCalculationData(normalized);

            return {
                success: true,
                data: normalized,
            };
        } catch (err: any) {
            const errorData =
                err?.response?.data ||
                err?.message ||
                "Unable to calculate order";

            console.log(
                "[ORDER CALCULATION ERROR]",
                errorData
            );

            setError(errorData);

            /**
             * Keep showing cached values instead of clearing
             */
            return {
                success: false,
                error: errorData,
            };
        } finally {
            setLoading(false);
        }
    };

    const clearCalculation = () => {
        setCalculationData(null);
        setError(null);
    };

    return {
        calculateOrder,
        clearCalculation,
        calculationData,
        loading,
        error,
    };
};

export default useOrderCalculations;