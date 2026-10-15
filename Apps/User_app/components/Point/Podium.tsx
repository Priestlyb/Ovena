import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "../ui/icon-symbol";
import { useTheme } from "@/constants/theme";

interface PodiumUser {
  rank: number;
  name: string;
  points: number;
  avatar?: string | null;
}

interface PodiumProps {
  first?: PodiumUser;
  second?: PodiumUser;
  third?: PodiumUser;
}

const PodiumCard = ({
  user,
  place,
}: {
  user?: PodiumUser;
  place: 1 | 2 | 3;
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  if (!user) return <View style={{ flex: 1 }} />;

  const icon =
    place === 1 ? (
      <IconSymbol name="CrownIcon" size={22} color={theme.warning} />
    ) : place === 2 ? (
      <IconSymbol name="MedalIcon" size={22} color="#BFC5CE" />
    ) : (
      <IconSymbol name="TrophyIcon" size={22} color="#CD7F32" />
    );

  const pedestalHeight = place === 1 ? 95 : place === 2 ? 70 : 55;

  return (
    <View
      style={[
        styles.column,
        {
          marginTop: place === 1 ? 0 : 40,
        },
      ]}
    >
      {icon}

      <View style={styles.avatarWrapper}>
        {user.avatar ? (
          <Image
            source={{
              uri: user.avatar,
            }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <IconSymbol
              name="UserOutlineIcon"
              size={28}
              color={theme.textSecondary}
            />
          </View>
        )}
      </View>

      <Text numberOfLines={1} style={styles.name}>
        {user.name}
      </Text>

      <Text style={styles.points}>{user.points.toLocaleString()}</Text>

      <Text style={styles.pointsLabel}>pts</Text>

      <View
        style={[
          styles.pedestal,
          {
            height: pedestalHeight,
            backgroundColor: place === 1 ? theme.primary : theme.surface,
          },
        ]}
      >
        <Text
          style={[
            styles.place,
            {
              color: place === 1 ? theme.background : theme.textPrimary,
            },
          ]}
        >
          {place}
        </Text>
      </View>
    </View>
  );
};

const Podium: React.FC<PodiumProps> = ({ first, second, third }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <PodiumCard user={second} place={2} />

      <PodiumCard user={first} place={1} />

      <PodiumCard user={third} place={3} />
    </View>
  );
};

export default Podium;

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      paddingHorizontal: 20,
      marginTop: 30,
      marginBottom: 25,
    },

    column: {
      flex: 1,
      alignItems: "center",
    },

    avatarWrapper: {
      marginTop: 10,
      marginBottom: 10,
    },

    avatar: {
      width: 70,
      height: 70,
      borderRadius: 35,
    },

    avatarPlaceholder: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: theme.surface,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },

    name: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.textPrimary,
      marginTop: 4,
      textAlign: "center",
    },

    points: {
      fontSize: 18,
      fontWeight: "800",
      color: theme.primary,
      marginTop: 4,
    },

    pointsLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 10,
    },

    pedestal: {
      width: "85%",
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      justifyContent: "center",
      alignItems: "center",
    },

    place: {
      fontSize: 26,
      fontWeight: "900",
    },
  });
