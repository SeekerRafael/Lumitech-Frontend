import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
  Image,
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { theme, colors } from "../../constants/theme";
import { validateEmail, validateToken } from "@/utils/validators";
import { KeyboardAvoidingView, ScrollView, Platform } from "react-native";

const BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
const API_URL = `${BASE_URL}/user`;

export default function VerifyAccountScreen() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [resendEmail, setResendEmail] = useState("");

  const handleVerify = async () => {
    const { token: tokenError } = validateToken(token);
    if (tokenError) {
      Alert.alert("Error", tokenError);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { token });
      Alert.alert(
        "Éxito",
        response.data.message || "Email verificado correctamente",
        [{ text: "OK", onPress: () => router.replace("/auth/login_screen") }]
      );
    } catch (error: any) {
      let errorMessage = "Error al verificar el token";

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status === 422) {
          errorMessage = Array.isArray(data.message)
            ? data.message.join("\n")
            : data.message || "Token inválido o expirado";
        } else if (status === 404) {
          errorMessage = "Usuario no encontrado";
        }
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendToken = async () => {
    const { email: emailError } = validateEmail(resendEmail);
    if (emailError) {
      Alert.alert("Error", emailError);
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/resend-verification`, {
        email: resendEmail,
      });
      Alert.alert("Éxito", "Token reenviado, revisa tu email");
      setModalVisible(false);
      setResendEmail("");
    } catch (error: any) {
      let errorMessage = "No se pudo reenviar el token";

      if (error.response?.data?.message) {
        errorMessage = Array.isArray(error.response.data.message)
          ? error.response.data.message.join("\n")
          : error.response.data.message;
      }

      Alert.alert("Error", errorMessage);
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
          <Text style={theme.title}>Verifica tu cuenta</Text>
          <Text style={theme.label}>
            Ingresa el token de verificación que recibiste en tu email
          </Text>

          <View style={theme.fieldContainer}>
            <TextInput
              style={theme.input}
              placeholder="Token de verificación"
              value={token}
              onChangeText={setToken}
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
              <Pressable
                style={theme.button}
                onPress={handleVerify}
                disabled={!token}
              >
                <Text style={theme.buttonText}>Verificar cuenta</Text>
              </Pressable>
              <View style={{ marginTop: 20, alignItems: "center" }}>
                <Text style={theme.labelText}>¿No recibiste el token?</Text>
                <Pressable onPress={() => setModalVisible(true)}>
                  <Text style={theme.labelText}>Reenviar token</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={theme.modalOverlay}>
          <View style={theme.modalContainer}>
            <Text style={theme.modalTitle}>Reenviar token</Text>
            <TextInput
              style={theme.input}
              placeholder="Ingresa tu email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={resendEmail}
              onChangeText={setResendEmail}
            />
            <View style={theme.modalButtons}>
              <Pressable
                style={theme.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={theme.cancelText}>Cancelar</Text>
              </Pressable>
              <Pressable style={theme.sendButton} onPress={handleResendToken}>
                <Text style={theme.sendText}>Enviar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
