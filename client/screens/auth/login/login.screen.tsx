import {
  View,
  Text,
  Image,
  ScrollView,
  Platform,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import {
  useFonts,
  Inter_700Bold,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_700Bold,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito";
import { LinearGradient } from "expo-linear-gradient";

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Entypo, FontAwesome, Fontisto, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function LoginScreen() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [required, setRequired] = useState("");
  const [error, setError] = useState({ password: "" });

  let handlePasswordValidation = (value: string) => {
    const password = value;
    const passwordSpecialCharacter = /(?=.*[!@#$&*])/;
    const passwordOneNumber = /(?=.*[0-9])/;
    const passwordSixValue = /(?=.{6,})/;

    if (!passwordSpecialCharacter.test(password)) {
      setError({
        ...error,
        password: "Write the atleat one special character",
      });
      setUserInfo({ ...userInfo, password: "" });
    } else if (!passwordOneNumber.test(password)) {
      setError({ ...error, password: "Write atleast one number" });
      setUserInfo({ ...userInfo, password: "" });
    } else if (!passwordSixValue.test(password)) {
      setError({ ...error, password: "Write atleast minimum 6 digit number" });
      setUserInfo({ ...userInfo, password: "" });
    } else {
      setError({ ...error, password: "" });
      setUserInfo({ ...userInfo, password: value });
    }
  };

  const handleSignIn = () => {
    router.push("/(routes)/verifyAccount");
  };

  const [fontsload, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_700Bold,
    Nunito_600SemiBold,
    Inter_700Bold,
    Inter_600SemiBold,
  });

  if (!fontsload && !fontError) {
    return null;
  }

  return (
    <LinearGradient
      colors={["#e0f2fe", "#dbeafe"]}
      style={{
        flex: 1,
        paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StatusBar barStyle={"dark-content"} />
      <ScrollView
        className="w-full px-6 flex space-y-2 bg-blue"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 20,
        }}
      >
        <Image
          source={require("@/assets/images/login.png")}
          style={{
            width: widthPercentageToDP(60),
            height: heightPercentageToDP(30),
            objectFit: "fill",
            borderRadius: 120,
            marginHorizontal: "auto",
            marginBottom: 10,
          }}
        />

        <>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Inter_700Bold",
            }}
            className="text-lg "
          >
            Welcome Back!
          </Text>
          <Text
            style={{ textAlign: "center", fontFamily: "Nunito_600SemiBold" }}
            className="text-sm"
          >
            Login to your existing accound of Codemy
          </Text>
        </>
        <View className="pt-4 space-y-3 ">
          <View className="flex-row bg-white rounded items-centers px-2">
            <Fontisto
              name="email"
              size={18}
              color="gray"
              style={{
                alignSelf: "center",
              }}
            />
            <TextInput
              className="px-2 py-2 text-gray-700 overflow-scroll flex-1 "
              keyboardType="email-address"
              value={userInfo.email}
              placeholder="support@becodemy.com"
              onChangeText={(value) => {
                setUserInfo({ ...userInfo, email: value });
              }}
              selectionHandleColor={"yellow"}
              cursorColor={"red"}
            />
          </View>
          {required && (
            <View>
              <Entypo name="cross" size={18} color={"red"} />
            </View>
          )}
          <View className="flex-row bg-white rounded items-centers px-2">
            <Fontisto
              name="locked"
              size={18}
              color="gray"
              style={{
                alignSelf: "center",
              }}
            />
            <TextInput
              className="px-3 py-2 overflow-scroll flex-1 text-gray-700"
              placeholder="********"
              secureTextEntry={!isPasswordVisible}
              defaultValue=""
              onChangeText={handlePasswordValidation}
            />
            <TouchableOpacity
              className="self-center"
              onPress={() => setPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? (
                <Ionicons name="eye-off-outline" size={23} color={"#747474"} />
              ) : (
                <Ionicons name="eye-outline" size={23} color={"#747474"} />
              )}
            </TouchableOpacity>
          </View>
          {error.password && (
            <View className="flex-row items-center">
              <Entypo name="cross" size={22} color={"red"} />
              <Text className="text-red-500">{error.password}</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => router.push("/(routes)/forgot-password")}
          >
            <Text
              className="text-right"
              style={{ fontFamily: "Nunito_600SemiBold" }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSignIn}
            className="bg-blue-500 rounded py-3"
          >
            {buttonSpinner ? (
              <ActivityIndicator size={"small"} color={"white"} />
            ) : (
              <Text
                className="text-center text-white"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center space-x-4">
            <TouchableOpacity>
              <FontAwesome name="google" size={30} color={"gray"} />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome name="github" size={30} color={"gray"} />
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center space-x-2">
            <Text style={{ fontFamily: "Nunito_500Medium" }}>
              Don't have an Account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/(routes)/sign-up")}>
              <Text
                style={{ fontFamily: "Nunito_700Bold" }}
                className="text-blue-500"
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
