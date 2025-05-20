import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  Pressable,
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { theme } from "../../constants/theme";
import { validateEmail } from "../../utils/validators";
import { KeyboardAvoidingView, ScrollView, Platform } from "react-native";

const BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
const API_URL = `${BASE_URL}/user`;

export default function VerifyEmail() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResendVerification = async () => {
    const errors = validateEmail(email);

    if (errors.email) {
      Alert.alert("Error", errors.email);
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/resend-verification`, { email });
      Alert.alert("Éxito", "Correo de verificación enviado");
      router.replace("/auth/verify_account_screen");
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo enviar el correo de verificación. No hay ninguna cuenta con ese correo."
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
          <Text style={theme.title}>Verificar Correo</Text>
          <Text style={theme.label}>
            Ingresa tu correo electrónico para reenviar el correo de
            verificación
          </Text>

          <View style={theme.fieldContainer}>
            <TextInput
              style={theme.input}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
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
              <Pressable
                style={theme.button}
                onPress={handleResendVerification}
                disabled={!email}
              >
                <Text style={theme.buttonText}>Enviar verificación</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
