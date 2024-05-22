import { View, Text, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useContext } from "react";
import { CartContext, useCart } from "@/providers/CartProvider";

const CartScreen = () => {
  const { items } = useCart();

  return (
    <View>
      
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
};

export default CartScreen;
