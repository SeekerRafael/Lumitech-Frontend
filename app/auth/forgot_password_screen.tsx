import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import Constants from "expo-constants";
import { theme } from "../../constants/theme";
import { validateEmail } from "../../utils/validators";

const BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
const API_URL = `${BASE_URL}/user`;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const emailErrors = validateEmail(email);
    if (emailErrors.email) {
      Alert.alert("Error", emailErrors.email);
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/forget-password`, { email });

      router.push({
        pathname: "/auth/reset_password_screen",
        params: { userEmail: email },
      });
    } catch (error: any) {
      let message =
        "Si el email está registrado, recibirás un código para restablecer tu contraseña";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      Alert.alert("Información", message);
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
          <Text style={theme.title}>Registro</Text>
          <Text style={theme.label}>
            Ingresa tu email para recibir un código de verificación
          </Text>

          <View style={theme.fieldContainer}>
            <Text style={theme.label}>Correo electrónico:</Text>
            <TextInput
              style={theme.input}
              placeholder="ejemplo@correo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
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
                <Text style={theme.buttonText} onPress={handleSubmit}>
                  Enviar Código
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
