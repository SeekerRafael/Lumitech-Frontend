import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

type EditField = 'name' | 'lastname' | 'nickname';

type RouteParams = {
  EditProfile: {
    field: EditField;
    currentValue: string;
  };
};

const fieldTitles: Record<EditField, string> = {
  name: 'Nombre',
  lastname: 'Apellido',
  nickname: 'Nombre de usuario',
};

const endpointMap: Record<EditField, string> = {
  name: 'change-name',
  lastname: 'change-lastname',
  nickname: 'change-nickname',
};

const BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'EditProfile'>>();
  const { field, currentValue } = route.params;

  const [newValue, setNewValue] = useState('');
  const [error, setError] = useState<string | null>(null); // Estado para errores

  const handleSave = async () => {
    setError(null); // Limpiar error previo

    if (!newValue.trim()) {
      setError('El nuevo valor no puede estar vacío');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        setError('No se encontró el token');
        return;
      }

      const response = await fetch(`${BASE_URL}/user/${endpointMap[field]}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          [field === 'name'
            ? 'userName'
            : field === 'lastname'
            ? 'userLastName'
            : 'nickName']: newValue,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.message || 'Error al actualizar el dato');
        return;
      }

      // Si todo salió bien
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'No se pudo actualizar');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar {fieldTitles[field]}</Text>

      <Text style={styles.label}>Actual:</Text>
      <Text style={styles.currentValue}>{currentValue}</Text>

      <Text style={styles.label}>Nuevo:</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholder={`Nuevo ${fieldTitles[field]}`}
        value={newValue}
        onChangeText={text => {
          setNewValue(text);
          if (error) setError(null); // Quitar error al modificar el input
        }}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.buttons}>
        <Button title="Cancelar" color="#888" onPress={() => navigation.goBack()} />
        <Button title="Guardar cambios" onPress={handleSave} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginTop: 10 },
  currentValue: { fontSize: 18, color: '#333', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 5,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default EditProfileScreen;
