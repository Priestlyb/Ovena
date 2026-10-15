import React from "react";

import { FoodsTab } from "./FoodsTab";

type Props = {
  categories?: any[];
  businessId?: number;
  branchId?: number;
  businessName?: string;
};

export const DealsTabs = ({
  categories,
  businessId,
  branchId,
  businessName,
}: Props) => {
  return (
    <FoodsTab
      categories={categories}
      businessId={businessId}
      branchId={branchId}
      businessName={businessName}
    />
  );
};
