import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

interface ShamahBackgroundProps {
  variant?: 'primary' | 'secondary' | 'cosmic' | 'midnight' | 'ocean';
  children: React.ReactNode;
  style?: any;
}

const { width, height } = Dimensions.get('window');

export default function ShamahBackground({ 
  variant = 'primary', 
  children, 
  style 
}: ShamahBackgroundProps) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'cosmic':
        return '#1e293b';
      case 'midnight':
        return '#0f172a';
      case 'ocean':
        return '#1e40af';
      case 'secondary':
        return '#8b5cf6';
      default:
        return '#6366f1';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    minHeight: height,
  },
});
