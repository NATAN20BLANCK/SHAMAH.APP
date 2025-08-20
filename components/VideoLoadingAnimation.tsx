import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { ShamahTheme } from '../constants/theme';
import { ShamahColors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

interface VideoLoadingAnimationProps {
  visible: boolean;
  stage: 'uploading' | 'processing' | 'analyzing' | 'generating' | 'complete';
  progress?: number;
  message?: string;
  onComplete?: () => void;
}

export default function VideoLoadingAnimation({ 
  visible, 
  stage = 'uploading',
  progress = 0,
  message,
  onComplete 
}: VideoLoadingAnimationProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const stageScaleAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnims = useRef(
    Array.from({ length: 12 }, () => ({
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
      rotate: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      startAnimations();
    } else {
      resetAnimations();
    }
  }, [visible]);

  useEffect(() => {
    if (progress > 0) {
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [progress]);

  useEffect(() => {
    // Animar mudança de estágio
    Animated.sequence([
      Animated.timing(stageScaleAnim, {
        toValue: 1.3,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(stageScaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [stage]);

  const startAnimations = () => {
    // Fade in principal
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Animação de ondas contínua
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Animação de brilhos/sparkles
    startSparkleAnimations();
  };

  const startSparkleAnimations = () => {
    sparkleAnims.forEach((sparkle, index) => {
      const delay = index * 200;
      const angle = (index / sparkleAnims.length) * 2 * Math.PI;
      const radius = 80 + Math.random() * 40;
      
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(sparkle.scale, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(sparkle.opacity, {
              toValue: 0.8,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(sparkle.translateX, {
              toValue: Math.cos(angle) * radius,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(sparkle.translateY, {
              toValue: Math.sin(angle) * radius,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(sparkle.rotate, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(sparkle.scale, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(sparkle.opacity, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
          // Reset
          Animated.timing(sparkle.translateX, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(sparkle.translateY, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(sparkle.rotate, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  };

  const resetAnimations = () => {
    fadeAnim.setValue(0);
    stageScaleAnim.setValue(0);
    progressAnim.setValue(0);
    waveAnim.setValue(0);
    sparkleAnims.forEach(sparkle => {
      sparkle.scale.setValue(0);
      sparkle.opacity.setValue(0);
      sparkle.rotate.setValue(0);
      sparkle.translateX.setValue(0);
      sparkle.translateY.setValue(0);
    });
  };

  const getStageInfo = () => {
    switch (stage) {
      case 'uploading':
        return {
          icon: 'cloud-upload',
          title: 'Enviando Vídeo',
          description: 'Fazendo upload do seu conteúdo...',
          color: '#4CAF50',
          gradient: ['#4CAF50', '#8BC34A'],
        };
      case 'processing':
        return {
          icon: 'settings',
          title: 'Processando',
          description: 'Preparando o vídeo para análise...',
          color: '#FF9800',
          gradient: ['#FF9800', '#FFC107'],
        };
      case 'analyzing':
        return {
          icon: 'analytics',
          title: 'Analisando Conteúdo',
          description: 'IA avaliando o melhor formato para cada plataforma...',
          color: '#2196F3',
          gradient: ['#2196F3', '#00BCD4'],
        };
      case 'generating':
        return {
          icon: 'create',
          title: 'Gerando Versões',
          description: 'Criando adaptações personalizadas...',
          color: '#9C27B0',
          gradient: ['#9C27B0', '#E91E63'],
        };
      case 'complete':
        return {
          icon: 'checkmark-circle',
          title: 'Concluído!',
          description: 'Vídeo pronto para publicação',
          color: '#4CAF50',
          gradient: ['#4CAF50', '#8BC34A'],
        };
      default:
        return {
          icon: 'play',
          title: 'Preparando...',
          description: 'Iniciando processamento...',
          color: ShamahColors.primary,
          gradient: [ShamahColors.primary, ShamahColors.secondary],
        };
    }
  };

  const stageInfo = getStageInfo();
  
  const waveTranslateX = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={stageInfo.gradient}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Animação de ondas de fundo */}
        <View style={styles.waveContainer}>
          <Animated.View
            style={[
              styles.wave,
              {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: [{ translateX: waveTranslateX }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.wave,
              styles.wave2,
              {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                transform: [
                  {
                    translateX: waveAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -width],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>

        {/* Sparkles animados */}
        <View style={styles.sparkleContainer}>
          {sparkleAnims.map((sparkle, index) => {
            const sparkleRotation = sparkle.rotate.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            });
            
            return (
              <Animated.View
                key={index}
                style={[
                  styles.sparkle,
                  {
                    transform: [
                      { translateX: sparkle.translateX },
                      { translateY: sparkle.translateY },
                      { scale: sparkle.scale },
                      { rotate: sparkleRotation },
                    ],
                    opacity: sparkle.opacity,
                  },
                ]}
              >
                <Ionicons name="star" size={8} color="rgba(255, 255, 255, 0.8)" />
              </Animated.View>
            );
          })}
        </View>

        {/* Conteúdo principal */}
        <View style={styles.content}>
          {/* Ícone do estágio atual */}
          <Animated.View
            style={[
              styles.stageIconContainer,
              {
                transform: [{ scale: stageScaleAnim }],
              },
            ]}
          >
            <View style={styles.iconBackground}>
              <Ionicons 
                name={stageInfo.icon as any} 
                size={48} 
                color="white" 
              />
            </View>
          </Animated.View>

          {/* Título e descrição */}
          <Text style={styles.stageTitle}>{stageInfo.title}</Text>
          <Text style={styles.stageDescription}>{stageInfo.description}</Text>

          {/* Barra de progresso */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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

          {/* Mensagem customizada */}
          {message && (
            <Text style={styles.customMessage}>{message}</Text>
          )}

          {/* Indicadores de etapas */}
          <View style={styles.stepsContainer}>
            {['uploading', 'processing', 'analyzing', 'generating'].map((step, index) => (
              <View
                key={step}
                style={[
                  styles.stepIndicator,
                  {
                    backgroundColor: 
                      ['uploading', 'processing', 'analyzing', 'generating'].indexOf(stage) >= index
                        ? 'rgba(255, 255, 255, 0.9)'
                        : 'rgba(255, 255, 255, 0.3)',
                  },
                ]}
              />
            ))}
          </View>
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
    zIndex: 1000,
  },
  gradient: {
    flex: 1,
  },
  waveContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    width: width * 2,
    height: height,
    borderRadius: width,
    top: height * 0.7,
    left: -width * 0.5,
  },
  wave2: {
    top: height * 0.8,
    left: -width * 0.3,
  },
  sparkleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkle: {
    position: 'absolute',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ShamahTheme.spacing.xl,
  },
  stageIconContainer: {
    marginBottom: ShamahTheme.spacing.xl,
  },
  iconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  stageTitle: {
    fontSize: ShamahTheme.typography.sizes['2xl'],
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
    textAlign: 'center',
    marginBottom: ShamahTheme.spacing.sm,
  },
  stageDescription: {
    fontSize: ShamahTheme.typography.sizes.base,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: ShamahTheme.spacing.xl,
    lineHeight: 24,
  },
  progressContainer: {
    width: '80%',
    marginBottom: ShamahTheme.spacing.lg,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: ShamahTheme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: ShamahTheme.typography.weights.medium,
  },
  customMessage: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: ShamahTheme.spacing.lg,
    fontStyle: 'italic',
  },
  stepsContainer: {
    flexDirection: 'row',
    gap: ShamahTheme.spacing.sm,
    marginTop: ShamahTheme.spacing.lg,
  },
  stepIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
