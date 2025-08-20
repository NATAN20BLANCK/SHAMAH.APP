
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ShamahTheme } from '../constants/theme';
import { ShamahColors } from '../constants/Colors';
import { useUpgradeAlerts } from '../hooks/useUpgradeAlerts';
import AutoUpgradeAlert from '../components/AutoUpgradeAlert';
import ShamahBackground from '../components/ShamahBackground';

export default function ServicosScreen() {
  const {
    currentAlert,
    isAlertVisible,
    showFeatureAlert,
    checkTabAlerts,
    dismissAlert,
    closeAlert,
    handleUpgrade,
  } = useUpgradeAlerts();

  // Verificar alertas específicos quando a tela ganha foco
  useFocusEffect(
    React.useCallback(() => {
      checkTabAlerts('servicos');
    }, [checkTabAlerts])
  );

  const handleServicePress = (serviceName: string, isPremium: boolean = false) => {
    if (isPremium) {
      showFeatureAlert(serviceName, 'professional');
    } else {
      // Navegar para o serviço
      console.log(`Acessando serviço: ${serviceName}`);
    }
  };

  const services = [
    {
      id: 'ai-content',
      title: 'Geração de Conteúdo com IA',
      description: 'Crie textos e legendas automaticamente',
      icon: 'brain',
      isPremium: true,
      gradient: ['#667eea', '#764ba2'],
    },
    {
      id: 'video-editor',
      title: 'Editor de Vídeo Avançado',
      description: 'Edite vídeos profissionalmente',
      icon: 'film',
      isPremium: true,
      gradient: ['#f093fb', '#f5576c'],
    },
    {
      id: 'analytics',
      title: 'Analytics Avançado',
      description: 'Relatórios detalhados de performance',
      icon: 'analytics',
      isPremium: false,
      gradient: ['#4facfe', '#00f2fe'],
    },
    {
      id: 'scheduling',
      title: 'Agendamento Inteligente',
      description: 'Programe posts no melhor horário',
      icon: 'time',
      isPremium: false,
      gradient: ['#43e97b', '#38f9d7'],
    },
    {
      id: 'collaboration',
      title: 'Colaboração em Equipe',
      description: 'Trabalhe em equipe eficientemente',
      icon: 'people',
      isPremium: true,
      gradient: ['#fa709a', '#fee140'],
    },
    {
      id: 'brand-kit',
      title: 'Kit de Marca',
      description: 'Mantenha consistência visual',
      icon: 'brush',
      isPremium: true,
      gradient: ['#a8edea', '#fed6e3'],
    },
  ];

  return (
    <>
      <ShamahBackground variant="cosmic" style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Serviços Shamah</Text>
            <Text style={styles.subtitle}>
              Ferramentas poderosas para elevar sua presença digital
            </Text>
          </View>

          {/* Services Grid */}
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() => handleServicePress(service.title, service.isPremium)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={service.gradient as [string, string]}
                  style={styles.serviceGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.serviceContent}>
                    <View style={styles.serviceHeader}>
                      <View style={styles.serviceIcon}>
                        <Ionicons 
                          name={service.icon as any} 
                          size={28} 
                          color="white" 
                        />
                      </View>
                      {service.isPremium && (
                        <View style={styles.premiumBadge}>
                          <Ionicons name="star" size={12} color="#FFD700" />
                          <Text style={styles.premiumText}>PRO</Text>
                        </View>
                      )}
                    </View>
                    
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    <Text style={styles.serviceDescription}>
                      {service.description}
                    </Text>

                    <View style={styles.serviceAction}>
                      <Text style={styles.actionText}>
                        {service.isPremium ? 'Upgrade para Acessar' : 'Usar Agora'}
                      </Text>
                      <Ionicons 
                        name="arrow-forward" 
                        size={16} 
                        color="rgba(255, 255, 255, 0.8)" 
                      />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <LinearGradient
              colors={[ShamahColors.primary, ShamahColors.secondary]}
              style={styles.ctaGradient}
            >
              <Ionicons name="rocket" size={32} color="white" />
              <Text style={styles.ctaTitle}>Desbloqueie Todo o Potencial</Text>
              <Text style={styles.ctaSubtitle}>
                Acesse todos os serviços premium com um upgrade
              </Text>
              <TouchableOpacity 
                style={styles.ctaButton}
                onPress={() => handleUpgrade('professional')}
              >
                <Text style={styles.ctaButtonText}>Ver Planos</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </ScrollView>
      </ShamahBackground>

      {/* Alert de Upgrade */}
      <AutoUpgradeAlert
        alert={currentAlert}
        visible={isAlertVisible}
        onClose={closeAlert}
        onUpgrade={handleUpgrade}
        onDismiss={dismissAlert}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: ShamahTheme.spacing.md,
  },
  header: {
    paddingTop: ShamahTheme.spacing.xl,
    paddingBottom: ShamahTheme.spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: ShamahTheme.typography.sizes['3xl'],
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
    textAlign: 'center',
    marginBottom: ShamahTheme.spacing.sm,
  },
  subtitle: {
    fontSize: ShamahTheme.typography.sizes.base,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ShamahTheme.spacing.md,
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: ShamahTheme.spacing.md,
  },
  serviceGradient: {
    padding: ShamahTheme.spacing.md,
    minHeight: 160,
  },
  serviceContent: {
    flex: 1,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: ShamahTheme.spacing.sm,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: '#FFD700',
  },
  serviceTitle: {
    fontSize: ShamahTheme.typography.sizes.base,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
    marginBottom: ShamahTheme.spacing.xs,
  },
  serviceDescription: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: ShamahTheme.spacing.md,
  },
  serviceAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  actionText: {
    fontSize: ShamahTheme.typography.sizes.sm,
    fontWeight: ShamahTheme.typography.weights.medium,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  ctaSection: {
    marginVertical: ShamahTheme.spacing.xl,
    borderRadius: 20,
    overflow: 'hidden',
  },
  ctaGradient: {
    padding: ShamahTheme.spacing.xl,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: ShamahTheme.typography.sizes.xl,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
    textAlign: 'center',
    marginVertical: ShamahTheme.spacing.md,
  },
  ctaSubtitle: {
    fontSize: ShamahTheme.typography.sizes.base,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: ShamahTheme.spacing.lg,
  },
  ctaButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: ShamahTheme.spacing.xl,
    paddingVertical: ShamahTheme.spacing.md,
    borderRadius: 12,
  },
  ctaButtonText: {
    fontSize: ShamahTheme.typography.sizes.base,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
  },
});
