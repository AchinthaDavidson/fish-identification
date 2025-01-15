import { COLORS, images } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from "react-native";

export default function sharkScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={[COLORS.blue, COLORS.blue]} style={{ flex: 1 }}>
    <Text>
        Billfish
    </Text>
    </LinearGradient>
  );
}
