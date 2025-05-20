import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useRouter, useFocusEffect } from "expo-router";
import { AuthService } from "../auth/auth.service";
import { MaterialIcons } from "@expo/vector-icons";
import { theme, colors } from "../../constants/theme";
import { Menu, Portal, Dialog, Paragraph, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = () => {
  const { user, isLoading, refreshUser } = useAuth();
  const router = useRouter();

  const [menuVisible, setMenuVisible] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      refreshUser();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setLogoutDialogVisible(true);
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  if (isLoading) {
    return (
      <View style={theme.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ padding: 20 }}>
        <Text>No hay datos de usuario.</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      setLogoutDialogVisible(false);
      await AuthService.logout();
      router.replace("/auth/login_screen");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <View style={theme.container}>
      <View style={theme.header}>
        <Image
          source={require("../../assets/images/logo3.png")}
          style={theme.logoTerciario}
          resizeMode="contain"
        />

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              style={theme.settingsButton}
            >
              <MaterialIcons name="settings" size={28} color={colors.primary} />
            </TouchableOpacity>
          }
          contentStyle={{ backgroundColor: colors.background }}
        >
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              router.push("/(tabs)/profile_screen");
            }}
            title={
              <View style={theme.menuItemContainer}>
                <MaterialIcons name="person" size={20} color={colors.primary} />
                <Text style={theme.menuItemText}>Perfil</Text>
              </View>
            }
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              router.push("/(tabs)/notifications_screen");
            }}
            title={
              <View style={theme.menuItemContainer}>
                <MaterialIcons
                  name="notifications"
                  size={20}
                  color={colors.primary}
                />
                <Text style={theme.menuItemText}>Notificaciones</Text>
              </View>
            }
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              setLogoutDialogVisible(true);
            }}
            title={
              <View style={theme.menuItemContainer}>
                <MaterialIcons name="logout" size={20} color={colors.error} />
                <Text style={theme.menuItemDangerText}>Cerrar sesión</Text>
              </View>
            }
          />
        </Menu>
      </View>

      <View style={theme.content}>
        <Text style={theme.welcomeTitle}>
          Bienvenido, {user.name} {user.userLastName} a tu roseta inteligente
        </Text>

        <TouchableOpacity
          style={[theme.input, { marginTop: 30 }]}
          onPress={() => router.push("/tutorial")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="add-circle-outline"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text style={theme.buttonText}>Agregar Dispositivo</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Portal>
        <Dialog
          visible={logoutDialogVisible}
          onDismiss={() => setLogoutDialogVisible(false)}
          style={{ backgroundColor: colors.background }}
        >
          <Dialog.Title style={{ color: colors.colorLetter }}>
            Cerrar sesión
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph style={{ color: colors.colorLetter }}>
              ¿Deseas cerrar sesión?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setLogoutDialogVisible(false)}
              textColor={colors.colorLetter}
            >
              Cancelar
            </Button>
            <Button onPress={handleLogout} textColor={colors.error}>
              Cerrar sesión
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default HomeScreen;
