import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { registerUser } from "../../services/api";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { theme, colors } from "../../constants/theme";

export default function RegisterScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    userName: "",
    userLastName: "",
    userNickName: "",
    userEmail: "",
    userPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleRegister = async () => {
    const newErrors: { [key: string]: string } = {};

    if (formData.userPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setErrors({});
      setIsLoading(true);
      const { confirmPassword, ...payload } = formData;
      await registerUser(payload);
      Alert.alert("Éxito", "Usuario registrado correctamente");
      router.replace("/auth/verify_account_screen");
    } catch (error: any) {
      if (error?.response?.data?.message) {
        const messages = error.response.data.message;
        const formattedErrors: { [key: string]: string } = {};

        messages.forEach((msg: string) => {
          if (msg.includes("nombre")) formattedErrors.userName = msg;
          else if (msg.includes("apellido")) formattedErrors.userLastName = msg;
          else if (msg.includes("nickname")) formattedErrors.userNickName = msg;
          else if (msg.includes("correo")) formattedErrors.userEmail = msg;
          else if (msg.includes("contraseña"))
            formattedErrors.userPassword = msg;
        });

        setErrors(formattedErrors);
      } else {
        console.log("Error", "No se pudo registrar el usuario");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Image
          source={require("../../assets/images/logo3.png")}
          style={theme.logoSecundario}
          resizeMode="contain"
        />
        <Text style={theme.appNameS}>Lumitech</Text>
        <Text style={theme.title}>Registro</Text>

        {[
          { name: "userName", label: "Nombre", keyboardType: "default" },
          { name: "userLastName", label: "Apellido", keyboardType: "default" },
          {
            name: "userNickName",
            label: "Nombre de Usuario",
            keyboardType: "default",
          },
          {
            name: "userEmail",
            label: "Correo Electrónico",
            keyboardType: "email-address",
          },
        ].map(({ name, label, keyboardType }) => (
          <View key={name} style={theme.fieldContainer}>
            <Text style={theme.label}>{label}</Text>
            <TextInput
              style={theme.input}
              keyboardType={keyboardType as any}
              value={(formData as any)[name]}
              onChangeText={(text) => handleChange(name, text)}
            />
            {errors[name] && (
              <Text style={theme.errorText}>{errors[name]}</Text>
            )}
          </View>
        ))}

        <View style={theme.fieldContainer}>
          <Text style={theme.label}>Contraseña</Text>
          <View style={theme.passwordContainer}>
            <TextInput
              style={theme.passwordInput}
              placeholder="Contraseña"
              secureTextEntry={!showPassword}
              value={formData.userPassword}
              onChangeText={(text) => handleChange("userPassword", text)}
            />
            <TouchableOpacity
              style={theme.iconButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons
                name={showPassword ? "visibility-off" : "visibility"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
          {errors.userPassword && (
            <Text style={theme.errorText}>{errors.userPassword}</Text>
          )}
        </View>

        <View style={theme.fieldContainer}>
          <Text style={theme.label}>Confirmar Contraseña</Text>
          <View style={theme.passwordContainer}>
            <TextInput
              style={theme.passwordInput}
              placeholder="Confirmar Contraseña"
              secureTextEntry={!showPassword}
              value={formData.confirmPassword}
              onChangeText={(text) => handleChange("confirmPassword", text)}
            />
            <TouchableOpacity
              style={theme.iconButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons
                name={showPassword ? "visibility-off" : "visibility"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text style={theme.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={theme.loader}
          />
        ) : (
          <TouchableOpacity style={theme.button} onPress={handleRegister}>
            <Text style={theme.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
