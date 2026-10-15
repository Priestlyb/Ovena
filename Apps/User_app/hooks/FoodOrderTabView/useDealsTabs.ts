import { useState } from "react";

export const useDealsTabs = () => {
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    {
      key: "foods",
      title: "",
    },
  ]);

  return {
    index,
    setIndex,
    routes,
  };
};