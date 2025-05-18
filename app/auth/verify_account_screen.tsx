import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';

const BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
const API_URL = `${BASE_URL}/user`;

// Función para validar UUID v4
const isUUID = (val: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);

// Validación de email
const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

export default function VerifyAccountScreen() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [resendEmail, setResendEmail] = useState('');

  const handleVerify = async () => {
    if (!token) {
      Alert.alert('Error', 'Por favor ingresa el token de verificación');
      return;
    }

    if (!isUUID(token)) {
      Alert.alert('Error', 'El token no es válido.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { token });
      Alert.alert('Éxito', response.data.message || 'Email verificado correctamente');
      router.replace('/auth/login_screen');
    } catch (error: any) {
      let errorMessage = 'Error al verificar el token';

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status === 422) {
          if (Array.isArray(data.message)) {
            errorMessage = data.message.join('\n');
          } else {
            errorMessage = data.message || 'Token inválido o expirado';
          }
        } else if (status === 404) {
          errorMessage = 'Usuario no encontrado';
        }
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendToken = async () => {
    if (!resendEmail) {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return;
    }

    if (!isValidEmail(resendEmail)) {
      Alert.alert('Error', 'Correo inválido');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_URL}/resend-verification`, { email: resendEmail });
      Alert.alert('Éxito', 'Token reenviado, revisa tu email');
      setModalVisible(false);
      setResendEmail('');
    } catch (error: any) {
      let errorMessage = 'No se pudo reenviar el token';

      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          errorMessage = error.response.data.message.join('\n');
        } else {
          errorMessage = error.response.data.message;
        }
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifica tu cuenta</Text>
      <Text style={styles.subtitle}>
        Ingresa el token de verificación que recibiste en tu email
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Token de verificación"
        value={token}
        onChangeText={setToken}
        autoCapitalize="none"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button
            title="Verificar cuenta"
            onPress={handleVerify}
            disabled={loading || !token}
          />
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>¿No recibiste el token?</Text>
            <Button
              title="Reenviar token"
              onPress={() => setModalVisible(true)}
              color="#666"
            />
          </View>
        </>
      )}

      {/* Modal para reenviar token */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Reenviar token</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={resendEmail}
              onChangeText={setResendEmail}
            />
            <View style={styles.modalButtons}>
              <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.sendButton} onPress={handleResendToken}>
                <Text style={styles.sendText}>Enviar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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
  resendContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resendText: {
    marginBottom: 10,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancelButton: {
    marginRight: 10,
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  sendText: {
    color: '#fff',
    fontSize: 16,
  },
});






