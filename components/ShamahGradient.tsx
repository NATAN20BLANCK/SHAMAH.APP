import React from 'react';
import { Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WebGradientComponent } from './WebGradientComponent';

export default function ShamahGradient(props) {
  // Use o componente web customizado para web
  if (Platform.OS === 'web') {
    return <WebGradientComponent {...props} />;
  }

  // Use o LinearGradient padrão do Expo para mobile
  return <LinearGradient {...props} />;
}
