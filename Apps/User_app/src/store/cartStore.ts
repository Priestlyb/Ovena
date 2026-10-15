import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/* =========================
   TYPES
========================= */

export type CartVariant = {
    id: number;
    group_id: number;
    group: string;
    name: string;
    price: number;
};

export type CartAddon = {
    id: number;
    name: string;
    qty: number;
    price: number;
    total: number;
};

export type CartItem = {
    key?: string;

    business_id?: number;
    branch_id?: number;

    menu_item_id: number;
    quantity: number;

    variant_option_ids: number[];
    addon_ids: number[];

    variants?: CartVariant[];
    addons?: CartAddon[];

    notes?: string;

    business_name?: string;
    product_name?: string;
    image?: string;

    unit_price?: number;
    line_total?: number;
};

export type BranchCalculation = {
    delivery_price: number;
    service_fee_percent: number;
    discount_total: number;

    coupons?: any;
    raw?: any;
};

/* =========================
   STORE
========================= */

type CartStore = {
    carts: Record<number, CartItem[]>;

    calculations: Record<number, BranchCalculation>;

    addItem: (branchId: number, item: CartItem) => void;

    updateItem: (
        branchId: number,
        oldKey: string,
        item: CartItem,
    ) => void;

    removeItem: (
        branchId: number,
        itemKey: string,
    ) => void;

    updateQuantity: (
        branchId: number,
        itemKey: string,
        quantity: number,
    ) => void;

    clearBranch: (branchId: number) => void;

    setCalculation: (
        branchId: number,
        calculation: BranchCalculation,
    ) => void;

    clearCalculation: (
        branchId: number,
    ) => void;

    getGroupedByBranch: () => Record<number, CartItem[]>;

    getBranchTotal: (
        branchId: number,
    ) => number;

    getCartTotal: () => number;

    getCartItemCount: () => number;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            carts: {},

            calculations: {},

            /* =========================
               ADD ITEM
            ========================= */

            addItem: (branchId, item) =>
                set((state) => {
                    const existing = state.carts[branchId] || [];

                    const matchIndex = existing.findIndex((i) => {
                        if (item.key && i.key) {
                            return i.key === item.key;
                        }

                        return i.menu_item_id === item.menu_item_id;
                    });

                    const updated = [...existing];

                    if (matchIndex > -1) {
                        const prev = updated[matchIndex];

                        updated[matchIndex] = {
                            ...prev,
                            quantity: prev.quantity + item.quantity,
                            line_total:
                                Number(prev.line_total || 0) +
                                Number(item.line_total || 0),
                        };
                    } else {
                        updated.push(item);
                    }

                    return {
                        carts: {
                            ...state.carts,
                            [branchId]: updated,
                        },
                    };
                }),

            /* =========================
               REMOVE ITEM
            ========================= */

            removeItem: (branchId, itemKey) =>
                set((state) => {
                    const items = state.carts[branchId] || [];

                    return {
                        carts: {
                            ...state.carts,
                            [branchId]: items.filter((item) => {
                                if (item.key) {
                                    return item.key !== itemKey;
                                }

                                return String(item.menu_item_id) !== itemKey;
                            }),
                        },
                    };
                }),

            /* =========================
               UPDATE QUANTITY
            ========================= */

            updateQuantity: (
                branchId,
                itemKey,
                quantity,
            ) =>
                set((state) => {
                    if (quantity <= 0) return state;

                    const items = state.carts[branchId] || [];

                    const updated = items.map((item) => {
                        const isMatch = item.key
                            ? item.key === itemKey
                            : String(item.menu_item_id) === itemKey;

                        if (!isMatch) return item;

                        const currentQty = item.quantity || 1;
                        const unitTotal =
                            Number(item.line_total || 0) / currentQty;

                        return {
                            ...item,
                            quantity,
                            line_total: unitTotal * quantity,
                        };
                    });

                    return {
                        carts: {
                            ...state.carts,
                            [branchId]: updated,
                        },
                    };
                }),

            /* =========================
               CALCULATIONS
            ========================= */

            setCalculation: (
                branchId,
                calculation,
            ) =>
                set((state) => ({
                    calculations: {
                        ...state.calculations,
                        [branchId]: calculation,
                    },
                })),

            clearCalculation: (branchId) =>
                set((state) => {
                    const calculations = {
                        ...state.calculations,
                    };

                    delete calculations[branchId];

                    return {
                        calculations,
                    };
                }),

            /* =========================
UPDATE ITEM
========================= */

            updateItem: (branchId, oldKey, item) =>
                set((state) => {
                    const existing = state.carts[branchId] || [];

                    const updated = existing.map((cartItem) => {
                        const key = cartItem.key ?? String(cartItem.menu_item_id);

                        if (key !== oldKey) return cartItem;

                        return item;
                    });

                    return {
                        carts: {
                            ...state.carts,
                            [branchId]: updated,
                        },
                    };
                }),

            /* =========================
               CLEAR BRANCH
            ========================= */

            clearBranch: (branchId) =>
                set((state) => {
                    const carts = {
                        ...state.carts,
                    };

                    delete carts[branchId];

                    const calculations = {
                        ...state.calculations,
                    };

                    delete calculations[branchId];

                    return {
                        carts,
                        calculations,
                    };
                }),

            /* =========================
               GETTERS
            ========================= */

            getGroupedByBranch: () => get().carts,

            getBranchTotal: (branchId) => {
                const items =
                    get().carts[branchId] || [];

                return items.reduce(
                    (sum, item) =>
                        sum + Number(item.line_total || 0),
                    0,
                );
            },

            getCartTotal: () => {
                return Object.values(get().carts)
                    .flat()
                    .reduce(
                        (sum, item) =>
                            sum + Number(item.line_total || 0),
                        0,
                    );
            },

            getCartItemCount: () => {
                return Object.values(get().carts)
                    .flat()
                    .reduce(
                        (sum, item) =>
                            sum + (item.quantity || 0),
                        0,
                    );
            },
        }),
        {
            name: "restaurant-cart",

            storage: createJSONStorage(
                () => AsyncStorage,
            ),
        },
    ),
);