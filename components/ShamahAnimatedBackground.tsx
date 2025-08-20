import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ShamahGradients } from '../constants/Colors';
import { FloatingElement } from './ShamahAnimations';

interface ShamahAnimatedBackgroundProps {
  variant?: 'primary' | 'secondary' | 'cosmic' | 'midnight' | 'ocean';
  children: React.ReactNode;
  style?: any;
}

const { width, height } = Dimensions.get('window');

export default function ShamahAnimatedBackground({ 
  variant = 'primary', 
  children, 
  style 
}: ShamahAnimatedBackgroundProps) {
  const getGradient = () => {
    switch (variant) {
      case 'primary':
        return ShamahGradients.primary;
      case 'secondary':
        return ShamahGradients.secondary;
      case 'cosmic':
        return ShamahGradients.cosmic;
      case 'midnight':
        return ShamahGradients.midnight;
      case 'ocean':
        return ShamahGradients.ocean;
      default:
        return ShamahGradients.primary;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={getGradient() as any}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Padrão de fundo sutil */}
        <View style={styles.pattern} />
        
        {/* Elementos decorativos animados */}
        <View style={styles.decorativeElements}>
          <FloatingElement 
            type="float" 
            amplitude={20} 
            duration={3000}
            style={StyleSheet.flatten([styles.circle, styles.circle1])}
          >
            <View style={styles.circleInner} />
          </FloatingElement>
          
          <FloatingElement 
            type="sway" 
            amplitude={15} 
            duration={4000}
            style={StyleSheet.flatten([styles.circle, styles.circle2])}
          >
            <View style={styles.circleInner} />
          </FloatingElement>
          
          <FloatingElement 
            type="pulse" 
            amplitude={5} 
            duration={2500}
            style={StyleSheet.flatten([styles.circle, styles.circle3])}
          >
            <View style={styles.circleInner} />
          </FloatingElement>
        </View>
        
        {/* Conteúdo */}
        <View style={styles.content}>
          {children}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  pattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
    backgroundColor: 'transparent',
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  circle: {
    position: 'absolute',
  },
  circleInner: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  circle1: {
    width: width * 0.8,
    height: width * 0.8,
    top: -width * 0.4,
    right: -width * 0.2,
  },
  circle2: {
    width: width * 0.6,
    height: width * 0.6,
    bottom: -width * 0.3,
    left: -width * 0.1,
  },
  circle3: {
    width: width * 0.4,
    height: width * 0.4,
    top: height * 0.3,
    right: -width * 0.1,
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
});
