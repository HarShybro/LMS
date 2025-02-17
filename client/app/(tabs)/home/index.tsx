import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

import axios from "axios";
import { URI_SERVER } from "@/utils/uri";

export default function index() {
  const getApicall = async () => {
    await axios
      .get(`${URI_SERVER}call`)
      .then((res) => console.log(res.data.message))
      .catch((err) => console.log(err));
  };
  return (
    <View className="flex-1">
      <Text>Home</Text>
      <TouchableOpacity
        onPress={getApicall}
        className="bg-blue-400 rounded w-20 h-10  self-center"
      >
        <Text className="text-center">Api call</Text>
      </TouchableOpacity>
    </View>
  );
}
