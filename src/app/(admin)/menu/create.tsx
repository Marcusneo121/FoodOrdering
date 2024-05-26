import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import { defaultPizzaImage } from "@/components/ProductListItem";
import Colors from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from "@/api/products";

import * as FileSystem from "expo-file-system";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import { randomUUID } from "expo-crypto";
import RemoteImage from "@/components/RemoteImage";

const CreateProductScreen = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isLocalImage, setIsLocalImage] = useState(false);

  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(
    typeof idString === "string" ? idString : idString?.[0]
  );
  const isUpdating = !!idString;

  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { data: updatingProduct } = useProduct(id);
  const { mutate: deleteProduct } = useDeleteProduct();

  const router = useRouter();

  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setImage(updatingProduct.image);
    }
  }, [updatingProduct]);

  const resetFields = () => {
    setName("");
    setPrice("");
    setErrors("");
  };

  const validateInput = () => {
    setErrors("");
    if (!name) {
      setErrors("Name is required.");
      return false;
    }
    if (!price) {
      setErrors("Price is required.");
      return false;
    }
    if (isNaN(parseFloat(price))) {
      setErrors("Price is not a number.");
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    setIsSubmitting(true);
    if (isUpdating) {
      onUpdate();
    } else {
      onCreate();
    }
    setIsSubmitting(false);
  };

  const onCreate = async () => {
    if (!validateInput()) {
      return;
    }

    const imagePath = await uploadImage();

    // Save in the database
    insertProduct(
      { name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
  };

  const onUpdate = async () => {
    if (!validateInput()) {
      return;
    }
    
    const imagePath = await uploadImage();

    updateProduct(
      { id, name, price: parseFloat(price), image: imagePath },
      {
        onSuccess() {
          resetFields();
          router.back();
        },
      }
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setIsLocalImage(true);
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image?.startsWith("file://")) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = "image/png";

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, decode(base64), { contentType });

    if (data) {
      return data.path;
    }
  };

  const onDelete = () => {
    deleteProduct(id, {
      onSuccess: () => {
        resetFields();
        router.replace("/(admin)");
      },
    });
  };

  const confirmDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this product?", [
      {
        text: "Cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: onDelete,
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isUpdating ? "Update Product" : "Create Product" }}
      />

      {isLocalImage ? (
        <Image
          source={{ uri: image || defaultPizzaImage }}
          style={styles.image}
        />
      ) : (
        <RemoteImage
          // source={{ uri: product.image || defaultPizzaImage }}
          path={image}
          fallback={defaultPizzaImage}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      <Text onPress={pickImage} style={styles.textButton}>
        Select Image
      </Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        placeholder="Name"
        style={styles.input}
        onChangeText={setName}
      />

      <Text style={styles.label}>Price ($)</Text>
      <TextInput
        value={price}
        placeholder="9.99"
        style={styles.input}
        keyboardType="numeric"
        onChangeText={setPrice}
      />

      <Text style={{ color: "red" }}>{errors}</Text>
      <Button
        onPress={onSubmit}
        text={
          isUpdating
            ? isSubmitting
              ? "Updating..."
              : "Update"
            : isSubmitting
            ? "Creating..."
            : "Create"
        }
        disabled={isSubmitting}
      />
      {isUpdating && (
        <Text onPress={confirmDelete} style={styles.textButton}>
          Delete
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    padding: 15,
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 20,
  },
  label: {
    color: "gray",
    fontSize: 16,
  },
  image: {
    width: "50%",
    aspectRatio: 1,
    alignSelf: "center",
  },
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.light.tint,
    marginVertical: 10,
  },
});

export default CreateProductScreen;
