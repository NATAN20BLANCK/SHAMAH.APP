import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ShamahTheme } from '../constants/theme';
import { ShamahColors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

interface ShamahLoadingScreenProps {
  visible: boolean;
  message?: string;
  type?: 'initial' | 'uploading' | 'processing' | 'downloading' | 'saving' | 'auth' | 'sync' | 'video-analysis' | 'ai-processing';
  progress?: number;
  onComplete?: () => void;
  subMessage?: string;
  showProgress?: boolean;
}

export default function ShamahLoadingScreen({ 
  visible, 
  message = 'Carregando...', 
  type = 'initial',
  progress = 0,
  onComplete,
  subMessage,
  showProgress = false
}: ShamahLoadingScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const particleAnims = useRef(
    Array.from({ length: 15 }, () => ({
      scale: new Animated.Value(0),
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      opacity: new Animated.Value(0),
      rotate: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      startAnimations();
    } else {
      stopAnimations();
    }
  }, [visible]);

  useEffect(() => {
    if (progress > 0) {
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [progress]);

  const startAnimations = () => {
    // Fade in principal
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Scale do logo
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Rotação contínua
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: getAnimationSpeed(),
        useNativeDriver: true,
      })
    ).start();

    // Pulso contínuo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animação das partículas
    startParticleAnimations();
  };

  const stopAnimations = () => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.3);
    rotateAnim.setValue(0);
    pulseAnim.setValue(1);
    progressAnim.setValue(0);
  };

  const startParticleAnimations = () => {
    particleAnims.forEach((particle, index) => {
      const delay = index * 150;
      const isFloating = index % 3 === 0;
      const isSpinning = index % 4 === 0;
      
      if (isFloating) {
        // Partículas flutuantes
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
              Animated.timing(particle.scale, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(particle.opacity, {
                toValue: 0.7,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(particle.translateY, {
                toValue: -60,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(particle.translateX, {
                toValue: (Math.random() - 0.5) * 40,
                duration: 2000,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(particle.scale, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(particle.opacity, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              }),
            ]),
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
      } else if (isSpinning) {
        // Partículas que giram
        Animated.loop(
          Animated.parallel([
            Animated.sequence([
              Animated.delay(delay),
              Animated.timing(particle.scale, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(particle.opacity, {
                toValue: 0.8,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.delay(1000),
              Animated.timing(particle.scale, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(particle.opacity, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
              }),
            ]),
            Animated.loop(
              Animated.timing(particle.rotate, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
              })
            ),
          ])
        ).start();
      } else {
        // Partículas padrão (original)
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
              Animated.timing(particle.scale, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(particle.opacity, {
                toValue: 0.8,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(particle.translateY, {
                toValue: -50,
                duration: 1200,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(particle.scale, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(particle.opacity, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(particle.translateY, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
          ])
        ).start();
      }
    });
  };

  const getLoadingIcon = () => {
    switch (type) {
      case 'uploading': return 'cloud-upload';
      case 'downloading': return 'cloud-download';
      case 'processing': return 'cog';
      case 'saving': return 'save';
      case 'auth': return 'person';
      case 'sync': return 'sync';
      case 'video-analysis': return 'videocam';
      case 'ai-processing': return 'brain';
      default: return 'flash';
    }
  };

  const getLoadingColors = (): [string, string] => {
    switch (type) {
      case 'uploading': return [ShamahColors.primary, ShamahColors.secondary];
      case 'downloading': return [ShamahColors.secondary, ShamahColors.accent];
      case 'processing': return [ShamahColors.accent, ShamahColors.primary];
      case 'saving': return ['#4CAF50', '#8BC34A'];
      case 'auth': return ['#FF9800', '#FF5722'];
      case 'sync': return ['#9C27B0', '#E91E63'];
      case 'video-analysis': return ['#2196F3', '#00BCD4'];
      case 'ai-processing': return ['#673AB7', '#3F51B5'];
      default: return [ShamahColors.primary, ShamahColors.secondary];
    }
  };

  const getAnimationSpeed = () => {
    switch (type) {
      case 'ai-processing': return 2000; // Mais lento para IA
      case 'video-analysis': return 2500;
      case 'processing': return 1800;
      default: return 3000;
    }
  };

  const getLoadingColor = () => {
    const colors = getLoadingColors();
    return colors[0];
  };

  useEffect(() => {
    if (visible) {
      startAnimations();
    } else {
      stopAnimations();
    }
  }, [visible]);

  if (!visible) return null;

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={getLoadingColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Partículas flutuantes */}
        <View style={styles.particlesContainer}>
          {particleAnims.map((particle, index) => {
            const isSpinning = index % 4 === 0;
            const spin = particle.rotate.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            });

            // Melhor distribuição horizontal das partículas
            const horizontalSpacing = width / 6; // Divide a tela em 6 colunas
            const leftPosition = (index % 6) * horizontalSpacing + Math.random() * (horizontalSpacing * 0.8);
            const topPosition = height / 4 + (Math.floor(index / 6) * 80) + Math.random() * 40;

            return (
              <Animated.View
                key={index}
                style={[
                  styles.particle,
                  {
                    left: leftPosition,
                    top: topPosition,
                    transform: [
                      { scale: particle.scale },
                      { translateY: particle.translateY },
                      { translateX: particle.translateX },
                      ...(isSpinning ? [{ rotate: spin }] : []),
                    ],
                    opacity: particle.opacity,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Logo e animação principal */}
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [
                  { scale: scaleAnim },
                  { rotate: spin },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={getLoadingColors()}
              style={styles.logoBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons 
                name={getLoadingIcon() as any} 
                size={60} 
                color="white" 
              />
            </LinearGradient>
          </Animated.View>

          {/* Título com animação */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Text style={styles.title}>Shamah Publi</Text>
          </Animated.View>

          <Text style={styles.subtitle}>Criando experiências incríveis</Text>

          {/* Barra de progresso (se aplicável) */}
          {(progress > 0 || showProgress) && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: getLoadingColor(),
                      width: progressAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                        extrapolate: 'clamp',
                      }),
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{Math.round(progress)}%</Text>
            </View>
          )}

          {/* Mensagem de status */}
          <Text style={styles.message}>{message}</Text>
          {subMessage && (
            <Text style={styles.subMessage}>{subMessage}</Text>
          )}

          {/* Indicador de loading animado */}
          <View style={styles.loadingIndicator}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.loadingDot,
                  {
                    backgroundColor: getLoadingColor(),
                    transform: [
                      {
                        scale: pulseAnim.interpolate({
                          inputRange: [1, 1.1],
                          outputRange: [0.8, 1.2],
                          extrapolate: 'clamp',
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Ondas animadas no fundo */}
        <View style={styles.wavesContainer}>
          <Animated.View
            style={[
              styles.wave,
              styles.wave1,
              {
                transform: [
                  {
                    translateX: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 100],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.wave,
              styles.wave2,
              {
                transform: [
                  {
                    translateX: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -150],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  logoContainer: {
    marginBottom: ShamahTheme.spacing.xl,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
  },
  title: {
    fontSize: ShamahTheme.typography.sizes['4xl'],
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
    textAlign: 'center',
    marginBottom: ShamahTheme.spacing.sm,
  },
  subtitle: {
    fontSize: ShamahTheme.typography.sizes.lg,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: ShamahTheme.spacing.xl,
    fontWeight: ShamahTheme.typography.weights.medium,
  },
  progressContainer: {
    width: width * 0.7,
    alignItems: 'center',
    marginBottom: ShamahTheme.spacing.lg,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: ShamahTheme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: ShamahColors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: ShamahTheme.typography.weights.medium,
  },
  message: {
    fontSize: ShamahTheme.typography.sizes.base,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: ShamahTheme.spacing.xl,
    fontWeight: ShamahTheme.typography.weights.medium,
  },
  subMessage: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: ShamahTheme.spacing.lg,
    fontWeight: ShamahTheme.typography.weights.regular,
    fontStyle: 'italic',
  },
  loadingIndicator: {
    flexDirection: 'row',
    gap: ShamahTheme.spacing.sm,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  wavesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: -100,
    width: width + 200,
    height: 100,
    borderRadius: 50,
  },
  wave1: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: 20,
  },
  wave2: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: 0,
    height: 80,
  },
});
