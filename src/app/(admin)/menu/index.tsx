import { useProductList } from "@/api/products";
import ProductListItem from "@/components/ProductListItem";
import { View, FlatList, ActivityIndicator, Text } from "react-native";

export default function MenuScreen() {
  const { data: products, error, isLoading } = useProductList();

  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  if (error) {
    return <Text>Failed to fetch products.</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductListItem product={item} />}
        numColumns={2}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        columnWrapperStyle={{ gap: 10 }}
      />
    </View>
  );
}
