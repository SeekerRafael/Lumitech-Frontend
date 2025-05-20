import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../hooks/useAuth";
import { MaterialIcons } from "@expo/vector-icons";
import { theme, colors } from "../../constants/theme";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading: authLoading } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isEmail, setIsEmail] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (!identifier || !password) {
      setErrorMessage("Por favor completa todos los campos");
      return;
    }

    setErrorMessage("");
    setIsLoggingIn(true);

    try {
      await login(identifier, password, isEmail);
      router.replace("/(tabs)/home_screen");
    } catch (error: any) {
      let message = "Error al iniciar sesión";
      if (error.response) {
        switch (error.response.status) {
          case 401:
            message = "Credenciales incorrectas";
            break;
          case 403:
            message = "Por favor verifica tu email antes de iniciar sesión";
            break;
          case 404:
            message = "Usuario no encontrado";
            break;
          default:
            message = error.response.data?.message || message;
        }
      }
      setErrorMessage(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={theme.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("../../assets/images/logo3.png")}
          style={theme.logoSecundario}
          resizeMode="contain"
        />

        <Text style={theme.appNameS}>Lumitech</Text>
        <Text style={theme.title}>Iniciar Sesión</Text>

        <View style={theme.toggleContainer}>
          <TouchableOpacity
            style={[theme.toggleButton, !isEmail && theme.activeToggle]}
            onPress={() => setIsEmail(false)}
          >
            <Text
              style={[theme.toggleText, !isEmail && theme.activeToggleText]}
            >
              Nickname
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[theme.toggleButton, isEmail && theme.activeToggle]}
            onPress={() => setIsEmail(true)}
          >
            <Text style={[theme.toggleText, isEmail && theme.activeToggleText]}>
              Email
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={theme.label}>
          {isEmail ? "Correo electrónico" : "Nombre de usuario"}
        </Text>
        <TextInput
          style={theme.input}
          placeholder={isEmail ? "Correo electrónico" : "Nombre de usuario"}
          value={identifier}
          onChangeText={(text) => {
            setIdentifier(text);
            setErrorMessage("");
          }}
          autoCapitalize="none"
          keyboardType={isEmail ? "email-address" : "default"}
        />

        <Text style={theme.label}>Contraseña</Text>
        <View style={theme.passwordContainer}>
          <TextInput
            style={{ flex: 1, padding: 10 }}
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrorMessage("");
            }}
            autoComplete="password"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ padding: 10 }}
          >
            <MaterialIcons
              name={showPassword ? "visibility-off" : "visibility"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/auth/forgot_password_screen")}
        >
          <Text
            style={{
              alignSelf: "flex-end",
              color: colors.primary,
              marginVertical: 10,
            }}
          >
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

        {errorMessage !== "" && (
          <Text
            style={{
              color: colors.error,
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            {errorMessage}
          </Text>
        )}

        {authLoading || isLoggingIn ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <>
            <TouchableOpacity style={theme.button} onPress={handleLogin}>
              <Text style={theme.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <View style={{ marginTop: 20, alignItems: "center" }}>
              <Text style={{ color: "#666" }}>¿No tienes una cuenta?</Text>
              <TouchableOpacity
                onPress={() => router.push("/auth/register_screen")}
              >
                <Text style={{ color: colors.primary, marginTop: 5 }}>
                  Regístrate
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/auth/verify_email")}
              style={{ marginTop: 20 }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: colors.primary,
                  textDecorationLine: "underline",
                }}
              >
                ¿No has verificado tu correo? Verificar ahora
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
