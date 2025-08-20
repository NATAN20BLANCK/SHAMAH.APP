import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ShamahTheme, ShamahColors } from '../constants/theme';
import { ShamahGradients } from '../constants/Colors';
import { usePressAnimation, useFloatAnimation } from './ShamahAnimations';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface ShamahButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'outline';
  size?: 'small' | 'medium' | 'large';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  glow?: boolean;
  float?: boolean;
}

export default function ShamahButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
  glow = false,
  float = false,
}: ShamahButtonProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();
  const floatStyle = useFloatAnimation();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: ShamahGradients.primary,
          textColor: '#FFFFFF',
          borderColor: 'transparent',
        };
      case 'secondary':
        return {
          background: ShamahGradients.secondary,
          textColor: '#FFFFFF',
          borderColor: 'transparent',
        };
      case 'success':
        return {
          background: [ShamahColors.success, ShamahColors.success] as const,
          textColor: '#FFFFFF',
          borderColor: 'transparent',
        };
      case 'warning':
        return {
          background: [ShamahColors.warning, ShamahColors.warning] as const,
          textColor: '#FFFFFF',
          borderColor: 'transparent',
        };
      case 'danger':
        return {
          background: [ShamahColors.danger, ShamahColors.danger] as const,
          textColor: '#FFFFFF',
          borderColor: 'transparent',
        };
      case 'ghost':
        return {
          background: ['transparent', 'transparent'] as const,
          textColor: ShamahColors.primary,
          borderColor: 'transparent',
        };
      case 'outline':
        return {
          background: ['transparent', 'transparent'] as const,
          textColor: ShamahColors.primary,
          borderColor: ShamahColors.primary,
        };
      default:
        return {
          background: ShamahGradients.primary,
          textColor: '#FFFFFF',
          borderColor: 'transparent',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: ShamahTheme.spacing.sm,
          paddingHorizontal: ShamahTheme.spacing.md,
          fontSize: ShamahTheme.typography.sizes.sm,
          iconSize: 16,
        };
      case 'large':
        return {
          paddingVertical: ShamahTheme.spacing.lg,
          paddingHorizontal: ShamahTheme.spacing.xl,
          fontSize: ShamahTheme.typography.sizes.lg,
          iconSize: 24,
        };
      default: // medium
        return {
          paddingVertical: ShamahTheme.spacing.md,
          paddingHorizontal: ShamahTheme.spacing.lg,
          fontSize: ShamahTheme.typography.sizes.base,
          iconSize: 20,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const combinedAnimatedStyle = float 
    ? [animatedStyle, floatStyle, style]
    : [animatedStyle, style];

  const buttonContent = (
    <>
      {icon && iconPosition === 'left' && (
        <Ionicons 
          name={icon} 
          size={sizeStyles.iconSize} 
          color={variantStyles.textColor}
          style={{ marginRight: 8 }}
        />
      )}
      <Text style={[
        styles.text,
        { 
          color: variantStyles.textColor, 
          fontSize: sizeStyles.fontSize 
        },
        textStyle
      ]}>
        {title}
      </Text>
      {icon && iconPosition === 'right' && (
        <Ionicons 
          name={icon} 
          size={sizeStyles.iconSize} 
          color={variantStyles.textColor}
          style={{ marginLeft: 8 }}
        />
      )}
    </>
  );

  if (variant === 'ghost' || variant === 'outline') {
    return (
      <AnimatedTouchableOpacity
        style={[
          styles.button,
          {
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            borderColor: variantStyles.borderColor,
            borderWidth: variant === 'outline' ? 2 : 0,
            width: fullWidth ? '100%' : 'auto',
            opacity: disabled ? 0.5 : 1,
          },
          glow && styles.glow,
          ...combinedAnimatedStyle,
        ]}
        onPress={disabled || loading ? undefined : onPress}
        onPressIn={disabled || loading ? undefined : onPressIn}
        onPressOut={disabled || loading ? undefined : onPressOut}
        activeOpacity={0.8}
        disabled={disabled || loading}
      >
        {buttonContent}
      </AnimatedTouchableOpacity>
    );
  }

  return (
    <AnimatedLinearGradient
      colors={variantStyles.background}
      style={[
        styles.button,
        {
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          width: fullWidth ? '100%' : 'auto',
          opacity: disabled ? 0.5 : 1,
        },
        glow && styles.glow,
        ...combinedAnimatedStyle,
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <AnimatedTouchableOpacity
        style={styles.buttonInner}
        onPress={disabled || loading ? undefined : onPress}
        onPressIn={disabled || loading ? undefined : onPressIn}
        onPressOut={disabled || loading ? undefined : onPressOut}
        activeOpacity={1}
        disabled={disabled || loading}
      >
        {buttonContent}
      </AnimatedTouchableOpacity>
    </AnimatedLinearGradient>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: ShamahTheme.borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ShamahColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    fontWeight: ShamahTheme.typography.weights.semibold,
    textAlign: 'center',
  },
  glow: {
    shadowColor: ShamahColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
});

// Componente de botão FAB personalizado
interface ShamahFABProps {
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  glow?: boolean;
  pulse?: boolean;
}

export function ShamahFAB({
  onPress,
  icon = 'add',
  variant = 'primary',
  size = 'medium',
  style,
  glow = true,
  pulse = false,
}: ShamahFABProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 48, height: 48, iconSize: 20 };
      case 'large':
        return { width: 80, height: 80, iconSize: 32 };
      default:
        return { width: 64, height: 64, iconSize: 24 };
    }
  };

  const getVariantGradient = () => {
    switch (variant) {
      case 'secondary':
        return ShamahGradients.secondary;
      case 'success':
        return [ShamahColors.success, ShamahColors.success] as const;
      default:
        return ShamahGradients.primary;
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <AnimatedLinearGradient
      colors={getVariantGradient()}
      style={[
        styles.button,
        fabStyles.fab,
        {
          width: sizeStyles.width,
          height: sizeStyles.height,
          borderRadius: sizeStyles.width / 2,
        },
        glow && fabStyles.fabGlow,
        animatedStyle,
        style,
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <AnimatedTouchableOpacity
        style={fabStyles.fabInner}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <Ionicons name={icon} size={sizeStyles.iconSize} color="#FFFFFF" />
      </AnimatedTouchableOpacity>
    </AnimatedLinearGradient>
  );
}

const fabStyles = StyleSheet.create({
  fab: {
    shadowColor: ShamahColors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  fabInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabGlow: {
    shadowColor: ShamahColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 15,
  },
});
