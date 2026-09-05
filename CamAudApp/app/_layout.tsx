import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="camera" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="audio-recorder"
        options={{
          title: 'Audio Recorder',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="mic" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Evita que aparezca en la barra de pestañas
        }}
      />
    </Tabs>
  );
}