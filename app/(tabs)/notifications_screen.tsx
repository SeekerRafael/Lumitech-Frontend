import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/theme";

interface AlertData {
  message: string;
  timestamp: number;
}

const NotificationsScreen = () => {
  const { mac } = useLocalSearchParams();
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);
  const [noDataMessage, setNoDataMessage] = useState("");

  const fetchAlerts = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");

    const response = await fetch(
      `${process.env.API_BASE_URL || "http://192.168.0.10:3000"}/roseta/alerts/${mac}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al obtener alertas.");
    }

    if (!data.data) {
      // No hay alertas
      setAlerts([]);
      setNoDataMessage(data.msg || "No hay alertas disponibles.");
    } else if (Array.isArray(data.data)) {
      // data.data es arreglo
      setAlerts(data.data);
      setNoDataMessage("");
    } else if (typeof data.data === "object") {
      // data.data es objeto único, envolver en array
      setAlerts([data.data]);
      setNoDataMessage("");
    } else {
      // Otro caso raro
      setAlerts([]);
      setNoDataMessage(data.msg || "No hay alertas disponibles.");
    }
  } catch (error: any) {
    setNoDataMessage(error.message || "Error desconocido");
    setAlerts([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (mac) fetchAlerts();
  }, [mac]);

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleString();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Alertas</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : Array.isArray(alerts) && alerts.length > 0 ? (
        alerts.map((alert, index) => (
          <View key={index} style={styles.alertCard}>
            <Ionicons name="alert-circle-outline" size={24} color="#e74c3c" />
            <View style={styles.alertContent}>
              <Text style={styles.alertText}>{alert.message}</Text>
              <Text style={styles.timestamp}>{formatTimestamp(alert.timestamp)}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noAlerts}>{noDataMessage}</Text>
      )}
    </ScrollView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.primary,
  },
  noAlerts: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#ffeaea",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  alertContent: {
    marginLeft: 10,
    flex: 1,
  },
  alertText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#c0392b",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
});
