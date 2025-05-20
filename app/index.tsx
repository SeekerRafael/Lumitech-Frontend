import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={theme.homeContainer}>
      <Image
        source={require('../assets/images/logo2.png')}
        style={theme.logoPrincipal}
        resizeMode="contain"
      />
      <Text style={theme.appName}>LumiTech</Text>

      <TouchableOpacity
        style={theme.button}
        onPress={() => router.push('/auth/login_screen')}
      >
        <Text style={theme.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={theme.button}
        onPress={() => router.push('/auth/register_screen')}
      >
        <Text style={theme.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}









