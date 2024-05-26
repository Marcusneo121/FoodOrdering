import { View, FlatList, ActivityIndicator, Text } from "react-native";
import React from "react";
import OrderListItem from "@/components/OrderListItem";
import { useMyOrderList } from "@/api/orders";
import {
  useInsertOrderSubscription,
  useUpdateAllOrderSubscription,
  useUpdateOrderSubscription,
} from "@/api/orders/subscription";

const OrderScreen = () => {
  const { data: orders, isLoading, error } = useMyOrderList();

  useInsertOrderSubscription();
  useUpdateAllOrderSubscription();

  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  if (error) {
    return <Text>Failed to fetch orders</Text>;
  }

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
