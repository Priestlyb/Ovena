import { useCart } from "@/context/CartContext";

export const useCartActions = () => {
  const { state, dispatch } = useCart();

  const addToCart = (product: any) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      },
    });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  const increaseQty = (id: string) => {
    dispatch({ type: "INCREASE_QTY", payload: id });
  };

  const decreaseQty = (id: string) => {
    dispatch({ type: "DECREASE_QTY", payload: id });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getTotal = () => {
    return state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return {
    cart: state.items,
    addToCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
    getTotal,
  };
};
