import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState } from "react";
import { styled } from "nativewind";
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
import { router, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { URI_SERVER } from "@/utils/uri";
import Toast from "react-native-toast-message";

export default function VerifyAccountScreen() {
  const { goBack } = useNavigation();
  const [code, setCode] = useState(new Array(4).fill(""));
  const [buttonSpinner, setButtonSpinner] = useState(false);

  const input = useRef<any>([...Array(4)].map(() => React.createRef()));

  const handleInput = (text: string, index: number) => {
    setCode((prevCode) => {
      const newCode = [...prevCode];
      newCode[index] = text;

      if (text && index < 3) {
        setTimeout(() => {
          input.current[index + 1].current.focus();
        }, 100);
      }

      if (text === "" && index > 0) {
        setTimeout(() => {
          input.current[index - 1].current.focus();
        }, 100);
      }

      return newCode;
    });
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

  const Container = styled(View, "flex-1 items-center justify-center px-3");
  const { width } = Dimensions.get("screen");

  async function handleSubmit() {
    setButtonSpinner(true);
    const otp = code.join("");

    const activation_token = await AsyncStorage.getItem("Activation_token");

    await axios
      .post(`${URI_SERVER}/activation-user`, {
        activation_token,
        activation_code: otp,
      })
      .then((res) => {
        setButtonSpinner(false);
        setCode(new Array(4).fill(""));
        Toast.show({
          type: "success",
          text1: res.data.success,
          text2: "Your Account is created Successfully",
          position: "bottom",
          visibilityTime: 4000,
        });
        console.log(res.data);
        router.push("/(routes)/login");
      })
      .catch((err) => {
        setButtonSpinner(false);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Your otp is invalid or expired!! (Retry)",
          position: "bottom",
          visibilityTime: 4000,
        });
      });
  }

  return (
    <Container style={{ gap: 10 }}>
      <Text
        className="text-3xl "
        style={{
          fontFamily: "Nunito_700Bold",
        }}
      >
        Verification Code
      </Text>
      <Text
        className="text-slate-600 text-center mb-2 "
        style={{ fontFamily: "Nunito_500Medium" }}
      >
        We have sent the verification code to your email address
      </Text>
      <View className=" flex-row space-x-3 ">
        {code.map((_, index) => (
          <TextInput
            className="border border-gray-300 text-xl px-3 py-2 rounded-md text-center"
            key={index}
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={(text) => handleInput(text, index)}
            value={code[index]}
            ref={input.current[index]}
            returnKeyType="done"
            autoFocus={index === 0}
          />
        ))}
      </View>
      <View>
        <TouchableOpacity
          className="bg-blue-500 mt-4 rounded"
          style={{ width: width * 1 - 150 }}
          onPress={handleSubmit}
        >
          {buttonSpinner ? (
            <ActivityIndicator size={"small"} color={"white"} />
          ) : (
            <Text
              className="text-white py-2 text-center text-xl"
              style={{ fontFamily: "Nunito_700Bold" }}
            >
              Submit
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => goBack()}>
          <Text
            className="w-full text-center mt-4"
            style={{ fontFamily: "Nunito_700Bold" }}
          >
            Go Back to Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
}
