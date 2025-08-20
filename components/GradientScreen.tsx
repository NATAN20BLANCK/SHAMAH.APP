import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientScreenProps {
  children: React.ReactNode;
}

export default function GradientScreen({ children }: GradientScreenProps) {
  return (
    <LinearGradient colors={['#0D47A1', '#512DA8']} style={styles.gradient}>
      <View style={styles.content}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden'
  },
  content: {
    flex: 1,
    padding: 20
  }
});