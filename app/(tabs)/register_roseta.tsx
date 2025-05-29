import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, Image } from 'react-native';
import axios from 'axios';
import { StorageService } from '../../services/storage.service'; // Asegúrate que la ruta sea correcta
import { theme } from '../../constants/theme'; // Importa el mismo theme para estilos consistentes

const RegisterRosettaScreen = () => {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const sendCredentialsToESP32 = async () => {
    setError(null);
    if (!ssid.trim() || !password.trim()) {
      setError('SSID y contraseña no pueden estar vacíos.');
      return;
    }

    Alert.alert('Info', 'Enviando credenciales al ESP32...');
    try {
      const response = await fetch('http://192.168.4.1/set-wifi-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wifi_ssid: ssid.trim(), wifi_password: password.trim() }),
      });

      const data = await response.json();
      Alert.alert('Respuesta del ESP32', data.message || 'Sin mensaje');
    } catch (err) {
      Alert.alert('Error', 'No se pudo conectar con el ESP32');
    }
  };

  const registerRosetta = async () => {
    setError(null);
    try {
      const token = await StorageService.getItem('userToken');
      const response = await axios.post(
        'http://192.168.0.10:3000/roseta/register',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Registro exitoso', response.data.msg);
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar la roseta');
    }
  };

  return (
    <View style={theme.containerTerciario}>
      <Image
        source={require('../../assets/images/logo3.png')}
        style={theme.logoTerciario}
        resizeMode="contain"
      />
      <Text style={theme.title}>Registrar Roseta</Text>

      <Text style={theme.label}>SSID:</Text>
      <TextInput
        style={[theme.input, error ? theme.errorText : undefined]}
        value={ssid}
        onChangeText={(text) => {
          setSsid(text);
          if (error) setError(null);
        }}
        placeholder="Nombre de tu red WiFi"
      />

      <Text style={theme.label}>Contraseña:</Text>
      <TextInput
        style={[theme.input, error ? theme.errorText : undefined]}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (error) setError(null);
        }}
        placeholder="Contraseña WiFi"
        secureTextEntry
      />

      {error && <Text style={theme.errorText}>{error}</Text>}

      <TouchableOpacity style={theme.buttonRegister} onPress={sendCredentialsToESP32}>
        <Text style={theme.buttonRegisterText}>Enviar credenciales al ESP32</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[theme.buttonRegister, { marginTop: 15 }]} onPress={registerRosetta}>
        <Text style={theme.buttonRegisterText}>Registrar Roseta</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterRosettaScreen;
