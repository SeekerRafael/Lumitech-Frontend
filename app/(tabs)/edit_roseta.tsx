import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { theme } from "../../constants/theme";

const BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

const EditRosetaScreen = () => {
  const { rosette_mac, currentUbication } = useLocalSearchParams();
  const router = useRouter();

  const ubicationParam = Array.isArray(currentUbication)
    ? currentUbication[0]
    : currentUbication || "";

  const [ubication, setUbication] = useState(ubicationParam);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateUbication = async () => {
    setError(null);

    const trimmedUbication = ubication.trim();
    if (!trimmedUbication) {
      setError("La ubicación no puede estar vacía.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");

      const response = await fetch(
        `${BASE_URL || "http://192.168.0.10:3000"}/roseta/change-ubication`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rosette_mac,
            ubication: trimmedUbication,
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
          onPress: () => router.back(),
        },
      ]);
    } catch (err: any) {
      setError(err.message || "No se pudo actualizar");
    }
  };

  return (
    <View style={theme.containerTerciario}>
      <Image
        source={require("../../assets/images/logo3.png")}
        style={theme.logoTerciario}
        resizeMode="contain"
      />
      <Text style={theme.title}>Editar Ubicación</Text>

      <Text style={theme.label}>
        MAC: <Text>{rosette_mac}</Text>
      </Text>

      <Text style={theme.label}>Nueva ubicación:</Text>
      <TextInput
        style={[theme.input, error ? theme.errorText : undefined]}
        placeholder="Ej. Sala, Cocina, Habitación"
        value={ubication}
        onChangeText={(text) => {
          setUbication(text);
          if (error) setError(null);
        }}
      />
      {error && <Text style={theme.errorText}>{error}</Text>}

      <View style={theme.buttonsRow}>
        <TouchableOpacity
          style={theme.leftButton}
          onPress={() => router.back()}
        >
          <Text style={theme.buttonTextS}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={theme.rightButton} onPress={handleUpdateUbication}>
          <Text style={theme.buttonTextS}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditRosetaScreen;
