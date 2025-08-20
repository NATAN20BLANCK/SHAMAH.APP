import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ShamahTheme, ShamahColors } from '../constants/theme';

interface ShamahCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'glass' | 'outlined';
  onPress?: () => void;
  style?: any;
  contentStyle?: any;
  glowColor?: string;
  title?: string;
  subtitle?: string;
}

export default function ShamahCard({
  children,
  variant = 'default',
  onPress,
  style,
  contentStyle,
  glowColor = ShamahColors.primary,
  title,
  subtitle,
}: ShamahCardProps) {
  const getCardStyle = () => {
    switch (variant) {
      case 'gradient':
        return styles.gradientCard;
      case 'glass':
        return styles.glassCard;
      case 'outlined':
        return styles.outlinedCard;
      default:
        return styles.defaultCard;
    }
  };

  const CardContent = () => (
    <View style={[getCardStyle(), style]}>
      {variant === 'gradient' && (
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
          style={styles.gradientOverlay}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}
      
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
      
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
      
      {/* Glow effect */}
      <View 
        style={[
          styles.glow, 
          { shadowColor: glowColor }
        ]} 
      />
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.95}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
}

const styles = StyleSheet.create({
  defaultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: ShamahTheme.borderRadius.xl,
    padding: ShamahTheme.spacing.lg,
    marginVertical: ShamahTheme.spacing.sm,
    shadowColor: ShamahColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  
  gradientCard: {
    borderRadius: ShamahTheme.borderRadius.xl,
    padding: ShamahTheme.spacing.lg,
    marginVertical: ShamahTheme.spacing.sm,
    shadowColor: ShamahColors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: ShamahTheme.borderRadius.xl,
    padding: ShamahTheme.spacing.lg,
    marginVertical: ShamahTheme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(20px)',
    position: 'relative',
    overflow: 'hidden',
  },
  
  outlinedCard: {
    backgroundColor: 'transparent',
    borderRadius: ShamahTheme.borderRadius.xl,
    padding: ShamahTheme.spacing.lg,
    marginVertical: ShamahTheme.spacing.sm,
    borderWidth: 2,
    borderColor: ShamahColors.primary,
    position: 'relative',
    overflow: 'hidden',
  },
  
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: ShamahTheme.borderRadius.xl,
  },
  
  header: {
    marginBottom: ShamahTheme.spacing.md,
  },
  
  title: {
    fontSize: ShamahTheme.typography.sizes.lg,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: ShamahColors.neutral[900],
    marginBottom: ShamahTheme.spacing.xs,
  },
  
  subtitle: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: ShamahColors.neutral[600],
    lineHeight: 20,
  },
  
  content: {
    position: 'relative',
    zIndex: 2,
  },
  
  glow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: ShamahTheme.borderRadius.xl + 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    zIndex: -1,
  },
});
