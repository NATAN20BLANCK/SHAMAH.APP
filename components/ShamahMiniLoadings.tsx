import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ShamahTheme } from '../constants/theme';
import { ShamahColors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

interface ShamahMiniLoadingProps {
  visible: boolean;
  message?: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: any;
}

// Componente pequeno para loading inline
export const ShamahMiniLoading: React.FC<ShamahMiniLoadingProps> = ({
  visible,
  message,
  size = 'medium',
  color = ShamahColors.primary,
  style
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const iconSize = size === 'small' ? 16 : size === 'medium' ? 24 : 32;
  const textSize = size === 'small' ? 12 : size === 'medium' ? 14 : 16;

  if (!visible) return null;

  return (
    <Animated.View style={[styles.miniContainer, style, { opacity: fadeAnim }]}>
      <Animated.View style={[styles.miniSpinner, { transform: [{ rotate: rotation }] }]}>
        <Ionicons name="sync" size={iconSize} color={color} />
      </Animated.View>
      {message && (
        <Text style={[styles.miniText, { fontSize: textSize, color }]}>
          {message}
        </Text>
      )}
    </Animated.View>
  );
};

interface ShamahProgressBarProps {
  progress: number;
  message?: string;
  visible?: boolean;
  style?: any;
}

// Barra de progresso independente
export const ShamahProgressBar: React.FC<ShamahProgressBarProps> = ({
  progress,
  message,
  visible = true,
  style
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  if (!visible) return null;

  return (
    <Animated.View style={[styles.progressContainer, style, { opacity: fadeAnim }]}>
      {message && <Text style={styles.progressMessage}>{message}</Text>}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressBar, { width: progressWidth }]}>
          <LinearGradient
            colors={[ShamahColors.primary, ShamahColors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.progressGradient}
          />
        </Animated.View>
      </View>
      <Text style={styles.progressText}>{Math.round(progress)}%</Text>
    </Animated.View>
  );
};

interface ShamahPulseProps {
  visible: boolean;
  size?: number;
  color?: string;
  style?: any;
}

// Animação de pulso simples
export const ShamahPulse: React.FC<ShamahPulseProps> = ({
  visible,
  size = 20,
  color = ShamahColors.primary,
  style
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.pulseContainer, 
        style, 
        { 
          opacity: fadeAnim,
          transform: [{ scale: pulseAnim }],
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        }
      ]} 
    />
  );
};

// Componente de loading para listas
interface ShamahListLoadingProps {
  visible: boolean;
  itemCount?: number;
  style?: any;
}

export const ShamahListLoading: React.FC<ShamahListLoadingProps> = ({
  visible,
  itemCount = 3,
  style
}) => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={[styles.listLoadingContainer, style]}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.listLoadingItem,
            {
              opacity: pulseAnim,
              marginBottom: index < itemCount - 1 ? ShamahTheme.spacing.md : 0,
            }
          ]}
        >
          <View style={styles.listLoadingAvatar} />
          <View style={styles.listLoadingContent}>
            <View style={styles.listLoadingTitle} />
            <View style={styles.listLoadingSubtitle} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  miniContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: ShamahTheme.spacing.sm,
  },
  miniSpinner: {
    marginRight: ShamahTheme.spacing.xs,
  },
  miniText: {
    fontWeight: ShamahTheme.typography.weights.medium,
  },
  progressContainer: {
    padding: ShamahTheme.spacing.md,
    alignItems: 'center',
  },
  progressMessage: {
    color: 'white',
    fontSize: ShamahTheme.typography.sizes.md,
    fontWeight: ShamahTheme.typography.weights.medium,
    marginBottom: ShamahTheme.spacing.sm,
    textAlign: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: ShamahTheme.spacing.sm,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressGradient: {
    flex: 1,
    borderRadius: 3,
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: ShamahTheme.typography.sizes.sm,
    fontWeight: ShamahTheme.typography.weights.medium,
  },
  pulseContainer: {
    // Estilos aplicados dinamicamente
  },
  listLoadingContainer: {
    padding: ShamahTheme.spacing.md,
  },
  listLoadingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: ShamahTheme.borderRadius.lg,
    padding: ShamahTheme.spacing.md,
  },
  listLoadingAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: ShamahTheme.spacing.md,
  },
  listLoadingContent: {
    flex: 1,
  },
  listLoadingTitle: {
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: ShamahTheme.spacing.xs,
    width: '70%',
  },
  listLoadingSubtitle: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    width: '50%',
  },
});

export default {
  ShamahMiniLoading,
  ShamahProgressBar,
  ShamahPulse,
  ShamahListLoading,
};
