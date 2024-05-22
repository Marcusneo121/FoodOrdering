
import ProductListItem from "@/components/ProductListItem";
import products from "@assets/data/products";
import { View } from "react-native";

export default function MenuScreen() {
  return (
    <View>
      <ProductListItem product={products[5]} />
      <ProductListItem product={products[3]} />
    </View>
  );
}