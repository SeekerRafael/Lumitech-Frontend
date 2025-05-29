import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { StorageService } from "../../services/storage.service";
import { theme } from "../../constants/theme";
import { useRouter } from "expo-router";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
const ESP32_URL = Constants.expoConfig?.extra?.ESP32_URL;

const RegisterRosettaScreen = () => {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ip, setIp] = useState<string | null>(null);
  const [loadingIp, setLoadingIp] = useState(false);
  const router = useRouter();

 const sendCredentialsToESP32 = async () => {
  setError(null);
  if (!ssid.trim() || !password.trim()) {
    setError("SSID y contraseña no pueden estar vacíos.");
    return;
  }

  Alert.alert("Info", "Enviando credenciales al ESP32...");
  try {
    const response = await fetch(`${ESP32_URL}/set-wifi-credentials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wifi_ssid: ssid.trim(),
        wifi_password: password.trim(),
      }),
    });

    const data = await response.json();
    Alert.alert("Respuesta del ESP32", data.message || "Sin mensaje");


      waitForRosettaIp();

  } catch (err) {
    
     waitForRosettaIp();
  }
};

const waitForRosettaIp = async () => {
  console.log("Esperando IP de la roseta...");

  setLoadingIp(true);
  let retries = 20;
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  while (retries > 0) {
    try {
      const response = await axios.get(`${BASE_URL}/roseta/stored-ip`);
      const rosettaIp = response.data?.ip; 

      if (rosettaIp) {
        setIp(rosettaIp);
        setLoadingIp(false);
        Alert.alert("IP recibida", `La IP de la roseta es: ${rosettaIp}`);
        return;
      }
    } catch (err) {
      console.log("Esperando IP...");
    }

    await delay(1000);
    retries--;
  }

  setLoadingIp(false);
  Alert.alert("Error", "No se pudo obtener la IP de la roseta a tiempo.");
};


  const registerRosetta = async () => {
    setError(null);
    try {
      const token = await StorageService.getItem("userToken");
      const response = await axios.post(
        `${BASE_URL}/roseta/register`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Registro exitoso", response.data.msg);
      router.replace("/home_screen");
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo registrar la roseta. Verifica tus credenciales."
      );
    }
  };

   return (
    <View style={theme.containerTerciario}>
      <Image
        source={require("../../assets/images/logo3.png")}
        style={theme.logoTerciario}
        resizeMode="contain"
      />
      <Text style={theme.title}>Registrar Roseta</Text>

      <Text style={theme.label}>SSID:</Text>
      <TextInput
        style={[theme.input, error ? theme.errorText : undefined]}
        value={ssid}
        onChangeText={(text) => {
          setSsid(text);
          if (error) setError(null);
        }}
        placeholder="Nombre de tu red WiFi"
      />

      <Text style={theme.label}>Contraseña:</Text>
      <TextInput
        style={[theme.input, error ? theme.errorText : undefined]}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (error) setError(null);
        }}
        placeholder="Contraseña WiFi"
        secureTextEntry
      />

      {loadingIp && <ActivityIndicator size="large" color="#0000ff" />}
      {ip && (
        <Text style={{ marginTop: 10, fontWeight: "bold" }}>
          IP recibida: {ip}
        </Text>
      )}

      {error && <Text style={theme.errorText}>{error}</Text>}

      <TouchableOpacity
        style={theme.buttonRegister}
        onPress={sendCredentialsToESP32}
        disabled={loadingIp}
      >
        <Text style={theme.buttonRegisterText}>
          Enviar credenciales al ESP32
        </Text>
      </TouchableOpacity>

    
      <TouchableOpacity
        style={[theme.buttonRegister, { marginTop: 15 }]}
        onPress={registerRosetta}
      >
        <Text style={theme.buttonRegisterText}>Registrar Roseta</Text>
      </TouchableOpacity>
    </View>
  );

};

export default RegisterRosettaScreen;
