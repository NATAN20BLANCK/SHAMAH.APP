import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ShamahTheme } from '../constants/theme';
import { ShamahColors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

export interface UpgradeAlertData {
  id: string;
  type: 'limit' | 'feature' | 'accounts' | 'storage' | 'ai' | 'premium';
  title: string;
  message: string;
  currentPlan: string;
  recommendedPlan: string;
  limitValue?: number;
  currentValue?: number;
  feature?: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

interface AutoUpgradeAlertProps {
  alert: UpgradeAlertData | null;
  visible: boolean;
  onClose: () => void;
  onUpgrade: (plan: string) => void;
  onDismiss: () => void;
  showAnimation?: boolean;
}

export default function AutoUpgradeAlert({
  alert,
  visible,
  onClose,
  onUpgrade,
  onDismiss,
  showAnimation = true,
}: AutoUpgradeAlertProps) {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // Animação de brilho para alertas críticos
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && alert) {
      showAlert();
      if (alert.urgency === 'critical' || alert.urgency === 'high') {
        startGlowAnimation();
      }
      if (alert.currentValue !== undefined && alert.limitValue !== undefined) {
        animateProgress();
      }
    } else {
      hideAlert();
    }
  }, [visible, alert]);

  const showAlert = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideAlert = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startGlowAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const animateProgress = () => {
    if (alert?.currentValue !== undefined && alert?.limitValue !== undefined) {
      const progressValue = (alert.currentValue / alert.limitValue) * 100;
      Animated.timing(progressAnim, {
        toValue: Math.min(progressValue, 100),
        duration: 1500,
        useNativeDriver: false,
      }).start();
    }
  };

  const getAlertConfig = () => {
    if (!alert) return null;

    const configs = {
      limit: {
        icon: 'warning',
        color: '#EF4444',
        gradient: ['#EF4444', '#DC2626'],
        bgColor: '#FEF2F2',
        title: 'Limite Atingido!',
        subtitle: 'Você atingiu o limite do seu plano',
      },
      feature: {
        icon: 'star',
        color: '#8B5CF6',
        gradient: ['#8B5CF6', '#7C3AED'],
        bgColor: '#FAF5FF',
        title: 'Recurso Premium',
        subtitle: 'Este recurso requer um plano superior',
      },
      accounts: {
        icon: 'people',
        color: '#3B82F6',
        gradient: ['#3B82F6', '#2563EB'],
        bgColor: '#EFF6FF',
        title: 'Mais Contas Necessárias',
        subtitle: 'Conecte mais contas sociais',
      },
      storage: {
        icon: 'cloud',
        color: '#F59E0B',
        gradient: ['#F59E0B', '#D97706'],
        bgColor: '#FFFBEB',
        title: 'Armazenamento Cheio',
        subtitle: 'Seu espaço de armazenamento está esgotando',
      },
      ai: {
        icon: 'brain',
        color: '#10B981',
        gradient: ['#10B981', '#059669'],
        bgColor: '#ECFDF5',
        title: 'Créditos IA Esgotados',
        subtitle: 'Você usou todos os créditos de IA do mês',
      },
      premium: {
        icon: 'diamond',
        color: '#EC4899',
        gradient: ['#EC4899', '#DB2777'],
        bgColor: '#FDF2F8',
        title: 'Funcionalidade Premium',
        subtitle: 'Desbloqueie todo o potencial do Shamah',
      },
    };

    return configs[alert.type] || configs.limit;
  };

  const getUrgencyStyle = () => {
    switch (alert?.urgency) {
      case 'critical':
        return { borderColor: '#DC2626', borderWidth: 3 };
      case 'high':
        return { borderColor: '#EF4444', borderWidth: 2 };
      case 'medium':
        return { borderColor: '#F59E0B', borderWidth: 1 };
      default:
        return { borderColor: '#E5E7EB', borderWidth: 1 };
    }
  };

  const config = getAlertConfig();
  if (!alert || !config) return null;

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <Animated.View
          style={[
            styles.alertContainer,
            getUrgencyStyle(),
            {
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          {/* Efeito de brilho para alertas críticos */}
          {(alert.urgency === 'critical' || alert.urgency === 'high') && (
            <Animated.View
              style={[
                styles.glowEffect,
                {
                  opacity: glowOpacity,
                  shadowColor: config.color,
                },
              ]}
            />
          )}

          <LinearGradient
            colors={[config.bgColor, '#FFFFFF']}
            style={styles.alertContent}
          >
            {/* Header com ícone e título */}
            <View style={styles.alertHeader}>
              <View style={[styles.iconContainer, { backgroundColor: config.color }]}>
                <Ionicons name={config.icon as any} size={28} color="white" />
              </View>
              
              <View style={styles.headerText}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertSubtitle}>{config.subtitle}</Text>
              </View>

              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Barra de progresso (se aplicável) */}
            {alert.currentValue !== undefined && alert.limitValue !== undefined && (
              <View style={styles.progressSection}>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressText}>
                    {alert.currentValue} / {alert.limitValue}
                  </Text>
                  <Text style={styles.progressPercentage}>
                    {Math.round((alert.currentValue / alert.limitValue) * 100)}%
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: config.color,
                        width: progressAnim.interpolate({
                          inputRange: [0, 100],
                          outputRange: ['0%', '100%'],
                          extrapolate: 'clamp',
                        }),
                      },
                    ]}
                  />
                </View>
              </View>
            )}

            {/* Mensagem */}
            <Text style={styles.alertMessage}>{alert.message}</Text>

            {/* Informações do plano */}
            <View style={styles.planSection}>
              <View style={styles.currentPlan}>
                <Text style={styles.planLabel}>Plano Atual</Text>
                <Text style={styles.planValue}>{alert.currentPlan}</Text>
              </View>
              
              <Ionicons name="arrow-forward" size={20} color={config.color} />
              
              <View style={styles.recommendedPlan}>
                <Text style={styles.planLabel}>Recomendado</Text>
                <Text style={[styles.planValue, { color: config.color }]}>
                  {alert.recommendedPlan}
                </Text>
              </View>
            </View>

            {/* Ações */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.dismissButton]}
                onPress={onDismiss}
              >
                <Text style={styles.dismissText}>Lembrar Depois</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.upgradeButton, { backgroundColor: config.color }]}
                onPress={() => onUpgrade(alert.recommendedPlan)}
              >
                <LinearGradient
                  colors={config.gradient as [string, string]}
                  style={styles.upgradeGradient}
                >
                  <Ionicons name="rocket" size={18} color="white" />
                  <Text style={styles.upgradeText}>Fazer Upgrade</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  alertContainer: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  glowEffect: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 25,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 15,
  },
  alertContent: {
    padding: ShamahTheme.spacing.lg,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ShamahTheme.spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ShamahTheme.spacing.md,
  },
  headerText: {
    flex: 1,
  },
  alertTitle: {
    fontSize: ShamahTheme.typography.sizes.lg,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: '#1F2937',
    marginBottom: 2,
  },
  alertSubtitle: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: '#6B7280',
  },
  closeButton: {
    padding: ShamahTheme.spacing.xs,
  },
  progressSection: {
    marginBottom: ShamahTheme.spacing.md,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ShamahTheme.spacing.xs,
  },
  progressText: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: '#374151',
    fontWeight: ShamahTheme.typography.weights.medium,
  },
  progressPercentage: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: '#6B7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  alertMessage: {
    fontSize: ShamahTheme.typography.sizes.base,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: ShamahTheme.spacing.lg,
  },
  planSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: ShamahTheme.spacing.md,
    borderRadius: 12,
    marginBottom: ShamahTheme.spacing.lg,
  },
  currentPlan: {
    flex: 1,
    alignItems: 'center',
  },
  recommendedPlan: {
    flex: 1,
    alignItems: 'center',
  },
  planLabel: {
    fontSize: ShamahTheme.typography.sizes.xs,
    color: '#6B7280',
    textTransform: 'uppercase',
    fontWeight: ShamahTheme.typography.weights.medium,
    marginBottom: 4,
  },
  planValue: {
    fontSize: ShamahTheme.typography.sizes.base,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: '#1F2937',
    textTransform: 'capitalize',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: ShamahTheme.spacing.md,
  },
  dismissButton: {
    flex: 1,
    paddingVertical: ShamahTheme.spacing.md,
    paddingHorizontal: ShamahTheme.spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  dismissText: {
    fontSize: ShamahTheme.typography.sizes.base,
    color: '#6B7280',
    fontWeight: ShamahTheme.typography.weights.medium,
  },
  upgradeButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  upgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ShamahTheme.spacing.md,
    paddingHorizontal: ShamahTheme.spacing.lg,
    gap: ShamahTheme.spacing.sm,
  },
  upgradeText: {
    fontSize: ShamahTheme.typography.sizes.base,
    color: 'white',
    fontWeight: ShamahTheme.typography.weights.bold,
  },
});