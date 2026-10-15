import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type DeliveryMethodContextType = {
  isPickingUpFood: boolean;
  loading: boolean;
  setIsPickingUpFood: (value: boolean) => Promise<void>;
  resetDeliveryMethod: () => Promise<void>;
};

const STORAGE_KEY = "is_picking_up_food";

const DeliveryMethodContext = createContext<
  DeliveryMethodContextType | undefined
>(undefined);

export function DeliveryMethodProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPickingUpFood, setValue] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeliveryMethod();
  }, []);

  const loadDeliveryMethod = async () => {
    try {
      const storedValue = await AsyncStorage.getItem(STORAGE_KEY);

      if (storedValue !== null) {
        const parsedValue = JSON.parse(storedValue);

        setValue(parsedValue);
      }
    } catch (error) {
      console.log("DeliveryMethod load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const setIsPickingUpFood = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));

      setValue(value);

      //console.log({
      //  is_picking_up_food: value,
      // });
    } catch (error) {
      console.log("DeliveryMethod save error:", error);
    }
  };

  const resetDeliveryMethod = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);

      setValue(false);

      console.log("DELIVERY METHOD RESET");
    } catch (error) {
      console.log("DeliveryMethod reset error:", error);
    }
  };

  return (
    <DeliveryMethodContext.Provider
      value={{
        isPickingUpFood,
        loading,
        setIsPickingUpFood,
        resetDeliveryMethod,
      }}
    >
      {children}
    </DeliveryMethodContext.Provider>
  );
}

export function useDeliveryMethod() {
  const context = useContext(DeliveryMethodContext);

  if (!context) {
    throw new Error(
      "useDeliveryMethod must be used within a DeliveryMethodProvider",
    );
  }

  return context;
}
