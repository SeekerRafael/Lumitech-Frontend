import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { IconButton } from "react-native-paper"; 
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Dialog, Menu, Paragraph, Portal } from "react-native-paper";
import { colors, theme } from "../../constants/theme";
import { AuthService } from "../auth/auth.service";
import { useAuth } from "../hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const { user, isLoading, refreshUser } = useAuth();
  const router = useRouter();

  const [menuVisible, setMenuVisible] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [devicesError, setDevicesError] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      refreshUser();
      fetchDevices();
    }, [])
  );

  const fetchDevices = async () => {
    setDevicesLoading(true);
    setDevicesError(null);

    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) throw new Error("No se encontró token de autenticación");

      const response = await fetch(
        `${process.env.API_BASE_URL || "http://192.168.0.10:3000"}/roseta/get-all-rosettes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al obtener dispositivos");

      const data = await response.json();
      setDevices(data.data || []);
    } catch (error: any) {
      setDevicesError(error.message || "Error desconocido");
    } finally {
      setDevicesLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLogoutDialogVisible(false);
      await AuthService.logout();
      router.replace("/auth/login_screen");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

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

  if (isLoading || devicesLoading) {
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

  return (
    <View style={theme.container}>
      {/* Header */}
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

      {/* Contenido principal */}
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

        {/* Mostrar dispositivos */}
        {devicesError ? (
          <Text style={{ color: colors.error, marginTop: 20 }}>{devicesError}</Text>
        ) : devices.length === 0 ? (
          <Text style={{ marginTop: 20 }}>No tienes dispositivos registrados.</Text>
        ) : (
          <FlatList
            data={devices}
            keyExtractor={(item) => item.rosette_mac}
            style={{ marginTop: 20 }}
            renderItem={({ item }) => {
              const ubicacion = item.ubication;

              return (
                <View
                  style={{
                    backgroundColor: colors.primary,
                    marginBottom: 10,
                    padding: 15,
                    borderRadius: 12,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    elevation: 3,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                    MAC: {item.rosette_mac}
                  </Text>
                  <Text style={{ color: "white", marginTop: 5 }}>
                    IP: {item.rosette_ip}
                  </Text>
                  <Text style={{ color: "white", marginTop: 5 }}>
                    WiFi: {item.wifi_ssid}
                  </Text>
                  <Text style={{ color: "white", marginTop: 5 }}>
                    Ubicación: {item.ubication}
                  </Text>

                  {/* Botones de acción */}
                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    {/* Editar ubicación */}
                    <IconButton
                      icon="pencil"
                      iconColor="white"
                      size={24}
                      onPress={() =>
                        router.push({
                          pathname: "/edit_roseta",
                          params: {
                            rosette_mac: item.rosette_mac,
                            currentUbication: item.ubication || "",
                          },
                        })
                      }
                    />

                    {/* Eliminar roseta */}
                    <IconButton
                      icon="delete"
                      iconColor="white"
                      size={24}
                      onPress={() => {
                        console.log("Eliminar roseta:", item.rosette_mac);
                      }}
                    />
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>

      {/* Dialogo cerrar sesión */}
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