import { CustomInput } from "@/components/CustomInput";
import React from "react";

/* ================================
   TYPES
================================ */
type ProductInfoSectionProps = {
  name: string;
  setName: (value: string) => void;

  description: string;
  setDescription: (value: string) => void;

  price: string;
  setPrice: (value: string) => void;

  formatPrice: (value: string) => string;
};

/* ================================
   COMPONENT
================================ */
export const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({
  name,
  setName,
  description,
  setDescription,
  price,
  setPrice,
  formatPrice,
}) => {
  return (
    <>
      <CustomInput
        placeholder="Classic Cheeseburger"
        label="Name"
        value={name}
        onChange={setName}
      />

      <CustomInput
        label="Description"
        placeholder="Juicy beef patty with cheddar"
        value={description}
        onChange={setDescription}
      />

      <CustomInput
        type="currency"
        placeholder="₦3,500"
        label="Price"
        value={price}
        onChange={(val) => setPrice(formatPrice(val))}
      />
    </>
  );
};
