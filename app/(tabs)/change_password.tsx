import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { AuthService } from '../auth/auth.service';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

const ChangePasswordScreen = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estado para errores
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validateInputs = () => {
    const newErrors: typeof errors = {};

    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'La contraseña actual no puede estar vacía.';
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = 'La nueva contraseña no puede estar vacía.';
    } else if (newPassword.length < 8 || newPassword.length > 15) {
      newErrors.newPassword = 'La contraseña debe tener entre 8 y 15 caracteres.';
    } else if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword =
        'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo.';
    }

    if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      await AuthService.changePassword(currentPassword, newPassword);
      Alert.alert('Éxito', 'Contraseña actualizada');
      router.back();
    } catch (error: any) {
      // console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'No se pudo cambiar la contraseña');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Contraseña actual:</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          secureTextEntry={!showCurrentPassword}
          style={styles.passwordInput}
          value={currentPassword}
          onChangeText={text => {
            setCurrentPassword(text);
            if (errors.currentPassword) {
              setErrors(prev => ({ ...prev, currentPassword: undefined }));
            }
          }}
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowCurrentPassword(!showCurrentPassword)}
        >
          <MaterialIcons
            name={showCurrentPassword ? 'visibility-off' : 'visibility'}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      {errors.currentPassword && <Text style={styles.errorText}>{errors.currentPassword}</Text>}

      <Text style={styles.label}>Nueva contraseña:</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          secureTextEntry={!showNewPassword}
          style={styles.passwordInput}
          value={newPassword}
          onChangeText={text => {
            setNewPassword(text);
            if (errors.newPassword) {
              setErrors(prev => ({ ...prev, newPassword: undefined }));
            }
          }}
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowNewPassword(!showNewPassword)}
        >
          <MaterialIcons
            name={showNewPassword ? 'visibility-off' : 'visibility'}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}

      <Text style={styles.label}>Confirmar nueva contraseña:</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          secureTextEntry={!showConfirmPassword}
          style={styles.passwordInput}
          value={confirmPassword}
          onChangeText={text => {
            setConfirmPassword(text);
            if (errors.confirmPassword) {
              setErrors(prev => ({ ...prev, confirmPassword: undefined }));
            }
          }}
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <MaterialIcons
            name={showConfirmPassword ? 'visibility-off' : 'visibility'}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

      <Button title="Cambiar contraseña" onPress={handleChangePassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, marginBottom: 5 },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 5,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  iconButton: {
    padding: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
});

export default ChangePasswordScreen;


