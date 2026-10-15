import { useRouter } from "expo-router";
import { useCartStore } from "@/src/store/cartStore";

export const useCartHandler = () => {
    const router = useRouter();
    const addItem = useCartStore((s) => s.addItem);

    const handleConfirmOrder = ({
        product,
        orderMeta,
        quantity,
        selectedVariants,
        addonQty,
        breakdown,
        mainTitle,
    }: any) => {
        const branchId = Number(orderMeta?.branch_id);

        if (!branchId || !product?.id) {
            console.log("[ERROR] Missing branch_id or product");
            return;
        }

        const variant_option_ids = Object.values(selectedVariants)
            .filter(Boolean)
            .map(Number);

        const addon_ids = Object.entries(addonQty)
            .filter(([_, qty]) => Number(qty) > 0)
            .map(([id]) => Number(id));

        const cartItem = {
            menu_item_id: Number(product.id),
            quantity: Number(quantity),
            variant_option_ids,
            addon_ids,
            unit_price: Number(product.price || 0),
            line_total: breakdown.total,
            notes: "",
            product_name: mainTitle,
            image: product?.image,
        };

        addItem(branchId, cartItem);

        //console.log("[CART UPDATED]", { branchId, cartItem });

        router.push({
            pathname: "/screens/RestaurantCart",
            params: { branchId: String(branchId) },
        });
    };

    return { handleConfirmOrder };
};