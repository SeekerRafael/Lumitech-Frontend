import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';
import { useRouter, useFocusEffect } from 'expo-router';

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
      <View style={styles.container}>
        <Text>No se encontró información del usuario.</Text>
      </View>
    );
  }

  const handleEdit = (field: 'name' | 'lastname' | 'nickname' | 'password', currentValue: string) => {
    if (field === 'password') {
      router.push('/(tabs)/change_password'); // Asegúrate de que esta ruta exista
    } else {
      router.push({
        pathname: '/(tabs)/edit_profile_screen',
        params: { field, currentValue },
      });
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Nombre: {user.name}</Text>
        <IconButton icon="pencil" onPress={() => handleEdit('name', user.name)} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Apellido: {user.userLastName}</Text>
        <IconButton icon="pencil" onPress={() => handleEdit('lastname', user.userLastName)} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Usuario: {user.userNickName}</Text>
        <IconButton icon="pencil" onPress={() => handleEdit('nickname', user.userNickName)} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Contraseña: ******</Text>
        <IconButton icon="pencil" onPress={() => handleEdit('password', '')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 30, fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  label: { fontSize: 18 },
});

export default ProfileScreen;
