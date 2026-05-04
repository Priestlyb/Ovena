import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { IconSymbol } from '@/components/ui/icon-symbol'
import FoodOrderTabView from '@/components/FoodOrderTabView'

export default function ResturantsPage() {
  return (
    <View style={styles.container}>
        <View>
      <Image source={require("../../../assets/images/restaurant_header.png")} style={{ width: "100%", height: 275 }} />
      <View style={{ position: "absolute", top: 65, left: 20, backgroundColor: "rgba(255, 255, 255, 0.8)", padding: 8, borderRadius: 20 }}>
      <IconSymbol name="ArrowLeftIcon" size={24} color="#000" />
      </View>
      <View style={{ position: "absolute", top: 65, right: 20, backgroundColor: "rgba(255, 255, 255, 0.8)", padding: 8, borderRadius: 20 }}>
      <IconSymbol name="DotsHorizontalIcon" size={24} color="#000" />
      </View>
      </View>

      
      <View style={{ alignItems: "center", borderTopLeftRadius: 150, borderTopRightRadius: 150, backgroundColor: "#fff", paddingVertical: 30, marginTop: -140 }}>
        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}>Pristina Hotel</Text>
        <Text style={{ fontSize: 14, color: "#666", marginBottom: 10 }}>Shoprite, airport road</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", width: "70%" }}>
            <View style={{ alignItems: "center", marginTop: 20}}>
            <IconSymbol name="StarIcon" size={20} color="#f9d74c" />
            <Text style={{ fontSize: 12, color: "#000" }}>3.7 (1252)</Text>
            </View>
            <View style={{ alignItems: "center", marginTop: 20 }}>
            <IconSymbol name="StoreClockIcon" size={20} color="#000" />
            <Text style={{ fontSize: 12, color: "#000" }}>2.5 km away</Text>
            </View>
        </View>

        <Text style={{ fontSize: 16, color: "#000", marginTop: 20 }}>Open till 8:00pm</Text>
        </View>

        <FoodOrderTabView />

    </View>
  )
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
    container: { flex: 1 },    
})