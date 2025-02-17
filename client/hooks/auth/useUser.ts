import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { URI_SERVER } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useUser() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const subscription = async () => {
      const accessToken = await AsyncStorage.getItem("access_token");

      const refreshToken = await AsyncStorage.getItem("refresh_token");
      await axios
        .get(`${URI_SERVER}/me`, {
          headers: {
            "access-token": accessToken,
            "refresh-token": refreshToken,
          },
        })
        .then((res) => {
          setUser(res.data.user);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    };
    subscription();
  }, []);
  return { loading, user, error };
}
