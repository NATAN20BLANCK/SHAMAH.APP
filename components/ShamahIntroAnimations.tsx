import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ShamahTheme } from '../constants/theme';
import { ShamahColors } from '../constants/Colors';

interface ShamahAppIntroProps {
  visible: boolean;
  onComplete?: () => void;
  duration?: number;
}

// Animação de entrada do app - Logo crescendo com partículas e efeitos especiais
export const ShamahAppIntro: React.FC<ShamahAppIntroProps> = ({
  visible,
  onComplete,
  duration = 4000 // Aumentado para permitir mais efeitos
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const textSlideAnim = useRef(new Animated.Value(50)).current;
  const textOpacityAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;
  
  // Mais partículas para um efeito mais impressionante
  const particleAnims = useRef(
    Array.from({ length: 20 }, () => ({
      scale: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0),
      rotate: new Animated.Value(0),
    }))
  ).current;

  const startParticleAnimation = useCallback(() => {
    particleAnims.forEach((particle, index) => {
      const delay = index * 100;
      const angle = (index / particleAnims.length) * 2 * Math.PI;
      const radius = 60 + Math.random() * 40;
      const endX = Math.cos(angle) * radius;
      const endY = Math.sin(angle) * radius;
      
      // Diferentes tipos de animação para cada partícula
      if (index % 4 === 0) {
        // Partículas que explodem para fora
        Animated.sequence([
          Animated.delay(delay + 800),
          Animated.parallel([
            Animated.timing(particle.scale, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: 0.8,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(particle.translateX, {
              toValue: endX,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(particle.translateY, {
              toValue: endY,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      } else if (index % 4 === 1) {
        // Partículas que giram
        Animated.loop(
          Animated.parallel([
            Animated.sequence([
              Animated.delay(delay + 600),
              Animated.timing(particle.scale, {
                toValue: 0.8,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(particle.opacity, {
                toValue: 0.6,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.delay(1000),
              Animated.timing(particle.opacity, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              }),
            ]),
            Animated.timing(particle.rotate, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      } else {
        // Partículas flutuantes suaves
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay + 1000),
            Animated.parallel([
              Animated.timing(particle.scale, {
                toValue: 0.6,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(particle.opacity, {
                toValue: 0.4,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(particle.translateY, {
                toValue: -30 + Math.random() * -20,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(particle.translateX, {
                toValue: (Math.random() - 0.5) * 30,
                duration: 2000,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(particle.opacity, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(particle.scale, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
              }),
            ]),
            // Reset position
            Animated.timing(particle.translateY, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(particle.translateX, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    });
  }, [particleAnims]);

  const startIntroAnimation = useCallback(() => {
    // Fade in do background
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Sequência principal melhorada
    Animated.sequence([
      // Logo aparece com efeito de bounce
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          tension: 50,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotateAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        // Efeito de brilho
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Logo volta ao tamanho normal
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 4,
        useNativeDriver: true,
      }),
      // Texto desliza para cima com fade
      Animated.parallel([
        Animated.timing(textSlideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Efeito ripple final
      Animated.timing(rippleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Animação das partículas
    startParticleAnimation();

    // Completar animação
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, duration);
  }, [fadeAnim, scaleAnim, logoRotateAnim, textSlideAnim, textOpacityAnim, glowAnim, rippleAnim, duration, onComplete, startParticleAnimation]);

  const resetAnimations = useCallback(() => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0);
    logoRotateAnim.setValue(0);
    textSlideAnim.setValue(50);
    textOpacityAnim.setValue(0);
    glowAnim.setValue(0);
    rippleAnim.setValue(0);
    particleAnims.forEach(particle => {
      particle.scale.setValue(0);
      particle.translateX.setValue(0);
      particle.translateY.setValue(0);
      particle.opacity.setValue(0);
      particle.rotate.setValue(0);
    });
  }, [fadeAnim, scaleAnim, logoRotateAnim, textSlideAnim, textOpacityAnim, glowAnim, rippleAnim, particleAnims]);

  useEffect(() => {
    if (visible) {
      startIntroAnimation();
    } else {
      resetAnimations();
    }
  }, [visible, startIntroAnimation, resetAnimations]);

  const logoRotation = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.8, 0],
  });

  const rippleScale = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 3],
  });

  const rippleOpacity = rippleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.3, 0],
  });

  if (!visible) return null;

  return (
    <Animated.View style={[styles.introContainer, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={[ShamahColors.primary, ShamahColors.secondary]}
        style={styles.introGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.introContent}>
        {/* Efeito Ripple de fundo */}
        <Animated.View
          style={[
            styles.rippleEffect,
            {
              transform: [{ scale: rippleScale }],
              opacity: rippleOpacity,
            },
          ]}
        />

        {/* Partículas */}
        <View style={styles.particleContainer}>
          {particleAnims.map((particle, index) => {
            const particleRotation = particle.rotate.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            });
            
            return (
              <Animated.View
                key={index}
                style={[
                  styles.particle,
                  {
                    backgroundColor: index % 3 === 0 ? ShamahColors.accent : 
                                   index % 3 === 1 ? ShamahColors.secondary : 
                                   ShamahColors.primary,
                    transform: [
                      { translateX: particle.translateX },
                      { translateY: particle.translateY },
                      { scale: particle.scale },
                      { rotate: particleRotation },
                    ],
                    opacity: particle.opacity,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Logo com efeito de brilho */}
        <View style={styles.logoContainer}>
          {/* Efeito de brilho atrás do logo */}
          <Animated.View
            style={[
              styles.logoGlow,
              {
                opacity: glowOpacity,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          />
          
          <Animated.View
            style={[
              styles.introLogo,
              {
                transform: [
                  { scale: scaleAnim },
                  { rotate: logoRotation },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={['#ffffff', '#f0f0f0']}
              style={styles.logoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="flash" size={60} color={ShamahColors.primary} />
            </LinearGradient>
          </Animated.View>
        </View>

        {/* Texto */}
        <Animated.View
          style={[
            styles.introText,
            {
              transform: [{ translateY: textSlideAnim }],
              opacity: textOpacityAnim,
            },
          ]}
        >
          <Text style={styles.introTitle}>Shamah Publi</Text>
          <Text style={styles.introSubtitle}>Sua plataforma completa de publicidade</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

// Componente de transição entre telas
interface ShamahPageTransitionProps {
  visible: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  onComplete?: () => void;
}

export const ShamahPageTransition: React.FC<ShamahPageTransitionProps> = ({
  visible,
  direction = 'up',
  duration = 500,
  onComplete,
}) => {
  const translateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const startTransition = useCallback(() => {
    const startValue = getStartValue();
    
    translateAnim.setValue(startValue);
    opacityAnim.setValue(0);

    Animated.parallel([
      Animated.timing(translateAnim, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onComplete) {
        onComplete();
      }
    });
  }, [translateAnim, opacityAnim, duration, onComplete, direction]);

  const resetTransition = useCallback(() => {
    translateAnim.setValue(0);
    opacityAnim.setValue(0);
  }, [translateAnim, opacityAnim]);

  const getStartValue = useCallback(() => {
    switch (direction) {
      case 'up':
        return 50;
      case 'down':
        return -50;
      case 'left':
        return 50;
      case 'right':
        return -50;
      default:
        return 50;
    }
  }, [direction]);

  const getTransform = useCallback(() => {
    if (direction === 'left' || direction === 'right') {
      return [{ translateX: translateAnim }];
    }
    return [{ translateY: translateAnim }];
  }, [direction, translateAnim]);

  useEffect(() => {
    if (visible) {
      startTransition();
    } else {
      resetTransition();
    }
  }, [visible, startTransition, resetTransition]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.transitionContainer,
        {
          opacity: opacityAnim,
          transform: getTransform(),
        },
      ]}
    >
      <LinearGradient
        colors={[ShamahColors.primary, ShamahColors.secondary]}
        style={styles.transitionGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  introContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  introGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  introContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  particleContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  rippleEffect: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'transparent',
  },
  logoContainer: {
    position: 'relative',
    marginBottom: ShamahTheme.spacing.xl,
  },
  logoGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    top: -20,
    left: -20,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  introLogo: {
    marginBottom: ShamahTheme.spacing.xl,
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  introText: {
    alignItems: 'center',
  },
  introTitle: {
    fontSize: ShamahTheme.typography.sizes['4xl'],
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
    textAlign: 'center',
    marginBottom: ShamahTheme.spacing.sm,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  introSubtitle: {
    fontSize: ShamahTheme.typography.sizes.lg,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: ShamahTheme.typography.weights.medium,
  },
  transitionContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  transitionGradient: {
    flex: 1,
  },
});

export default {
  ShamahAppIntro,
  ShamahPageTransition,
};
