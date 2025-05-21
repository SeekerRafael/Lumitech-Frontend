import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import Constants from "expo-constants";
import { theme } from "../../constants/theme";
import { KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Importar íconos

const BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
const API_URL = `${BASE_URL}/user`;

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

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
            <View
              style={[
                theme.passwordContainer,
                { flexDirection: "row", alignItems: "center" },
              ]}
            >
              <TextInput
                style={[theme.input, { flex: 1 }]}
                placeholder="Nueva contraseña"
                secureTextEntry={!showPassword}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={theme.fieldContainer}>
            <Text style={theme.label}>Confirmar contraseña:</Text>
            <View
              style={[
                theme.passwordContainer,
                { flexDirection: "row", alignItems: "center" },
              ]}
            >
              <TextInput
                style={[theme.input, { flex: 1 }]}
                placeholder="Repite la contraseña"
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
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
          <Pressable onPress={() => router.push("./verify_email")}>
            <Text
              style={{ marginTop: 20, color: "#007AFF", textAlign: "center" }}
            >
              Atras
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
