import { View, Text, StyleSheet, Button } from 'react-native';
import {
  AudioModule,
  RecordingPresets,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';

export const AudioRecorderComponent = () => {
  // Instancia del grabador, configurada con el preset de alta calidad.
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  // Estado reactivo del grabador (isRecording, durationMillis, etc.), se actualiza solo.
  const recorderState = useAudioRecorderState(recorder);

  const toggleRecording = async () => {
    if (!recorderState.isRecording) {
      // Pide permiso de micrófono antes de intentar grabar.
      const { granted } = await AudioModule.requestRecordingPermissionsAsync();
      if (!granted) {
        console.log('Permissions Denied');
        return;
      }
      // Prepara el grabador con el preset elegido y arranca la grabación.
      await recorder.prepareToRecordAsync();
      recorder.record();
    } else {
      // Detiene la grabación en curso.
      await recorder.stop();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Grabar Audio</Text>
      <Button
        title={recorderState.isRecording ? 'STOP' : 'RECORD'}
        onPress={toggleRecording}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Contenedor principal, centra el contenido en toda la pantalla.
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});