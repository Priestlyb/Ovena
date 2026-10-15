import { useState } from "react";

export const useAddonState = () => {
  const [addonQty, setAddonQty] = useState<Record<string, number>>({});

  const increaseAddon = (addon: any) => {
    setAddonQty((prev) => {
      const current = prev[addon.id] || 0;
      if (addon.max_qty && current >= addon.max_qty) return prev;
      return { ...prev, [addon.id]: current + 1 };
    });
  };

  const decreaseAddon = (addon: any) => {
    setAddonQty((prev) => {
      const current = prev[addon.id] || 0;
      if (current <= 0) return prev;
      return { ...prev, [addon.id]: current - 1 };
    });
  };

  return {
    addonQty,
    setAddonQty,
    increaseAddon,
    decreaseAddon,
  };
};