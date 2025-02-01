import { View, Text, Image } from "react-native";
import React from "react";
import AppIntroSlider from "react-native-app-intro-slider";
import { onboardingSwiperDataType } from "@/types/global";
import { LinearGradient } from "expo-linear-gradient";
import { onboardingSwiperData } from "@/constants/constants";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Nunito_400Regular, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { useFonts } from "expo-font";
import { router } from "expo-router";

export default function WelcomeIntro() {
  let [fontsloaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });

  if (!fontError && !fontsloaded) {
    return null;
  }
  const renderItem = ({ item }: { item: onboardingSwiperDataType }) => {
    return (
      <LinearGradient
        colors={["#E5ECF9", "#F6F7F9", "#E8EEF9"]}
        style={{ flex: 1, paddingHorizontal: 16 }}
      >
        <View style={{ marginTop: 80 }}>
          <Image
            source={item.image}
            style={{
              alignSelf: "center",
              marginBottom: 30,
              height: hp(40),
              width: widthPercentageToDP(90),
              resizeMode: "contain",
            }}
          />
          <Text
            style={{ fontFamily: "Nunito_700Bold" }}
            className="text-center text-xl "
          >
            {item.title}
          </Text>
          <View style={{ marginTop: 15 }}>
            <Text
              style={{ fontFamily: "Nunito_400Regular" }}
              className="text-center text-base"
            >
              {item.description}
            </Text>
            <Text
              style={{ fontFamily: "Nunito_400Regular" }}
              className="text-center text-base "
            >
              {item.sortDescription}
            </Text>
            <Text
              style={{ fontFamily: "Nunito_400Regular" }}
              className="text-center"
            >
              {item.sortDescription2}
            </Text>
          </View>
        </View>
      </LinearGradient>
    );
  };
  return (
    <AppIntroSlider
      data={onboardingSwiperData}
      renderItem={renderItem}
      onDone={() => router.push("/login")}
      onSkip={() => router.push("/login")}
      renderNextButton={() => (
        <View className="bg-blue-500 rounded-lg">
          <Text
            className="text-center py-3 text-white text-xl"
            style={{ fontFamily: "Nunito_400Regular" }}
          >
            Next
          </Text>
        </View>
      )}
      renderDoneButton={() => (
        <View className="bg-blue-500 rounded-lg">
          <Text
            className=" text-center py-3  text-white text-xl"
            style={{ fontFamily: "Nunito_400Regular" }}
          >
            Done
          </Text>
        </View>
      )}
      showSkipButton={false}
      bottomButton={true}
      activeDotStyle={{
        backgroundColor: "#2467Ec",
        width: widthPercentageToDP(3.5),
        height: widthPercentageToDP(3.5),
        borderRadius: 7,
        marginHorizontal: 5,
      }}
      dotStyle={{
        backgroundColor: "#3b82f6",
        width: widthPercentageToDP(3),
        height: widthPercentageToDP(3),
        borderRadius: 5,
        marginHorizontal: 5,
      }}
    />
  );
}
