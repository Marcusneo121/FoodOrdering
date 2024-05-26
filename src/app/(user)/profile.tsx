import { View, Text, Button } from "react-native";
import React from "react";
import { supabase } from "@/lib/supabase";

const ProfileScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Button
        title="Sign out"
        onPress={async () => {
          await supabase.auth.signOut();
        }}
      ></Button>
    </View>
  );
};

export default ProfileScreen;
