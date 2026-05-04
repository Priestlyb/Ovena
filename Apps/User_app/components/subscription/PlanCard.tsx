import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";

export default function PlanCard({ plan }: any) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.title}>{plan.name}</Text>
        <Text style={styles.price}>{plan.price}</Text>
        <Text style={styles.benefit}>{plan.benefit}</Text>
        <Text style={styles.description}>{plan.description}</Text>
      </View>

      <View style={styles.right}>
        <Image source={plan.image} style={styles.image} resizeMode="contain" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  left: {
    width: "50%",
    gap: 5,
  },
  right: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D9502E",
  },
  benefit: {
    fontSize: 14,
  },
  description: {
    fontSize: 14,
  },
  image: {
    width: "100%",
    marginTop: 50,
  },
});
