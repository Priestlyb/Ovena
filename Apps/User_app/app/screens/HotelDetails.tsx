import React, { useEffect, useRef, useState } from "react";
import { router, useRouter } from "expo-router";
import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Modal,
  StatusBar,
  Animated,
} from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PinchGestureHandler, State } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");
const IMAGE_WIDTH = width - 32;

const HOTEL_IMAGES = [
  "https://i.pinimg.com/1200x/6b/56/12/6b56120622b976fa2184777cb271bfe8.jpg",
  "https://i.pinimg.com/1200x/47/f7/77/47f7772ed6ceff3f3692573e4ed96ed8.jpg",
  "https://i.pinimg.com/736x/db/27/5d/db275d22ca8aebfb6e0d51ea3104ea31.jpg",
];

export default function HotelDetails() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const flatListRef = useRef<FlatList>(null);
  const modalListRef = useRef<FlatList>(null);
  const scale = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  /** ---------------------------
   * Auto Scroll (paused when modal open)
   * --------------------------- */
  useEffect(() => {
    if (modalVisible) return;

    const interval = setInterval(() => {
      const next =
        activeIndex === HOTEL_IMAGES.length - 1 ? 0 : activeIndex + 1;

      flatListRef.current?.scrollToIndex({
        index: next,
        animated: true,
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIndex, modalVisible]);

  /** ---------------------------
   * Carousel Scroll
   * --------------------------- */
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / IMAGE_WIDTH);
    setActiveIndex(index);
  };

  /** ---------------------------
   * Pinch Zoom
   * --------------------------- */
  const onPinchEvent = Animated.event([{ nativeEvent: { scale } }], {
    useNativeDriver: true,
  });

  const onPinchStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  /** ---------------------------
   * Open Fullscreen Modal
   * --------------------------- */
  const openGallery = (index: number) => {
    setModalIndex(index);
    setModalVisible(true);

    setTimeout(() => {
      modalListRef.current?.scrollToIndex({
        index,
        animated: false,
      });
    }, 100);
  };

  return (
    <>
      <ScrollView style={{ flex: 1, padding: 16, marginTop: 50 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ width: 32 }} />
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            Pristina Hotel
          </Text>
          <TouchableOpacity onPress={() => router.replace("/homepage")}>
            <IconSymbol name="CloseIcon" size={35} color="#000" />
          </TouchableOpacity>
        </View>

        {/* ===== Optimized Carousel ===== */}
        <View style={{ marginTop: 20 }}>
          <FlatList
            ref={flatListRef}
            data={HOTEL_IMAGES}
            horizontal
            snapToInterval={IMAGE_WIDTH}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => i.toString()}
            onScroll={onScroll}
            getItemLayout={(_, i) => ({
              length: IMAGE_WIDTH,
              offset: IMAGE_WIDTH * i,
              index: i,
            })}
            removeClippedSubviews
            initialNumToRender={3}
            maxToRenderPerBatch={3}
            windowSize={5}
            contentContainerStyle={{ paddingRight: 16 }}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => openGallery(index)}
              >
                <Image
                  source={{ uri: item }}
                  style={{
                    width: IMAGE_WIDTH,
                    height: 220,
                    borderRadius: 16,
                  }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
          />

          {/* Dots */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            {HOTEL_IMAGES.map((_, i) => (
              <View
                key={i}
                style={{
                  width: activeIndex === i ? 10 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: activeIndex === i ? "#000" : "#ccc",
                  marginHorizontal: 4,
                }}
              />
            ))}
          </View>
        </View>
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 50,
              color: "#D9502E",
            }}
          >
            Overview
          </Text>
          <View
            style={{
              width: "50%",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 15,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Currency</Text>
            <Text style={{ fontSize: 16 }}>Naira, Dollar</Text>
          </View>
          <View
            style={{
              width: "50%",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 15,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Check-in</Text>
            <Text style={{ fontSize: 16 }}>3.00 PM</Text>
          </View>
          <View
            style={{
              width: "50%",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 15,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Check-out</Text>
            <Text style={{ fontSize: 16 }}>12.00 PM</Text>
          </View>
          <View
            style={{
              width: "50%",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 15,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Pets</Text>
            <Text style={{ fontSize: 16 }}>Service animals only</Text>
          </View>
        </View>

        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 50,
              color: "#D9502E",
            }}
          >
            Descriptions
          </Text>
          <Text style={{ marginTop: 10, lineHeight: 20 }}>
            Set on picturesque landscaped gardens, our hotel sits at the heart
            of Nigeria's Federal Capital Territory and Abuja's commercial
            district. We're less than three kilometers from Abuja National
            Mosque and Millennium Park, within 20 minutes of...
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              color: "#D9502E",
            }}
          >
            Read more
          </Text>
        </View>

        <View style={{ marginTop: 50 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 10,
              color: "#D9502E",
            }}
          >
            Amenities
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 10,
              gap: 20,
            }}
          >
            {[
              { name: "Spa", icon: "SpaIcon" as const },
              { name: "Gym", icon: "GymIcon" as const },
              { name: "On-site restaurant", icon: "RestaurantIcon" as const },
              { name: "Outdoor pool", icon: "SwimmerIcon" as const },
              { name: "Restaurant", icon: "RestaurantIcon" as const },
              { name: "Restaurant", icon: "RestaurantIcon" as const },
              { name: "Restaurant", icon: "RestaurantIcon" as const },
              { name: "Restaurant", icon: "RestaurantIcon" as const },
              { name: "Restaurant", icon: "RestaurantIcon" as const },
              { name: "Restaurant", icon: "RestaurantIcon" as const },
            ].map((item, index) => (
              <View
                key={index}
                style={{
                  width: 80,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "#F5F5F5",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconSymbol name={item.icon} size={24} color="#000" />
                </View>

                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    textAlign: "center",
                  }}
                  numberOfLines={2}
                >
                  {item.name}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* ===== Full Screen Modal Gallery ===== */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <StatusBar hidden />
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          <TouchableOpacity
            style={{ position: "absolute", top: 50, right: 20, zIndex: 10 }}
            onPress={() => setModalVisible(false)}
          >
            <IconSymbol name="CloseIcon" size={36} color="#fff" />
          </TouchableOpacity>

          <FlatList
            ref={modalListRef}
            data={HOTEL_IMAGES}
            horizontal
            pagingEnabled
            keyExtractor={(_, i) => i.toString()}
            showsHorizontalScrollIndicator={false}
            getItemLayout={(_, i) => ({
              length: width,
              offset: width * i,
              index: i,
            })}
            renderItem={({ item }) => (
              <PinchGestureHandler
                onGestureEvent={onPinchEvent}
                onHandlerStateChange={onPinchStateChange}
              >
                <Animated.Image
                  source={{ uri: item }}
                  style={{
                    width,
                    height,
                    resizeMode: "contain",
                    transform: [{ scale }],
                  }}
                />
              </PinchGestureHandler>
            )}
          />
        </View>
      </Modal>
    </>
  );
}
