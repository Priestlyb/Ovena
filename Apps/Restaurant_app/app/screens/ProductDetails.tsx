import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";

export default function ProductDetails() {
  const { product } = useLocalSearchParams<{
    product: string;
  }>();

  const item = useMemo(() => {
    try {
      return product ? JSON.parse(product) : null;
    } catch (error) {
      console.log("[PRODUCT PARSE ERROR]", error);
      return null;
    }
  }, [product]);

  console.log("[SELECTED PRODUCT]", item);

  if (!item) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        <View>
          {!!item.image && (
            <Image
              source={{ uri: item.image }}
              style={{
                width: "100%",
                height: 280,
              }}
              resizeMode="cover"
            />
          )}

          <View
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              backgroundColor: "#F84E10",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "700",
              }}
            >
              {item.price}
            </Text>
          </View>
        </View>

        <View
          style={{
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
            }}
          >
            {item.custom_name}
          </Text>

          <View
            style={{
              flexDirection: "row",
              marginTop: 12,
              gap: 10,
            }}
          >
            <View
              style={{
                backgroundColor: "#FFF3ED",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  color: "#F84E10",
                  fontWeight: "600",
                }}
              >
                {item.categoryName}
              </Text>
            </View>

            <View
              style={{
                backgroundColor:
                  item.inStock || item.is_available ? "#E8F7EC" : "#FFE9E9",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  color:
                    item.inStock || item.is_available ? "#22A447" : "#D92D20",
                  fontWeight: "600",
                }}
              >
                {item.inStock || item.is_available
                  ? "In Stock"
                  : "Out of Stock"}
              </Text>
            </View>
          </View>

          {!!item.description && (
            <View
              style={{
                marginTop: 24,
                backgroundColor: "#fff",
                padding: 16,
                borderRadius: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  marginBottom: 8,
                }}
              >
                Description
              </Text>

              <Text
                style={{
                  color: "#666",
                  lineHeight: 24,
                }}
              >
                {item.description}
              </Text>
            </View>
          )}

          {item.variant_groups?.length > 0 && (
            <View
              style={{
                marginTop: 24,
                backgroundColor: "#fff",
                padding: 16,
                borderRadius: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  marginBottom: 12,
                }}
              >
                Variants
              </Text>

              {item.variant_groups.map((group: any) => (
                <View key={group.id}>
                  <Text
                    style={{
                      fontWeight: "600",
                      marginBottom: 10,
                    }}
                  >
                    {group.name}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    {group.options?.map((option: any) => (
                      <View
                        key={option.id}
                        style={{
                          backgroundColor: "#F5F5F5",
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 12,
                        }}
                      >
                        <Text>
                          {option.name} (+₦
                          {Number(option.price_diff).toLocaleString()})
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {item.addon_groups?.length > 0 && (
            <View
              style={{
                marginTop: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  marginBottom: 16,
                }}
              >
                Add-ons
              </Text>

              {item.addon_groups.map((group: any) => (
                <View
                  key={group.id}
                  style={{
                    marginBottom: 24,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "700",
                      marginBottom: 12,
                    }}
                  >
                    {group.name}
                  </Text>

                  {group.addons?.map((addon: any) => (
                    <View
                      key={addon.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#fff",
                        padding: 12,
                        borderRadius: 16,
                        marginBottom: 10,
                      }}
                    >
                      {addon.image ? (
                        <Image
                          source={{ uri: addon.image }}
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 12,
                            marginRight: 12,
                          }}
                        />
                      ) : (
                        <View
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 12,
                            backgroundColor: "#F0F0F0",
                            marginRight: 12,
                          }}
                        />
                      )}

                      <View
                        style={{
                          flex: 1,
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "600",
                            fontSize: 16,
                          }}
                        >
                          {addon.name}
                        </Text>

                        <Text
                          style={{
                            color: "#666",
                            marginTop: 4,
                          }}
                        >
                          ₦{Number(addon.price).toLocaleString()}
                        </Text>
                      </View>

                      <View
                        style={{
                          backgroundColor: addon.is_available
                            ? "#E8F7EC"
                            : "#FFE9E9",
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          borderRadius: 12,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "600",
                          }}
                        >
                          {addon.is_available ? "Available" : "Unavailable"}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
