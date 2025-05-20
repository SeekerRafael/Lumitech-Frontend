import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import Constants from "expo-constants";
import { theme } from "../../constants/theme";
import { KeyboardAvoidingView, ScrollView, Platform } from "react-native";

const BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
const API_URL = `${BASE_URL}/user`;

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const userEmail = params.userEmail as string;

  const handleReset = async () => {
    if (!token || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Todos los campos son requeridos");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/reset-password`, {
        token,
        userNewPassword: newPassword,
      });

      Alert.alert("Éxito", "Contraseña actualizada correctamente", [
        { text: "OK", onPress: () => router.replace("/auth/login_screen") },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        "Código inválido o expirado. Por favor solicita uno nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        <View style={theme.container}>
          <Image
            source={require("../../assets/images/logo3.png")}
            style={theme.logoSecundario}
            resizeMode="contain"
          />
          <Text style={theme.appNameS}>Lumitech</Text>
          <Text style={theme.title}>Restablecer Contraseña</Text>
          <Text style={theme.label}>Código enviado a: {userEmail}</Text>

          <View style={theme.fieldContainer}>
            <Text style={theme.label}>Código de verificación:</Text>
            <TextInput
              style={theme.input}
              placeholder="Ingresa el código"
              value={token}
              onChangeText={setToken}
              autoCapitalize="none"
            />
          </View>

          <View style={theme.fieldContainer}>
            <Text style={theme.label}>Nueva contraseña:</Text>
            <TextInput
              style={theme.input}
              placeholder="Nueva contraseña"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>

          <View style={theme.fieldContainer}>
            <Text style={theme.label}>Confirmar contraseña:</Text>
            <TextInput
              style={theme.input}
              placeholder="Repite la contraseña"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {loading ? (
            <ActivityIndicator
              style={theme.loader}
              size="large"
              color="#007AFF"
            />
          ) : (
            <View style={theme.buttonContainer}>
              <View style={theme.button}>
                <Text style={theme.buttonText} onPress={handleReset}>
                  Restablecer Contraseña
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
