import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import { createStyles } from "@/constants/styles/RestaurantsPage.styles";
import { useTheme } from "@/constants/theme";

type Props = {
  title: string;
  children: React.ReactNode;
  onSeeAll?: () => void;
};

export const Section = ({
  title,
  children,
  onSeeAll,
}: Props) => {
  const theme = useTheme();

  const styles = createStyles(theme);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {title}
        </Text>

        {onSeeAll && (
          <TouchableOpacity
            onPress={onSeeAll}
          >
            <Text style={styles.seeAllText}>
              See All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {children}
    </View>
  );
};