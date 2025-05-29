import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { StorageService } from '../../services/storage.service'; // Asegúrate de importar correctamente


const RegisterRosettaScreen = () => {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');

  const sendCredentialsToESP32 = async () => {
    console.log('[INFO] Iniciando envío de credenciales al ESP32...');
    Alert.alert('Info', 'Enviando credenciales al ESP32...');

    console.log('[INFO] SSID:', ssid);
    console.log('[INFO] Password:', password);

    const response = await fetch('http://192.168.4.1/set-wifi-credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wifi_ssid: ssid,
        wifi_password: password,
      }),
    });

    const data = await response.json();
    console.log('[RESPUESTA ESP32]:', data);
    Alert.alert('Respuesta del ESP32', data.message || 'Sin mensaje');
  };

  const registerRosetta = async () => {
    console.log('[INFO] Registrando roseta en el backend...');
    Alert.alert('Info', 'Registrando roseta...');

    try {
      const token = await StorageService.getItem('userToken');

      console.log('[INFO] Token JWT obtenido:', token);

      const response = await axios.post(
        'http://192.168.0.10:3000/roseta/register',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('[SUCCESS] Roseta registrada:', response.data);
      Alert.alert('Registro exitoso', response.data.msg);
    } catch (error) {
      console.error('[ERROR] Fallo al registrar la roseta:', error);
      Alert.alert('Error', 'No se pudo registrar la roseta');
    }
  };

  return (
    <View style={styles.container}>
      <Text>SSID:</Text>
      <TextInput
        style={styles.input}
        value={ssid}
        onChangeText={setSsid}
        placeholder="Nombre de tu red WiFi"
      />

      <Text>Contraseña:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Contraseña WiFi"
      />

      <Button title="Enviar credenciales al ESP32" onPress={sendCredentialsToESP32} />

      <View style={{ marginTop: 20 }}>
        <Button title="Registrar Roseta" onPress={registerRosetta} />
      </View>
    </View>
  );
};

export default RegisterRosettaScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
  },
});
