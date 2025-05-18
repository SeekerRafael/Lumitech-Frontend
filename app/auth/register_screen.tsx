import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  Alert,
  TouchableOpacity
} from 'react-native';
import { registerUser } from '../../services/api';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    userName: '',
    userLastName: '',
    userNickName: '',
    userEmail: '',
    userPassword: '',
    confirmPassword: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleRegister = async () => {
    const newErrors: { [key: string]: string } = {};

    // Validación local
    if (formData.userPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setErrors({});
      const { confirmPassword, ...payload } = formData; // Elimina confirmPassword del envío
      await registerUser(payload);
      Alert.alert('Éxito', 'Usuario registrado correctamente');
      router.replace('/auth/verify_account_screen');
    } catch (error: any) {
      // console.error(error);

      if (error?.response?.data?.message) {
        const messages = error.response.data.message;
        const formattedErrors: { [key: string]: string } = {};

        messages.forEach((msg: string) => {
          if (msg.includes('nombre')) formattedErrors.userName = msg;
          else if (msg.includes('apellido')) formattedErrors.userLastName = msg;
          else if (msg.includes('nickname')) formattedErrors.userNickName = msg;
          else if (msg.includes('correo')) formattedErrors.userEmail = msg;
          else if (msg.includes('contraseña')) formattedErrors.userPassword = msg;
        });

        setErrors(formattedErrors);
      } else {
        // Alert.alert('Error', 'No se pudo registrar el usuario');
        console.log('Error', 'No se pudo registrar el usuario');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>

      {[
        { name: 'userName', placeholder: 'Nombre' },
        { name: 'userLastName', placeholder: 'Apellido' },
        { name: 'userNickName', placeholder: 'Nombre de Usuario' },
        { name: 'userEmail', placeholder: 'Correo Electrónico', keyboardType: 'email-address' },
      ].map(({ name, placeholder, keyboardType }) => (
        <View key={name} style={styles.fieldContainer}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            keyboardType={(keyboardType ?? 'default') as any}
            value={(formData as any)[name]}
            onChangeText={text => handleChange(name, text)}
          />
          {errors[name] && <Text style={styles.error}>{errors[name]}</Text>}
        </View>
      ))}

      {/* Contraseña */}
      <View style={styles.fieldContainer}>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
            value={formData.userPassword}
            onChangeText={text => handleChange('userPassword', text)}
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
        {errors.userPassword && <Text style={styles.error}>{errors.userPassword}</Text>}
      </View>

      {/* Confirmar contraseña */}
      <View style={styles.fieldContainer}>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirmar Contraseña"
            secureTextEntry={!showPassword}
            value={formData.confirmPassword}
            onChangeText={text => handleChange('confirmPassword', text)}
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
        {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}
      </View>

      <Button title="Registrarse" onPress={handleRegister} />
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
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 30,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
  },
  iconButton: {
    padding: 10,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});
