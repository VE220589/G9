import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";

// Encuadre de respaldo (San Salvador) mientras se resuelve el GPS real,
// o si el usuario niega el permiso de ubicación.
const INITIAL_REGION = {
  latitude: 13.6929,
  longitude: -89.2182,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function HomeScreen() {
  // Se usa un ref (en vez de un "region" controlado) para poder animar la
  // cámara una sola vez al obtener el GPS, sin pelear con los gestos de
  // pan/zoom del usuario en renders posteriores.
  const mapRef = useRef<MapView>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Se necesita permiso de ubicación para mostrar tu posición actual.");
        setLoading(false);
        return;
      }
      setHasPermission(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      // Centra el mapa en la ubicación real ya obtenida, con un zoom más
      // cercano que el de INITIAL_REGION.
      mapRef.current?.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
      setLoading(false);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        // El punto azul y el botón de "mi ubicación" solo tienen sentido
        // (y solo funcionan) si el permiso fue concedido.
        showsUserLocation={hasPermission}
        showsMyLocationButton={hasPermission}
      />
      {/* Overlay mientras se resuelve el permiso y la primera lectura de GPS */}
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#208AEF" />
        </View>
      )}
      {/* Aviso si el usuario niega el permiso de ubicación */}
      {errorMsg && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{errorMsg}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
  },
  banner: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: "#000000c0",
    borderRadius: 8,
    padding: 12,
  },
  bannerText: {
    color: "#fff",
    textAlign: "center",
  },
});