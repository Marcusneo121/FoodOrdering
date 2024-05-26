import Colors from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { FontAwesome } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";

export default function OrderStack() {
  return (
    <Stack
    // screenOptions={{
    //   headerRight: () => (
    //     <Pressable
    //       onPress={() => {
    //         supabase.auth.signOut();
    //       }}
    //     >
    //       {({ pressed }) => (
    //         <Ionicons
    //           name="exit"
    //           size={25}
    //           color={Colors.light.tint}
    //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
    //         />
    //       )}
    //     </Pressable>
    //   ),
    // }}
    >
      <Stack.Screen name="index" options={{ title: "Orders" }} />
    </Stack>
  );
}
