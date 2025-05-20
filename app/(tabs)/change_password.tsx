import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthService } from "../auth/auth.service";
import { theme } from "../../constants/theme";
import {
  validatePasswordReset,
  PasswordResetErrors,
} from "../../utils/validators";

const ChangePasswordScreen = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validateInputs = () => {
    const validationErrors: PasswordResetErrors = validatePasswordReset(
      newPassword,
      confirmPassword
    );
    const newErrors = { ...validationErrors };

    if (!currentPassword.trim()) {
      newErrors.currentPassword = "La contraseña actual no puede estar vacía.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateInputs()) return;

    try {
      await AuthService.changePassword(currentPassword, newPassword);
      Alert.alert("Éxito", "Contraseña actualizada");
      router.back();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "No se pudo cambiar la contraseña"
      );
    }
  };

  return (
    <View style={theme.containerTerciario}>
      <Image
        source={require("../../assets/images/logo3.png")}
        style={theme.logoSecundario}
        resizeMode="contain"
      />
      <Text style={theme.title}>Cambiar Contraseña</Text>

      <Text style={theme.label}>Contraseña actual:</Text>
      <View style={theme.passwordContainer}>
        <TextInput
          secureTextEntry={!showCurrentPassword}
          style={theme.passwordInput}
          value={currentPassword}
          onChangeText={(text) => {
            setCurrentPassword(text);
            if (errors.currentPassword) {
              setErrors((prev) => ({ ...prev, currentPassword: undefined }));
            }
          }}
        />
        <TouchableOpacity
          style={theme.iconButton}
          onPress={() => setShowCurrentPassword(!showCurrentPassword)}
        >
          <MaterialIcons
            name={showCurrentPassword ? "visibility-off" : "visibility"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      {errors.currentPassword && (
        <Text style={theme.errorText}>{errors.currentPassword}</Text>
      )}

      <Text style={theme.label}>Nueva contraseña:</Text>
      <View style={theme.passwordContainer}>
        <TextInput
          secureTextEntry={!showNewPassword}
          style={theme.passwordInput}
          value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text);
            if (errors.newPassword) {
              setErrors((prev) => ({ ...prev, newPassword: undefined }));
            }
          }}
        />
        <TouchableOpacity
          style={theme.iconButton}
          onPress={() => setShowNewPassword(!showNewPassword)}
        >
          <MaterialIcons
            name={showNewPassword ? "visibility-off" : "visibility"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      {errors.newPassword && (
        <Text style={theme.errorText}>{errors.newPassword}</Text>
      )}

      <Text style={theme.label}>Confirmar nueva contraseña:</Text>
      <View style={theme.passwordContainer}>
        <TextInput
          secureTextEntry={!showConfirmPassword}
          style={theme.passwordInput}
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errors.confirmPassword) {
              setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }
          }}
        />
        <TouchableOpacity
          style={theme.iconButton}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <MaterialIcons
            name={showConfirmPassword ? "visibility-off" : "visibility"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword && (
        <Text style={theme.errorText}>{errors.confirmPassword}</Text>
      )}

      <View style={theme.buttonsRow}>
        <Pressable style={[theme.rightButton]} onPress={() => router.back()}>
          <Text style={theme.buttonTextS}>Cancelar</Text>
        </Pressable>
        <Pressable style={theme.leftButton} onPress={handleChangePassword}>
          <Text style={theme.buttonTextS}>Cambiar contraseña</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ChangePasswordScreen;
