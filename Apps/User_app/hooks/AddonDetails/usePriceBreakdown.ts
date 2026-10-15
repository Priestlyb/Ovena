import { useMemo } from "react";

export const usePriceBreakdown = ({
  product,
  quantity,
  addonQty,
  addonGroups,
  variantLines,
}: any) => {
  return useMemo(() => {
    const basePrice = Number(product?.price || 0);

    const addonLines: any[] = [];
    let addonSubtotal = 0;

    addonGroups.forEach((group: any) => {
      group.addons?.forEach((addon: any) => {
        const qty = addonQty[addon.id] || 0;

        if (qty > 0) {
          const lineTotal = qty * Number(addon.price || 0);

          addonLines.push({
            id: addon.id,
            name: addon.name,
            qty,
            price: Number(addon.price || 0),
            total: lineTotal,
          });

          addonSubtotal += lineTotal;
        }
      });
    });

    const baseSubtotal = basePrice * quantity;

    const variantSubtotal = variantLines.reduce(
      (sum: number, v: any) => sum + v.price * quantity,
      0
    );

    return {
      basePrice,
      baseSubtotal,
      addonLines,
      addonSubtotal,
      variantSubtotal,
      total: baseSubtotal + addonSubtotal + variantSubtotal,
    };
  }, [product, quantity, addonQty, addonGroups, variantLines]);
};