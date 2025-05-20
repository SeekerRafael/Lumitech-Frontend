import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import { useRouter } from "expo-router";
import { theme, colors } from "../../constants/theme";

const TutorialScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.containerAnimation}>
      <Text style={styles.titleAnimation}>Cómo activar WiFi y seleccionar tu dispositivo</Text>

      <Animatable.View animation="fadeInDown" duration={1000} style={styles.stepContainerAnimation}>
        <Text style={styles.stepTitleAnimation}>1. Activa tu WiFi</Text>
        <Animatable.Text 
          animation="pulse" 
          iterationCount="infinite" 
          direction="alternate" 
          style={styles.highlightTextAnimation}
        >
          Desliza hacia abajo y activa el WiFi
        </Animatable.Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={1000} delay={1000} style={styles.stepContainerAnimation}>
        <Text style={styles.stepTitleAnimation}>2. Selecciona tu dispositivo</Text>
        <Animatable.Text 
          animation="bounceIn" 
          duration={1500} 
          style={[styles.highlightTextAnimation, { fontWeight: "bold" }]}
        >
          Wifi_roseta
        </Animatable.Text>
      </Animatable.View>

      <TouchableOpacity
        style={theme.input}
        onPress={() => router.push("/(tabs)/home_screen")} 
      >
        <Text style={theme.buttonText}>¡Listo, empezar!</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TutorialScreen;

const styles = StyleSheet.create({
  containerAnimation: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: "center",
  },
  titleAnimation: {
    fontSize: 22,
    color: colors.colorLetter,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  stepContainerAnimation: {
    marginBottom: 30,
    alignItems: "center",
  },
  stepTitleAnimation: {
    fontSize: 18,
    color: colors.primary,
    marginBottom: 10,
  },
  highlightTextAnimation: {
    fontSize: 16,
    color: colors.primary,
    textAlign: "center",
  },
});
