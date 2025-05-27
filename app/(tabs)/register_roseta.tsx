
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import Constants from 'expo-constants';
import { StorageService } from "../../services/storage.service";


type RootStackParamList = {
  RegisterRoseta: undefined;
  DevicesList: undefined;
  // Agrega otras pantallas según sea necesario
};

type RegisterRosetaScreenProp = StackNavigationProp<RootStackParamList, 'RegisterRoseta'>;

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;


export const RegisterRosetaScreen = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigation = useNavigation<RegisterRosetaScreenProp>();
  
  const [deviceData, setDeviceData] = useState({
    rosette_mac: '',
    rosette_ip: '',
    wifi_ssid: '',
    wifi_password: '',
    ubication: ''
  });
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [step, setStep] = useState(1); // 1: Datos del dispositivo, 2: Datos de conexión WiFi

  const handleRegisterDevice = async () => {
    if (!user) {
      Alert.alert('Error', 'No se pudo obtener la información del usuario');
      return;
    }

    // Validaciones básicas
    if (!deviceData.rosette_mac || !deviceData.rosette_ip) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsRegistering(true);

    try {
      const token = await StorageService.getItem('userToken');
      
      // Primero registramos el dispositivo
      const registerResponse = await axios.post(
        `${API_BASE_URL}/roseta/register`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (registerResponse.data.msg === 'Roseta registrada correctamente') {
        // Luego actualizamos la ubicación si se proporcionó
        if (deviceData.ubication) {
          await axios.patch(
            `${API_BASE_URL}/roseta/change-ubication`,
            {
              rosette_mac: deviceData.rosette_mac,
              ubication: deviceData.ubication,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        Alert.alert('Éxito', 'Dispositivo registrado correctamente');
        navigation.navigate('DevicesList'); // Asume que tienes una pantalla de lista de dispositivos
      } else {
        throw new Error(registerResponse.data.msg || 'Error al registrar el dispositivo');
      }
    } catch (error) {
      console.error('Error registering device:', error);
      Alert.alert('Error', 'No se pudo registrar el dispositivo. Verifica los datos e intenta nuevamente.');
    } finally {
      setIsRegistering(false);
    }
  };

  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar nueva roseta</Text>
      
      {step === 1 ? (
        <>
          <Text style={styles.subtitle}>Datos del dispositivo</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Dirección MAC del dispositivo"
            value={deviceData.rosette_mac}
            onChangeText={(text) => setDeviceData({...deviceData, rosette_mac: text})}
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Dirección IP del dispositivo"
            value={deviceData.rosette_ip}
            onChangeText={(text) => setDeviceData({...deviceData, rosette_ip: text})}
            autoCapitalize="none"
            keyboardType="numeric"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Ubicación (opcional)"
            value={deviceData.ubication}
            onChangeText={(text) => setDeviceData({...deviceData, ubication: text})}
          />
          
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={() => setStep(2)}
            disabled={!deviceData.rosette_mac || !deviceData.rosette_ip}
          >
            <Text style={styles.buttonText}>Siguiente</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>Configuración WiFi</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nombre de la red WiFi (SSID)"
            value={deviceData.wifi_ssid}
            onChangeText={(text) => setDeviceData({...deviceData, wifi_ssid: text})}
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Contraseña del WiFi"
            value={deviceData.wifi_password}
            onChangeText={(text) => setDeviceData({...deviceData, wifi_password: text})}
            secureTextEntry
            autoCapitalize="none"
          />
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.backButton]}
              onPress={() => setStep(1)}
            >
              <Text style={styles.buttonText}>Atrás</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.registerButton]}
              onPress={handleRegisterDevice}
              disabled={isRegistering || !deviceData.wifi_ssid}
            >
              {isRegistering ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Registrar</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#555',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  backButton: {
    backgroundColor: '#6c757d',
  },
  registerButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
















