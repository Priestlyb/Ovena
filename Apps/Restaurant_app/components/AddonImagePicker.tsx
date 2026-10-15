import React from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { IconSymbol } from "./ui/icon-symbol";

type Props = {
  value: string | null;
  onPress: () => void;

  hasPendingChange?: boolean;
  onCancel?: () => void;

  isUploading?: boolean;
};

export const AddonImagePicker: React.FC<Props> = ({
  value,
  onPress,
  hasPendingChange = false,
  onCancel,
  isUploading = false,
}) => {
  return (
    <View style={{ marginBottom: 12 }}>
      <TouchableOpacity
        disabled={isUploading}
        onPress={onPress}
        style={{
          height: 140,
          borderRadius: 14,
          backgroundColor: "#f5f5f5",
          borderWidth: 1,
          borderColor: "#e5e5e5",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {value ? (
          <>
            <Image
              source={{ uri: value }}
              style={{
                width: "100%",
                height: "100%",
              }}
              resizeMode="cover"
            />

            {hasPendingChange && (
              <View
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  backgroundColor: "#D9502E",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: "600",
                  }}
                >
                  Pending Change
                </Text>
              </View>
            )}
          </>
        ) : (
          <>
            {isUploading ? (
              <ActivityIndicator size="small" />
            ) : (
              <>
                <IconSymbol name="ImagePlusIcon" size={16} color="#666" />

                <Text
                  style={{
                    marginTop: 8,
                    color: "#666",
                    fontSize: 13,
                    fontWeight: "500",
                  }}
                >
                  Add Image
                </Text>
              </>
            )}
          </>
        )}
      </TouchableOpacity>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
          padding: 15,
        }}
      >
        <TouchableOpacity disabled={isUploading} onPress={onPress}>
          <Text
            style={{
              color: "#D9502E",
              fontWeight: "600",
            }}
          >
            {value ? "Change Image" : "Select Image"}
          </Text>
        </TouchableOpacity>

        {hasPendingChange && onCancel && (
          <TouchableOpacity
            disabled={isUploading}
            onPress={onCancel}
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <IconSymbol name="ArrowRotateIcon" size={16} color="#666" />

            <Text
              style={{
                marginLeft: 6,
                color: "#666",
                fontWeight: "600",
              }}
            >
              Cancel Change
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
