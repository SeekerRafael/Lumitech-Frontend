import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
const API_URL = `${BASE_URL}/user`;

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

export default function VerifyEmail() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResendVerification = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Ingresa un correo válido');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/resend-verification`, { email });
      Alert.alert('Éxito', 'Correo de verificación enviado');
      router.replace('/auth/verify_account_screen');
    } catch (err: unknown) {
      const error = err as AxiosError;
      // Aquí podrías manejar mensajes personalizados según error.response
      Alert.alert('Error', 'No se pudo enviar el correo de verificación. No hay ninguna cuenta con ese correo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificar Correo</Text>
      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {loading ? (
        <ActivityIndicator size="small" color="#007AFF" />
      ) : (
        <Button title="Enviar verificación" onPress={handleResendVerification} />
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
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});








