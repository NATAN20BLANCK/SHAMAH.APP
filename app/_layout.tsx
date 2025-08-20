import '../global';
import React from 'react';
// O polyfill para React.use agora é importado de forma global em app/global-setup.js
// Não é mais necessário adicionar o hack aqui

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LoadingProvider } from '../contexts/LoadingContext';
import { ShamahColors } from '../constants/Colors';
import { View } from 'react-native';

export default function RootLayout() {

  return (
    <View style={{ flex: 1 }}>
      <LoadingProvider>
        <StatusBar style="light" backgroundColor={ShamahColors.primary} />
        <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#1e3c72', // Cor fixa para web
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="splash" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
        <Stack.Screen name="EditorScreen" />
        <Stack.Screen name="VideoEditorScreen" />
        <Stack.Screen name="ContasScreen" />
        <Stack.Screen name="AfiliadosScreen" />
        <Stack.Screen name="AgendadosScreen" />
        <Stack.Screen name="PlanosScreen" />
        <Stack.Screen name="ServicosScreen" />
        <Stack.Screen name="PortfolioScreen" />
        <Stack.Screen name="ContatoScreen" />
      </Stack>
      </LoadingProvider>
    </View>
  );
}
