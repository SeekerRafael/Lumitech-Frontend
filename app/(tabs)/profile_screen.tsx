import { useFocusEffect, useRouter } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import { IconButton } from "react-native-paper";
import { theme } from "../../constants/theme";
import { useAuth } from "../hooks/useAuth";
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
