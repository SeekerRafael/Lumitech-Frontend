import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/theme";

const EditRosetaScreen = () => {
  const { rosette_mac, currentUbication } = useLocalSearchParams();
  const ubicationParam = Array.isArray(currentUbication)
  ? currentUbication[0]
  : currentUbication || "";

const [ubication, setUbication] = useState(ubicationParam);
  const router = useRouter();

  const handleUpdateUbication = async () => {
    if (!ubication.trim()) {
      Alert.alert("Error", "La ubicación no puede estar vacía.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");

      const response = await fetch(
        `${process.env.API_BASE_URL || "http://192.168.0.10:3000"}/roseta/change-ubication`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rosette_mac,
            ubication,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar la ubicación.");
      }

      Alert.alert("Éxito", data.msg, [
        {
          text: "OK",
          onPress: () => router.back(), // vuelve al HomeScreen
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Ubicación de la Roseta</Text>

      <Text style={styles.label}>MAC:</Text>
      <Text style={styles.value}>{rosette_mac}</Text>

      <Text style={styles.label}>Nueva Ubicación:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Sala, Cocina, Habitación"
        value={ubication}
        onChangeText={setUbication}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdateUbication}>
        <Ionicons name="save" size={20} color="white" style={{ marginRight: 6 }} />
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditRosetaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.primary,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: colors.colorLetter,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 10,
  },
  input: {
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 8,
    color: colors.colorLetter,
  },
  button: {
    marginTop: 30,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
