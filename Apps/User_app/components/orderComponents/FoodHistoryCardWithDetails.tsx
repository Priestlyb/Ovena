import React from "react";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import FoodHistoryCard from "./foodhistory";

interface Props {
  order: any;
  onRate?: (order: any) => void;
  onReOrder?: (order: any) => void;
  reordering?: boolean;
}

const FoodHistoryCardWithDetails: React.FC<Props> = ({
  order,
  onRate,
  onReOrder,
  reordering = false,
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/screens/OrderDetails",
      params: { id: order?.id },
    });
  };

  const canRate = String(order?.status).toUpperCase() === "DELIVERED";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={reordering}
    >
      <FoodHistoryCard
        order={order}
        onRate={canRate ? onRate : undefined}
        onReOrder={onReOrder}
        reordering={reordering}
      />
    </TouchableOpacity>
  );
};

export default FoodHistoryCardWithDetails;
