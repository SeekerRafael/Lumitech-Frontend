import React, { useState } from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { IconButton, Menu, Portal, Dialog, Paragraph, Button } from 'react-native-paper';
import { useRouter, useFocusEffect } from 'expo-router';
import { AuthService } from '../auth/auth.service';


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

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
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
      router.replace('/auth/login_screen'); 
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton icon="cog" size={28} onPress={() => setMenuVisible(true)} />
          }
        >
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              router.push('/(tabs)/profile_screen');
            }}
            title="Perfil"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              router.push('/(tabs)/notifications_screen');
            }}
            title="Notificaciones"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              setLogoutDialogVisible(true);
            }}
            title="Cerrar sesión"
          />
        </Menu>
      </View>

      <Text style={{ fontSize: 24, color: 'red' }}>
        Bienvenido, {user.name} {user.userLastName} 👋
      </Text>
      <Text style={{ fontSize: 16, marginTop: 10 }}>
        Usuario: {user.userNickName}
      </Text>
      <Text style={{ fontSize: 16 }}>
        Correo: {user.email}
      </Text>

      <Button
        mode="contained"
        style={{ marginTop: 40, borderRadius: 8 }}
        onPress={() => {}}
      >
        Agregar Dispositivo
      </Button>

      <Portal>
        <Dialog
          visible={logoutDialogVisible}
          onDismiss={() => setLogoutDialogVisible(false)}
        >
          <Dialog.Title>Cerrar sesión</Dialog.Title>
          <Dialog.Content>
            <Paragraph>¿Deseas cerrar sesión?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLogoutDialogVisible(false)}>Cancelar</Button>
            <Button onPress={handleLogout}>Cerrar sesión</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'flex-end' },
});

export default HomeScreen;
