import { View, Text, Image, Button, TouchableOpacity } from "react-native";
import React from "react";
import { useFonts } from "expo-font";
import { Inter_700Bold } from "@expo-google-fonts/inter";
import { Nunito_400Regular, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { LinearGradient } from "expo-linear-gradient";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function OnBroadingScreen() {
  let [fontsloaded, fontError] = useFonts({
    Inter_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
  });

  if (!fontError && !fontsloaded) {
    return null;
  }
  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <StatusBar style="dark" />
      <View className="items-center justify-center w-full space-y-4">
        <Image
          source={require("../../assets/images/logo.png")}
          style={{ width: wp("24%"), height: hp("20%") }}
        />
        <Text
          style={{
            textAlign: "center",
            fontFamily: "Inter_700Bold",
            fontSize: hp("4%"),
          }}
        >
          Start Learning with Codemy
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontFamily: "Nunito_400Regular",
            fontSize: hp("3%"),
          }}
          className="text-gray-700 px-4"
        >
          Explore a variety of interactive leasson, video, quiz and puzzle.
        </Text>
        <TouchableOpacity className="w-full mt-5 px-4 ">
          <Text
            style={{ fontFamily: "Nunito_400Regular" }}
            className=" text-lg bg-blue-500 text-white text-center py-3 rounded-lg"
            onPress={() => {
              router.push("/(routes)/welcome-intro");
            }}
          >
            Getting Started
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
