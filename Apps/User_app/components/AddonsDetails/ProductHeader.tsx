import React from "react";
import { View, Image, TouchableOpacity } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/constants/theme";

type Props = {
  image?: string;
  imageError: boolean;
  setImageError: (v: boolean) => void;
  onBack: () => void;
  styles: any;
};

const ProductHeader = ({
  image,
  imageError,
  setImageError,
  onBack,
  styles,
}: Props) => {
  const theme = useTheme();

  const showImage = !!image && !imageError;

  return (
    <View>
      {showImage ? (
        <Image
          source={{ uri: image }}
          style={styles.productImage}
          resizeMode="cover"
          onError={(e) => {
            console.log("[IMAGE LOAD ERROR]:", e.nativeEvent.error);
            setImageError(true);
          }}
        />
      ) : (
        <View
          style={[
            styles.productImage,
            {
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.surface,
            },
          ]}
        >
          <IconSymbol
            name="BedRoomIcon"
            size={45}
            color={theme.textSecondary}
          />
        </View>
      )}

      <TouchableOpacity
        onPress={onBack}
        style={[
          styles.backButton,
          {
            backgroundColor: theme.background,
            borderColor: theme.border,
            borderWidth: 1,
          },
        ]}
      >
        <IconSymbol name="ArrowLeftIcon" size={24} color={theme.textPrimary} />
      </TouchableOpacity>
    </View>
  );
};

export default ProductHeader;
