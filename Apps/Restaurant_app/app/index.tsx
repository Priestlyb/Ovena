import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'



export default function index() {
  const router = useRouter()

  return (
   

    <View style={styles.container}>
        <Image
        style={styles.image}
        source={require("../assets/images/Resturant_logo 1.png")}
        />
        <Text style={styles.text1} >
            Grow your Restaurant with Ovena
        </Text>
        <Text style={styles.text2}>
           Upload your menus, reach new customers, and boost your sales - all in one app
        </Text>

        <TouchableOpacity style={styles.upload} onPress={() => router.push("/superForm")}>
            <Text style={styles.textupload}>
                Upload Menu
            </Text>
        </TouchableOpacity>
        <Pressable>
            <Text style={styles.login}>
                Login to Account
            </Text>
        </Pressable>

        <Image
        style={styles.homeImage}
         source={require("../assets/images/Resturant_homeImg 1.png")}/>
    </View>

  )
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F65513",
        gap: 25
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: "contain"
    },
    text1: {
        color: "#ffffff",
        fontWeight: "semibold",
        fontSize: 20,
   
    },
    text2: {
        color: "#ffffff",
        fontWeight: "500",
        fontSize: 14,
        width: 290,
        textAlign: "center"
        
    },
    textupload: {
        fontSize: 22,
        fontWeight: 600,
            textAlign: "center"
    },
    upload: {
        width: "75%",
        backgroundColor: "#ffffff",
        paddingHorizontal: 30,
        borderRadius: 20,
        paddingVertical: 10
    },
    login: {
        color: "#ffffff",
        fontWeight: "600"
    },
    homeImage:{
        height: "40%",
        width: "99%"
    }
})