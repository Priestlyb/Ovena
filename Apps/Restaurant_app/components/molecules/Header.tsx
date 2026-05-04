// components/molecules/Header.tsx
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "../atoms/Text";
import { Icon } from "../atoms/Icon";

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightContent?: React.ReactNode;
  onLeftIconPress?: () => void;
  backgroundColor?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  rightContent,
  onLeftIconPress,
  backgroundColor = "#FFFFFF",
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Left Icon */}
      {leftIcon ? (
        <TouchableOpacity
          onPress={onLeftIconPress}
          activeOpacity={0.7}
          style={styles.leftIcon}
        >
          <Icon icon={leftIcon} size="medium" />
        </TouchableOpacity>
      ) : (
        <View style={styles.sidePlaceholder} />
      )}

      {/* Title & Subtitle */}
      <View style={styles.content}>
        <Text numberOfLines={1} style={{ fontSize: 20, fontWeight: "600" }}>
          {title}
        </Text>

        {subtitle && (
          <Text
            variant="bodySmall"
            color="secondary"
            numberOfLines={1}
            style={styles.subtitle}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right Content */}
      <View style={styles.right}>
        {rightContent ? rightContent : <View style={styles.sidePlaceholder} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    position: "relative",
  },

  leftIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 16,
  },

  sidePlaceholder: {
    width: 40,
    height: 40,
  },

  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    flex: 1,
  },

  subtitle: {
    marginTop: 2,
  },

  right: {
    position: "absolute",
    right: 16,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
