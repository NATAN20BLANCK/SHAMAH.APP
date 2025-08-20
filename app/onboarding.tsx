import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '../utils/AsyncStorage';
import ShamahAnimatedBackground from '../components/ShamahAnimatedBackground';
import ShamahCard from '../components/ShamahCard';
import ShamahButton from '../components/ShamahButton';
import { AnimatedScreen, AnimatedCard, FloatingElement } from '../components/ShamahAnimations';
import { ShamahTheme } from '../constants/theme';
import { ShamahColors } from '../constants/Colors';
import { useLoading } from '../contexts/LoadingContext';
import { ShamahPageTransition } from '../components/ShamahIntroAnimations';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  runOnUI
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface OnboardingStep {
  id: number;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  color: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    icon: 'create-outline',
    title: 'Crie Conteúdo',
    description: 'Crie posts incríveis para suas redes sociais com facilidade e criatividade',
    color: ShamahColors.primary,
  },
  {
    id: 2,
    icon: 'calendar-outline',
    title: 'Agende Posts',
    description: 'Programe seus posts para serem publicados automaticamente no melhor horário',
    color: ShamahColors.secondary,
  },
  {
    id: 3,
    icon: 'people-outline',
    title: 'Sistema de Afiliados',
    description: 'Ganhe comissões convidando pessoas e construa sua rede de afiliados',
    color: ShamahColors.success,
  },
];

const FloatingIcon = ({ name, size, color }: { name: any, size: number, color: string }) => {
  return (
    <Ionicons name={name} size={size} color={color} />
  );
};

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTransition, setShowTransition] = useState(false);
  const { showSyncLoading, hideLoading } = useLoading();

  const handleNext = async () => {
    // Step 3 - Solicitar permissões
    if (currentStep === 2) {
      showSyncLoading('Solicitando permissões...');
      
      try {
        // Simular solicitação de permissões
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        Alert.alert(
          '📱 Permissões Concedidas',
          'Agora você pode usar câmera e galeria para criar posts incríveis!',
          [{ text: 'Continuar', onPress: () => {
            hideLoading();
            setCurrentStep(currentStep + 1);
          }}]
        );
      } catch (error) {
        hideLoading();
        Alert.alert('Erro', 'Não foi possível conceder permissões. Você pode configurar isso depois nas configurações.');
        setCurrentStep(currentStep + 1);
      }
      return;
    }

    if (currentStep < onboardingSteps.length - 1) {
      setShowTransition(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setShowTransition(false);
      }, 300);
    } else {
      // Último step - marcar como visto e ir para login
      showSyncLoading('Redirecionando para login...');
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      
      setTimeout(() => {
        hideLoading();
        router.replace('/login');
      }, 1000);
    }
  };

  const handleSkip = async () => {
    showSyncLoading('Redirecionando para login...');
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    
    setTimeout(() => {
      hideLoading();
      router.replace('/login');
    }, 800);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setShowTransition(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setShowTransition(false);
      }, 300);
    }
  };

  const currentData = onboardingSteps[currentStep];

  return (
    <ShamahAnimatedBackground variant="cosmic" style={styles.container}>
      <ShamahPageTransition visible={showTransition} direction="left" />
      
      <View style={styles.mainContainer}>
        {/* Header com Skip */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Pular</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={[currentData.color, ShamahColors.accent]}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FloatingIcon name={currentData.icon} size={80} color="white" />
            </LinearGradient>
          </View>

          <ShamahCard variant="glass" style={styles.textCard}>
            <Text style={styles.stepTitle}>{currentData.title}</Text>
            <Text style={styles.stepDescription}>{currentData.description}</Text>
          </ShamahCard>
        </View>

        {/* Indicators */}
        <View style={styles.indicatorsContainer}>
          <View style={styles.indicators}>
            {onboardingSteps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentStep ? styles.activeIndicator : styles.inactiveIndicator,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Navigation */}
        <View style={styles.navigation}>
          <View style={styles.navButtons}>
            {currentStep > 0 && (
              <TouchableOpacity style={styles.backButton} onPress={handlePrevious}>
                <Ionicons name="arrow-back" size={24} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            )}
            
            <View style={styles.nextButtonContainer}>
              <ShamahButton
                title={currentStep === onboardingSteps.length - 1 ? 'Começar' : 'Próximo'}
                onPress={handleNext}
                style={styles.nextButton}
              />
            </View>
          </View>
        </View>
      </View>
    </ShamahAnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: ShamahTheme.spacing.md,
    paddingBottom: 20,
    alignItems: 'flex-end',
  },
  skipButton: {
    paddingVertical: ShamahTheme.spacing.sm,
    paddingHorizontal: ShamahTheme.spacing.md,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: ShamahTheme.typography.sizes.base,
    fontWeight: ShamahTheme.typography.weights.medium,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ShamahTheme.spacing.md,
  },
  iconContainer: {
    marginBottom: ShamahTheme.spacing.xl,
  },
  iconGradient: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ShamahColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 20,
  },
  textCard: {
    padding: ShamahTheme.spacing.xl,
    alignItems: 'center',
    maxWidth: width * 0.9,
  },
  stepTitle: {
    fontSize: ShamahTheme.typography.sizes['2xl'],
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
    textAlign: 'center',
    marginBottom: ShamahTheme.spacing.md,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  stepDescription: {
    fontSize: ShamahTheme.typography.sizes.lg,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: ShamahTheme.typography.weights.medium,
  },
  indicatorsContainer: {
    paddingHorizontal: ShamahTheme.spacing.md,
    paddingVertical: ShamahTheme.spacing.lg,
    alignItems: 'center',
  },
  indicators: {
    flexDirection: 'row',
    gap: ShamahTheme.spacing.sm,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  activeIndicator: {
    backgroundColor: ShamahColors.primary,
    transform: [{ scale: 1.2 }],
  },
  inactiveIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  navigation: {
    paddingHorizontal: ShamahTheme.spacing.md,
    paddingBottom: 60,
  },
  navButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  nextButtonContainer: {
    flex: 1,
    marginLeft: ShamahTheme.spacing.md,
  },
  nextButton: {
    width: '100%',
  },
});
