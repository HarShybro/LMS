import {
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useFonts } from "expo-font";
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import { Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { useRouter } from "expo-router";

export default function ForgotPassword() {
  const { navigate, back } = useRouter();
  const { width } = Dimensions.get("window");
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
    <View className="flex-1 items-center justify-center px-5 gap-4 bg-white">
      <Text className="text-2xl" style={{ fontFamily: "Nunito_500Medium" }}>
        Reset Email Password
      </Text>
      <View className="flex-row bg-white rounded items-centers px-2 border">
        <TextInput
          className="px-2 py-3 text-gray-700 overflow-scroll flex-1 w-24 text-base"
          keyboardType="email-address"
          placeholder="Username@gmail.com"
          selectionHandleColor={"yellow"}
          cursorColor={"red"}
        />
      </View>
      <TouchableOpacity
        className="bg-blue-500 rounded"
        style={{ width: width * 1 - 120 }}
      >
        <Text
          className="text-white py-2 text-center text-xl "
          style={{ fontFamily: "Nunito_500Medium" }}
        >
          Send
        </Text>
      </TouchableOpacity>
      <View className="flex-row">
        <Text style={{ fontFamily: "Nunito_500Medium" }} className="text-base">
          Back To?{" "}
        </Text>
        <TouchableOpacity onPress={() => back()}>
          <Text
            style={{ fontFamily: "Nunito_500Medium" }}
            className="text-blue-500 text-base"
          >
            Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
