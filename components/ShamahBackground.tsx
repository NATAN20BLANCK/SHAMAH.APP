import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import ShamahGradient from './ShamahGradient';
import { ShamahGradients } from '../constants/Colors';

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
  // Animações para os círculos
  const circle1Anim = useRef(new Animated.Value(0)).current;
  const circle2Anim = useRef(new Animated.Value(0)).current;
  const circle3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação contínua dos círculos
    const createAnimation = (animValue: Animated.Value, duration: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createAnimation(circle1Anim, 4000).start();
    createAnimation(circle2Anim, 6000).start();
    createAnimation(circle3Anim, 8000).start();
  }, []);

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
      <ShamahGradient
        colors={getGradient() as any}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Padrão de fundo sutil */}
        <View style={styles.pattern} />
        
        {/* Elementos decorativos animados */}
        <View style={styles.decorativeElements}>
          <Animated.View 
            style={[
              styles.circle, 
              styles.circle1,
              {
                opacity: circle1Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.15, 0.3]
                })
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.circle, 
              styles.circle2,
              {
                opacity: circle2Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.12, 0.25]
                })
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.circle, 
              styles.circle3,
              {
                opacity: circle3Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.1, 0.2]
                })
              }
            ]} 
          />
        </View>
        
        {/* Conteúdo */}
        <View style={styles.content}>
          {children}
        </View>
      </ShamahGradient>
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
    // Padrão de pontos sutil
    backgroundImage: `radial-gradient(circle at 20px 20px, rgba(255,255,255,0.3) 1px, transparent 1px)`,
    backgroundSize: '40px 40px',
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
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Aumentei de 0.08 para 0.2
  },
  circle1: {
    width: width * 0.8, // Aumentei de 0.5 para 0.8 (tamanho original)
    height: width * 0.8,
    top: -width * 0.4, // Ajustado proporcionalmente 
    right: -width * 0.2,
  },
  circle2: {
    width: width * 0.6, // Aumentei de 0.4 para 0.6 (tamanho original)
    height: width * 0.6,
    bottom: -width * 0.3, // Ajustado proporcionalmente
    left: -width * 0.1,
  },
  circle3: {
    width: width * 0.5, // Aumentei de 0.35 para 0.5
    height: width * 0.5,
    top: height * 0.3, // Voltei para posição original
    right: -width * 0.1,
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
});
