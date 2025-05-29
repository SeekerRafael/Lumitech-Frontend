import { useFocusEffect, useRouter } from "expo-router";
import React from "react";
import { Image, Text, View, TouchableOpacity, StyleSheet, } from "react-native";
import { IconButton } from "react-native-paper";
import { theme } from "../../constants/theme";
import { useAuth } from "../hooks/useAuth";
import { colors } from "../../constants/theme";

import { Ionicons } from "@expo/vector-icons";
const ProfileScreen = () => {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      refreshUser();
    }, [])
  );

  if (!user) {
    return (
      <View style={theme.containerSecundario}>
        <Text>No se encontró información del usuario.</Text>
      </View>
    );
  }

  const handleEdit = (
    field: "name" | "lastname" | "nickname" | "password",
    currentValue: string
  ) => {
    if (field === "password") {
      router.push("/(tabs)/change_password");
    } else {
      router.push({
        pathname: "/(tabs)/edit_profile_screen",
        params: { field, currentValue },
      });
    }
  };

  return (
    <View style={theme.containerSecundario}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
              <Text style={styles.backText}>Volver</Text>
            </TouchableOpacity>
      <Image
        style={theme.logoTerciario}
        source={require("../../assets/images/logo3.png")}
      />

      <Text style={theme.title}>Mi Perfil</Text>

      <View style={theme.card}>
        <View style={theme.row}>
          <Text style={theme.labelSecundario}>Nombre</Text>
          <Text style={theme.value}>{user.name}</Text>
          <IconButton
            icon="pencil"
            iconColor="#03045E"
            onPress={() => handleEdit("name", user.name)}
          />
        </View>

        <View style={theme.row}>
          <Text style={theme.labelSecundario}>Apellido</Text>
          <Text style={theme.value}>{user.userLastName}</Text>
          <IconButton
            icon="pencil"
            iconColor="#03045E"
            onPress={() => handleEdit("lastname", user.userLastName)}
          />
        </View>

        <View style={theme.row}>
          <Text style={theme.labelSecundario}>Usuario</Text>
          <Text style={theme.value}>{user.userNickName}</Text>
          <IconButton
            icon="pencil"
            iconColor="#03045E"
            onPress={() => handleEdit("nickname", user.userNickName)}
          />
        </View>

        <View style={theme.row}>
          <Text style={theme.labelSecundario}>Contraseña</Text>
          <Text style={theme.value}>******</Text>
          <IconButton
            icon="pencil"
            iconColor="#03045E"
            onPress={() => handleEdit("password", "")}
          />
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;



const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#333",
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  noDataText: {
    fontSize: 16,
    color: "#555",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backText: {
    marginLeft: 6,
    color: colors.primary,
    fontWeight: "600",
  },
});
