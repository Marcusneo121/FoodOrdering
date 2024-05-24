import { View, FlatList } from "react-native";
import orders from "@assets/data/orders";
import React from "react";
import OrderListItem from "@/components/OrderListItem";

const OrderScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderListItem order={item} />}
        contentContainerStyle={{ gap: 10, padding: 10 }}
      />
    </View>
  );
};

export default OrderScreen;
