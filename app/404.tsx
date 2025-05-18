// app/404.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

const NotFoundScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.message}>Oops, la pantalla que buscas no existe.</Text>
      <Button mode="contained" onPress={() => router.replace('./index')} style={styles.button}>
        Volver al inicio
      </Button>
    </View>
  );
};

export default NotFoundScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  message: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 30,
    borderRadius: 8,
  },
});
