import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { MaterialIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading: authLoading } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isEmail, setIsEmail] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!identifier || !password) {
      setErrorMessage('Por favor completa todos los campos');
      return;
    }

    setErrorMessage('');
    setIsLoggingIn(true);

    try {
      await login(identifier, password, isEmail);
      router.replace('/(tabs)/home_screen');
    } catch (error: any) {
      let message = 'Error al iniciar sesión';

      if (error.response) {
        switch (error.response.status) {
          case 401:
            message = 'Credenciales incorrectas';
            break;
          case 403:
            message = 'Por favor verifica tu email antes de iniciar sesión';
            break;
          case 404:
            message = 'Usuario no encontrado';
            break;
          default:
            message = error.response.data?.message || message;
        }
      }

      setErrorMessage(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleButton, !isEmail && styles.activeToggle]}
          onPress={() => setIsEmail(false)}
        >
          <Text style={[styles.toggleText, !isEmail && styles.activeToggleText]}>
            Nickname
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.toggleButton, isEmail && styles.activeToggle]}
          onPress={() => setIsEmail(true)}
        >
          <Text style={[styles.toggleText, isEmail && styles.activeToggleText]}>
            Email
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder={isEmail ? 'Correo electrónico' : 'Nombre de usuario'}
        value={identifier}
        onChangeText={(text) => {
          setIdentifier(text);
          setErrorMessage('');
        }}
        autoCapitalize="none"
        keyboardType={isEmail ? 'email-address' : 'default'}
        autoCorrect={false}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrorMessage('');
          }}
          autoComplete="password"
        />
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <MaterialIcons 
            name={showPassword ? 'visibility-off' : 'visibility'} 
            size={24} 
            color="#666" 
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.forgotPasswordLink}
        onPress={() => router.push('/auth/forgot_password_screen')}
      >
        <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      {errorMessage !== '' && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      {(authLoading || isLoggingIn) ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <>
          <View style={styles.buttonContainer}>
            <Button
              title="Iniciar Sesión"
              onPress={handleLogin}
              color="#007AFF"
            />
          </View>
          
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes una cuenta?</Text>
            <Button
              title="Regístrate"
              onPress={() => router.push('/auth/register_screen')}
              color="#666"
            />
          </View>

          <TouchableOpacity 
            style={styles.verifyEmailLink}
            onPress={() => router.push('/auth/verify_email')}
          >
            <Text style={styles.verifyEmailText}>¿No has verificado tu correo? Verificar ahora</Text>
          </TouchableOpacity>
        </>
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
    marginBottom: 30,
    color: '#333',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  toggleButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  activeToggle: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  toggleText: {
    color: '#333',
    fontWeight: '500',
  },
  activeToggleText: {
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8, 
    fontSize: 16,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  iconButton: {
    padding: 10,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 10,
  },
  registerContainer: {
    marginTop: 25,
    alignItems: 'center',
    gap: 5,
  },
  registerText: {
    marginBottom: 5,
    color: '#666',
  },
  loader: {
    marginVertical: 20,
  },
  verifyEmailLink: {
    marginVertical: 10,
    alignSelf: 'center',
  },
  verifyEmailText: {
    color: '#007AFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
