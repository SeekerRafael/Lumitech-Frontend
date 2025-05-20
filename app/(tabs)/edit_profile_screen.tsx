import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { theme } from '../../constants/theme';

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
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);

    const trimmedValue = newValue.trim();

    if (!trimmedValue) {
      setError('El nuevo valor no puede estar vacío');
      return;
    }

    if (trimmedValue === currentValue) {
      setError('El nuevo valor no puede ser igual al valor actual');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setError('No se encontró el token');
        return;
      }

      const bodyPayload =
        field === 'name'
          ? { userName: trimmedValue }
          : field === 'lastname'
          ? { userLastName: trimmedValue }
          : { nickName: trimmedValue };

      const response = await fetch(`${BASE_URL}/user/${endpointMap[field]}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.message || 'Error al actualizar el dato');
        return;
      }

      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'No se pudo actualizar');
    }
  };

  return (
    <View style={theme.containerTerciario}>
      <Image
        source={require('../../assets/images/logo3.png')}
        style={theme.logoTerciario}
        resizeMode="contain"
      />
      <Text style={theme.title}>Editar {fieldTitles[field]}</Text>

      <Text style={theme.label}>
        Actual: <Text>{currentValue}</Text>
      </Text>

      <Text style={theme.label}>Nuevo:</Text>
      <TextInput
        style={[theme.input, error ? theme.errorText : undefined]}
        placeholder={`Nuevo ${fieldTitles[field]}`}
        value={newValue}
        onChangeText={text => {
          setNewValue(text);
          if (error) setError(null);
        }}
      />
      {error && <Text style={theme.errorText}>{error}</Text>}

      <View style={theme.buttonsRow}>
        <TouchableOpacity
          style={theme.leftButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={theme.buttonTextS}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={theme.rightButton} onPress={handleSave}>
          <Text style={theme.buttonTextS}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfileScreen;
