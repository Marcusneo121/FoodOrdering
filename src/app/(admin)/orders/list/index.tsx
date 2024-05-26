import { View, FlatList, ActivityIndicator, Text } from "react-native";
import OrderListItem from "@/components/OrderListItem";
import { useAdminOrderList } from "@/api/orders";
import {
  useInsertOrderSubscription,
  useUpdateAllOrderSubscription,
} from "@/api/orders/subscription";

const OrderScreen = () => {
  const {
    data: orders,
    isLoading,
    error,
  } = useAdminOrderList({ archived: false });

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
