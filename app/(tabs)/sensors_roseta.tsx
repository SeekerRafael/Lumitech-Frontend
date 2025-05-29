import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../constants/theme";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;


const SensorsRosetaScreen = () => {
  const { mac } = useLocalSearchParams();
  const router = useRouter();
  const [sensorData, setSensorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSensorData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      const response = await fetch(
        `${BASE_URL}/roseta/sensor/${mac}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Error al obtener datos del sensor.");
      }

      setSensorData(json.data);
    } catch (error: any) {
      console.error("Error al actualizar sensor:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mac) {
      fetchSensorData(); // primer llamada

      const interval = setInterval(fetchSensorData, 5000); // cada 10 segundos

      return () => clearInterval(interval); // limpiar al salir
    }
  }, [mac]);

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleString(); // Ej: 28/05/2025 14:30
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!sensorData) {
    return (
      <View style={styles.center}>
        <Text style={styles.noDataText}>No se encontraron datos del sensor.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={colors.primary} />
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Últimos datos del sensor</Text>

      <View style={styles.card}>
        <Ionicons name="thermometer-outline" size={32} color={colors.primary} />
        <Text style={styles.label}>Temperatura:</Text>
        <Text style={styles.value}>{sensorData.temperature.valor} °C</Text>
        <Text style={styles.timestamp}>
          {formatTimestamp(sensorData.temperature.timestamp)}
        </Text>
      </View>

      <View style={styles.card}>
        <Ionicons name="water-outline" size={32} color={colors.primary} />
        <Text style={styles.label}>Humedad:</Text>
        <Text style={styles.value}>{sensorData.humidity.valor} %</Text>
        <Text style={styles.timestamp}>
          {formatTimestamp(sensorData.humidity.timestamp)}
        </Text>
      </View>
    </ScrollView>
  );
};

export default SensorsRosetaScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#333",
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  noDataText: {
    fontSize: 16,
    color: "#555",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backText: {
    marginLeft: 6,
    color: colors.primary,
    fontWeight: "600",
  },
});
