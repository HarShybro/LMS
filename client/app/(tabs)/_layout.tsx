import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import useUser from "@/hooks/auth/useUser";

const TabLayout = () => {
  const { loading, user } = useUser();
  return (
    <Tabs>
      <Tabs.Screen name="courses/index" />
      <Tabs.Screen name="home/index" />
      <Tabs.Screen name="profile/index" />
      <Tabs.Screen name="search/index" />
    </Tabs>
  );
};

export default TabLayout;
