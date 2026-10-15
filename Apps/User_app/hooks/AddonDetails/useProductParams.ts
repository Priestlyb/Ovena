import { useMemo } from "react";
import { useLocalSearchParams } from "expo-router";

export const useProductParams = () => {
  const params = useLocalSearchParams();

  const product = useMemo(() => {
    try {
      if (!params?.item) return null;
      return JSON.parse(params.item as string);
    } catch (e) {
      console.log("[PRODUCT PARSE ERROR]:", e);
      return null;
    }
  }, [params]);

  const orderMeta = useMemo(() => {
    try {
      if (!params?.orderMeta) return null;
      return JSON.parse(params.orderMeta as string);
    } catch (e) {
      console.log("[ORDER META PARSE ERROR]:", e);
      return null;
    }
  }, [params]);

  return { product, orderMeta };
};