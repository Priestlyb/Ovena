import { View } from "react-native";

export const InlineSkeleton = ({ width, height }: any) => {
  return (
    <View
      style={{
        width,
        height,
        backgroundColor: "#EEE",
        borderRadius: 6,
        opacity: 0.6,
      }}
    />
  );
};
