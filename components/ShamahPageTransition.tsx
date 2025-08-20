import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ShamahColors } from '../constants/Colors';
import { ShamahTheme, ShamahGradients } from '../constants/theme';
import { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring,
  interpolate,
  Extrapolate 
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface ShamahPageTransitionProps {
  visible: boolean;
  type?: 'slide' | 'fade' | 'scale' | 'curtain' | 'ripple' | 'particle';
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  onComplete?: () => void;
  children?: React.ReactNode;
}

export default function ShamahPageTransition({
  visible,
  type = 'slide',
  direction = 'up',
  duration = 500,
  onComplete,
  children,
}: ShamahPageTransitionProps) {
  const mainAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // Para efeito de partículas
  const particleAnims = useRef(
    Array.from({ length: 20 }, () => ({
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      rotate: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      startTransition();
    } else {
      resetTransition();
    }
  }, [visible]);

  const startTransition = () => {
    const animations = [];

    switch (type) {
      case 'slide':
        mainAnim.setValue(getInitialValue());
        animations.push(
          Animated.timing(mainAnim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          })
        );
        break;

      case 'fade':
        opacityAnim.setValue(0);
        animations.push(
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          })
        );
        break;

      case 'scale':
        scaleAnim.setValue(0.8);
        opacityAnim.setValue(0);
        animations.push(
          Animated.parallel([
            Animated.spring(scaleAnim, {
              toValue: 1,
              tension: 50,
              friction: 5,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case 'curtain':
        mainAnim.setValue(height);
        animations.push(
          Animated.timing(mainAnim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          })
        );
        break;

      case 'ripple':
        scaleAnim.setValue(0);
        opacityAnim.setValue(1);
        animations.push(
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: duration * 0.6,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: duration * 0.4,
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case 'particle':
        startParticleTransition();
        animations.push(
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          })
        );
        break;
    }

    if (animations.length > 0) {
      Animated.sequence(animations).start(() => {
        if (onComplete) {
          onComplete();
        }
      });
    }
  };

  const startParticleTransition = () => {
    particleAnims.forEach((particle, index) => {
      const delay = index * 50;
      const angle = (index / particleAnims.length) * 2 * Math.PI;
      const radius = 100 + Math.random() * 50;
      
      Animated.sequence([
        Animated.delay(delay),
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
          Animated.timing(particle.translateX, {
            toValue: Math.cos(angle) * radius,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(particle.translateY, {
            toValue: Math.sin(angle) * radius,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(particle.rotate, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const resetTransition = () => {
    mainAnim.setValue(0);
    opacityAnim.setValue(0);
    scaleAnim.setValue(0.8);
    rotateAnim.setValue(0);
    particleAnims.forEach(particle => {
      particle.scale.setValue(0);
      particle.opacity.setValue(0);
      particle.translateX.setValue(0);
      particle.translateY.setValue(0);
      particle.rotate.setValue(0);
    });
  };

  const getInitialValue = () => {
    switch (direction) {
      case 'up': return height;
      case 'down': return -height;
      case 'left': return width;
      case 'right': return -width;
      default: return height;
    }
  };

  const getTransform = () => {
    const transforms = [];

    switch (type) {
      case 'slide':
        if (direction === 'left' || direction === 'right') {
          transforms.push({ translateX: mainAnim });
        } else {
          transforms.push({ translateY: mainAnim });
        }
        break;

      case 'scale':
      case 'ripple':
        transforms.push({ scale: scaleAnim });
        break;

      case 'curtain':
        transforms.push({ translateY: mainAnim });
        break;
    }

    return transforms;
  };

  const getContainerStyle = () => {
    const baseStyle = [styles.container];
    
    switch (type) {
      case 'fade':
        return [
          ...baseStyle,
          {
            opacity: opacityAnim,
          },
        ];

      case 'particle':
        return [
          ...baseStyle,
          {
            opacity: opacityAnim,
          },
        ];

      default:
        return [
          ...baseStyle,
          {
            transform: getTransform(),
            opacity: type === 'scale' ? opacityAnim : 1,
          },
        ];
    }
  };

  if (!visible) return null;

  return (
    <Animated.View style={getContainerStyle()}>
      <LinearGradient
        colors={[ShamahColors.primary, ShamahColors.secondary]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Partículas para transição particle */}
        {type === 'particle' && (
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
                                     index % 3 === 1 ? '#ffffff' : 
                                     ShamahColors.secondary,
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
        )}

        {/* Conteúdo da transição */}
        {children}
      </LinearGradient>
    </Animated.View>
  );
}

// Componente para transições rápidas entre componentes
interface QuickTransitionProps {
  visible: boolean;
  type?: 'slideIn' | 'fadeIn' | 'scaleIn' | 'bounceIn';
  duration?: number;
  delay?: number;
  children: React.ReactNode;
}

export function QuickTransition({
  visible,
  type = 'fadeIn',
  duration = 300,
  delay = 0,
  children,
}: QuickTransitionProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.delay(delay),
        getAnimation(),
      ]).start();
    } else {
      anim.setValue(0);
    }
  }, [visible]);

  const getAnimation = () => {
    switch (type) {
      case 'slideIn':
        return Animated.timing(anim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        });

      case 'fadeIn':
        return Animated.timing(anim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        });

      case 'scaleIn':
        return Animated.spring(anim, {
          toValue: 1,
          tension: 50,
          friction: 5,
          useNativeDriver: true,
        });

      case 'bounceIn':
        return Animated.spring(anim, {
          toValue: 1,
          tension: 40,
          friction: 3,
          useNativeDriver: true,
        });

      default:
        return Animated.timing(anim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        });
    }
  };

  const getStyle = () => {
    switch (type) {
      case 'slideIn':
        return {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        };

      case 'fadeIn':
        return {
          opacity: anim,
        };

      case 'scaleIn':
      case 'bounceIn':
        return {
          opacity: anim,
          transform: [
            {
              scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        };

      default:
        return {
          opacity: anim,
        };
    }
  };

  if (!visible) return null;

  return (
    <Animated.View style={getStyle()}>
      {children}
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
    zIndex: 999,
  },
  gradient: {
    flex: 1,
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});


// Componente para transições de modal/overlay
interface ShamahModalTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
  backdropOpacity?: number;
  onBackdropPress?: () => void;
}

export function ShamahModalTransition({
  children,
  isVisible,
  backdropOpacity = 0.5,
  onBackdropPress,
}: ShamahModalTransitionProps) {
  const progress = useSharedValue(isVisible ? 1 : 0);

  React.useEffect(() => {
    progress.value = withSpring(isVisible ? 1 : 0, {
      damping: 20,
      stiffness: 200,
    });
  }, [isVisible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0, 1],
      [0, backdropOpacity],
      Extrapolate.CLAMP
    ),
  }));

  const modalStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        scale: interpolate(
          progress.value,
          [0, 1],
          [0.8, 1],
          Extrapolate.CLAMP
        ),
      },
      {
        translateY: interpolate(
          progress.value,
          [0, 1],
          [100, 0],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  if (!isVisible && progress.value === 0) return null;

  return (
    <View style={styles.modalContainer}>
      <Animated.View 
        style={[styles.backdrop, backdropStyle]}
        onTouchEnd={onBackdropPress}
      />
      <Animated.View style={[styles.modal, modalStyle]}>
        {children}
      </Animated.View>
    </View>
  );
}

// Componente para animação de loading da tela
interface ShamahLoadingTransitionProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export function ShamahLoadingTransition({
  isLoading,
  children,
  loadingComponent,
}: ShamahLoadingTransitionProps) {
  const loadingProgress = useSharedValue(isLoading ? 1 : 0);
  const contentProgress = useSharedValue(isLoading ? 0 : 1);

  React.useEffect(() => {
    if (isLoading) {
      loadingProgress.value = withTiming(1, { duration: 300 });
      contentProgress.value = withTiming(0, { duration: 200 });
    } else {
      loadingProgress.value = withTiming(0, { duration: 200 });
      contentProgress.value = withTiming(1, { duration: 300 });
    }
  }, [isLoading]);

  const loadingStyle = useAnimatedStyle(() => ({
    opacity: loadingProgress.value,
    transform: [
      {
        scale: interpolate(
          loadingProgress.value,
          [0, 1],
          [0.8, 1],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentProgress.value,
    transform: [
      {
        scale: interpolate(
          contentProgress.value,
          [0, 1],
          [1.1, 1],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  return (
    <View style={styles.container}>
      {isLoading && (
        <Animated.View style={[styles.loadingOverlay, loadingStyle]}>
          {loadingComponent || <DefaultLoadingComponent />}
        </Animated.View>
      )}
      <Animated.View style={[styles.contentContainer, contentStyle]}>
        {children}
      </Animated.View>
    </View>
  );
}

// Componente de loading padrão
function DefaultLoadingComponent() {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withTiming(360, { duration: 1000 });
  }, []);

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.loadingContainer}>
      <LinearGradient
        colors={ShamahGradients.primary}
        style={styles.loadingBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View style={[styles.loadingSpinner, rotationStyle]}>
          <View style={styles.loadingSpinnerInner} />
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

// Hook personalizado para controlar transições de página
export const useShamahPageTransition = (initialVisible = true) => {
  const [isVisible, setIsVisible] = React.useState(initialVisible);
  const [direction, setDirection] = React.useState<'slide-right' | 'slide-left' | 'slide-up' | 'slide-down' | 'fade' | 'scale'>('fade');

  const show = (transitionDirection?: typeof direction) => {
    if (transitionDirection) setDirection(transitionDirection);
    setIsVisible(true);
  };

  const hide = (transitionDirection?: typeof direction) => {
    if (transitionDirection) setDirection(transitionDirection);
    setIsVisible(false);
  };

  const toggle = (transitionDirection?: typeof direction) => {
    if (transitionDirection) setDirection(transitionDirection);
    setIsVisible(!isVisible);
  };

  return {
    isVisible,
    direction,
    show,
    hide,
    toggle,
    setDirection,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: ShamahTheme.borderRadius.xl,
    padding: ShamahTheme.spacing.xl,
    margin: ShamahTheme.spacing.lg,
    maxWidth: '90%',
    maxHeight: '80%',
    shadowColor: ShamahColors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  contentContainer: {
    flex: 1,
  },
  loadingContainer: {
    padding: ShamahTheme.spacing.xl,
    borderRadius: ShamahTheme.borderRadius.xl,
    shadowColor: ShamahColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  loadingBackground: {
    padding: ShamahTheme.spacing.xl,
    borderRadius: ShamahTheme.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: '#FFFFFF',
  },
  loadingSpinnerInner: {
    flex: 1,
  },
});
