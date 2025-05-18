import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
const API_URL = `${BASE_URL}/user`;

// Validación simple de email
const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Ingresa un correo válido');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/forget-password`, { email });

      // Redirige con parámetro email
      router.push({
        pathname: '/auth/reset_password_screen',
        params: { userEmail: email },
      });
    } catch (error: any) {
      // Captura mensaje de error si existe
      let message = 'Si el email está registrado, recibirás un código para restablecer tu contraseña';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      Alert.alert('Información', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Contraseña</Text>
      <Text style={styles.subtitle}>
        Ingresa tu email para recibir un código de verificación
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email registrado"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Button
          title="Enviar Código"
          onPress={handleSubmit}
          color="#007AFF"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
});
