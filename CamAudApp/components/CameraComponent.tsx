import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const CameraComponent = () => {
  // Cámara actualmente activa: 'back' (trasera) o 'front' (frontal).
  const [facing, setFacing] = useState<CameraType>('back');
  // Controla si el visor de cámara está abierto en pantalla o no.
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  // Estado y función para pedir el permiso de cámara al sistema operativo.
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Necesita permiso para ver la camara</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  // Alterna entre cámara trasera y frontal.
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // Muestra el visor de cámara.
  function handleOpenCamera() {
    setIsCameraVisible(true);
  }

  // Oculta el visor de cámara.
  function handleCloseCamera() {
    setIsCameraVisible(false);
  }
return (
    <View style={styles.container}>
      {isCameraVisible ? (
        <View style={styles.cameraWrapper}>
          {/* Visor de cámara sin hijos */}
          <CameraView style={styles.camera} facing={facing} />
          
          {/* Controles superpuestos usando absolute positioning */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCloseCamera}>
              <Text style={styles.text}>Close Camera</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Estado inicial: botón para abrir la cámara.
        <Button title="Open Camera" onPress={handleOpenCamera} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Contenedor principal, centra el contenido en toda la pantalla.
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  // Envoltorio para mantener el contexto de la cámara y los botones juntos
  cameraWrapper: {
    flex: 1,
    width: '100%',
  },
  // El visor de cámara ocupa todo el espacio disponible.
  camera: {
    flex: 1,
  },
  // Fila de botones superpuesta en la parte inferior del visor usando position: 'absolute'
  buttonContainer: {
    position: 'absolute',
    bottom: 64, // Mantiene el margen inferior original
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribuye los botones equitativamente
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});