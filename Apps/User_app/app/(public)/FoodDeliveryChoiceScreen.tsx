import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { router } from "expo-router";

import { styles } from "@/constants/styles/FoodDeliveryChoiceScreen";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useDeliveryMethod } from "@/context/DeliveryMethodContext";
import { useAuth } from "@/context/AuthContext";
import FoodChoiceTransition from "@/components/animations/FoodChoiceTransition";

type TransitionType = "pickup" | "delivery" | null;

const HomeScreen = () => {
  const { authStatus } = useAuth();
  const { setIsPickingUpFood } = useDeliveryMethod();

  const [transitionType, setTransitionType] = useState<TransitionType>(null);

  /* ======================================================
     NAVIGATION
  ====================================================== */

  const handleTransitionFinish = useCallback(() => {
    if (authStatus === "authenticated") {
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  }, [authStatus]);

  /* ======================================================
     PICKUP / DELIVERY SELECTION
  ====================================================== */

  const handleSelection = useCallback(
    (isPickup: boolean) => {
      // Prevent another selection while the animation
      // is already playing.
      if (transitionType !== null) return;

      // Save the user's choice immediately.
      setIsPickingUpFood(isPickup);

      // Start the appropriate transition.
      setTransitionType(isPickup ? "pickup" : "delivery");
    },
    [transitionType, setIsPickingUpFood],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ======================================================
            BACKGROUND FOOD IMAGES
        ====================================================== */}

        <Image
          source={require("@/assets/images/halfPizza.png")}
          style={styles.pizza}
          resizeMode="cover"
        />

        <Image
          source={require("@/assets/images/chickenRice.png")}
          style={styles.chicken}
          resizeMode="cover"
        />

        <Image
          source={require("@/assets/images/halfBurger.png")}
          style={styles.burger}
          resizeMode="cover"
        />

        {/* ======================================================
            DECORATIVE LEAVES
        ====================================================== */}

        {/* Top-left leaf */}
        <View style={styles.leafTopLeft}>
          <IconSymbol name="LeafIcon" size={34} color="#4E7D22" />
        </View>

        {/* Top-right leaf */}
        <View style={styles.leafTopRight}>
          <IconSymbol name="LeafIcon" size={27} color="#6A942F" />
        </View>

        {/* Small leaf near heading */}
        <View style={styles.leafHeadingLeft}>
          <IconSymbol name="LeafIcon" size={20} color="#719B35" />
        </View>

        {/* Small leaf near heading right */}
        <View style={styles.leafHeadingRight}>
          <IconSymbol name="LeafIcon" size={18} color="#4E7D22" />
        </View>

        {/* Leaf beside pickup/delivery */}
        <View style={styles.leafOptionsLeft}>
          <IconSymbol name="LeafIcon" size={24} color="#6A942F" />
        </View>

        {/* Leaf beside cards */}
        <View style={styles.leafOptionsRight}>
          <IconSymbol name="LeafIcon" size={29} color="#4E7D22" />
        </View>

        {/* Leaf above feature strip */}
        <View style={styles.leafFeatureLeft}>
          <IconSymbol name="LeafIcon" size={22} color="#7AA63A" />
        </View>

        {/* Leaf above feature strip right */}
        <View style={styles.leafFeatureRight}>
          <IconSymbol name="LeafIcon" size={20} color="#4E7D22" />
        </View>

        {/* ======================================================
            MAIN HERO
        ====================================================== */}

        <View style={styles.hero}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Image
                source={require("@/assets/images/DeliveryOrPickUpLogo.png")}
                style={styles.logoImage}
              />
            </View>

            <Text style={styles.tagline}>Tap it, Track it, Taste it</Text>
          </View>

          {/* ======================================================
              HERO HEADING
          ====================================================== */}

          <View style={styles.headingContainer}>
            <Text style={styles.delicious}>Delicious</Text>

            <Text style={styles.food}>Food,</Text>

            <Text style={styles.delivered}>Delivered</Text>
          </View>

          {/* ======================================================
              BENEFITS
          ====================================================== */}

          <View style={styles.benefits}>
            {/* Fast */}
            <View style={styles.benefit}>
              <IconSymbol name="LightningBoltIcon" size={22} color="#D9502E" />

              <Text style={styles.benefitText}>Fast.</Text>
            </View>

            {/* Fresh */}
            <View style={styles.benefit}>
              <IconSymbol name="LeafIcon" size={22} color="#0D5C0F" />

              <Text style={styles.benefitText}>Fresh.</Text>
            </View>

            {/* Favorites */}
            <View style={styles.benefit}>
              <IconSymbol name="HeartOutline" size={22} color="#D9502E" />

              <Text style={styles.benefitText}>
                From <Text style={styles.appText}>your favorites.</Text>
              </Text>
            </View>
          </View>

          {/* ======================================================
              PICKUP / DELIVERY
          ====================================================== */}

          <View style={styles.optionContainer}>
            {/* ==================================================
                PICKUP
            ================================================== */}

            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.optionCard, styles.pickupCard]}
              onPress={() => handleSelection(true)}
              disabled={transitionType !== null}
            >
              <View style={styles.optionIconContainer}>
                <IconSymbol name="BagOutline" size={36} color="#D9502E" />
              </View>

              <Text style={styles.optionTitle}>Pick-up</Text>

              <Text style={styles.optionDescription}>
                Order ahead and{"\n"}
                pick up your food{"\n"}
                when it’s ready.
              </Text>

              <View style={styles.arrowButton}>
                <IconSymbol name="ArrowRightIcon" size={20} color="#D9502E" />
              </View>
            </TouchableOpacity>

            {/* ==================================================
                DELIVERY
            ================================================== */}

            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.optionCard, styles.deliveryCard]}
              onPress={() => handleSelection(false)}
              disabled={transitionType !== null}
            >
              <View style={styles.optionIconContainer}>
                <IconSymbol name="DeliveryIcon" size={36} color="#D9502E" />
              </View>

              <Text style={styles.optionTitle}>Delivery</Text>

              <Text style={styles.optionDescription}>
                We bring your{"\n"}
                favorite meals{"\n"}
                to your doorstep.
              </Text>

              <View style={styles.arrowButton}>
                <IconSymbol name="ArrowRightIcon" size={20} color="#D9502E" />
              </View>
            </TouchableOpacity>
          </View>

          {/* ======================================================
              FEATURE STRIP
          ====================================================== */}

          <View style={styles.featureStrip}>
            <Feature
              icon="LightningBoltIcon"
              iconColor="#FFB000"
              title="Fast Delivery"
              description="Lightning fast to your door"
            />

            <Feature
              icon="LeafIcon"
              iconColor="#4CAF50"
              title="Always Fresh"
              description="Hot, tasty & fresh"
            />

            <Feature
              icon="ShieldCheckIcon"
              iconColor="#FFFFFF"
              title="Reliable"
              description="Safe, secure & on time"
            />
          </View>

          {/* Small leaves underneath strip */}
          <View style={styles.leafBottomLeft}>
            <IconSymbol name="LeafIcon" size={25} color="#5C8C27" />
          </View>

          <View style={styles.leafBottomRight}>
            <IconSymbol name="LeafIcon" size={31} color="#6D982E" />
          </View>
        </View>

        {/* ======================================================
            LOCATION CTA
        ====================================================== */}

        <View style={styles.locationSection}>
          {/* Decorative leaves */}

          <View style={styles.leafLocationLeft}>
            <IconSymbol name="LeafIcon" size={32} color="#4E7D22" />
          </View>

          <View style={styles.leafLocationRight}>
            <IconSymbol name="LeafIcon" size={27} color="#6A942F" />
          </View>

          <View style={styles.locationContainer}>
            <View style={styles.locationIcon}>
              <IconSymbol name="LocationDotIcon" size={28} color="#FFB000" />
            </View>

            <Text style={styles.hungryText}>Hungry?</Text>

            <Text style={styles.rightPlaceText}>You’re in the</Text>

            <Text style={styles.rightPlaceHighlight}>right place!</Text>
          </View>
        </View>

        {/* ======================================================
            SOCIAL PROOF
        ====================================================== */}

        <View style={styles.reviewCard}>
          <View>
            <Text style={styles.reviewTitle}>Thousands of dishes.</Text>

            <Text style={styles.reviewSubtitle}>
              One <Text style={styles.appText}>app.</Text>
            </Text>
          </View>

          {/* Avatars */}
          <View style={styles.avatarContainer}>
            <Avatar source={require("@/assets/images/avatar1.png")} />

            <Avatar source={require("@/assets/images/avatar2.png")} />

            <Avatar source={require("@/assets/images/avatar3.png")} />

            <Avatar source={require("@/assets/images/avatar4.png")} />

            <Avatar source={require("@/assets/images/avatar5.png")} />
          </View>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <Text style={styles.lovedText}>
              Loved by{"\n"}
              thousands
            </Text>

            <Text style={styles.rating}>4.8 ⭐</Text>
          </View>
        </View>
      </ScrollView>

      {/* ======================================================
          FULL-SCREEN FOOD CHOICE TRANSITION
      ====================================================== */}

      {transitionType !== null && (
        <FoodChoiceTransition
          type={transitionType}
          onFinish={handleTransitionFinish}
        />
      )}
    </SafeAreaView>
  );
};

/* ======================================================
   FEATURE COMPONENT
====================================================== */

const Feature = ({
  icon,
  iconColor,
  title,
  description,
}: {
  icon: "LightningBoltIcon" | "LeafIcon" | "ShieldCheckIcon";
  iconColor: string;
  title: string;
  description: string;
}) => {
  return (
    <View style={styles.feature}>
      <View style={styles.featureIcon}>
        <IconSymbol name={icon} size={22} color={iconColor} />
      </View>

      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>

        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
};

/* ======================================================
   AVATAR COMPONENT
====================================================== */

const Avatar = ({ source }: { source: any }) => {
  return <Image source={source} style={styles.avatar} />;
};

export default HomeScreen;
