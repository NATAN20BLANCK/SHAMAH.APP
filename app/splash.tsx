import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '../utils/AsyncStorage';
import ShamahBackground from '../components/ShamahBackground';
import { ShamahTheme } from '../constants/theme';
import { ShamahColors } from '../constants/Colors';
import { ShamahAppIntro } from '../components/ShamahIntroAnimations';
import ShamahLoadingScreen from '../components/ShamahLoadingScreen';

export default function SplashScreen() {
  const [showIntro, setShowIntro] = useState(true);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Mostrar loading após intro
        setShowLoading(true);
        
        // Simular carregamento inicial
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verificar se o usuário já passou pelo onboarding
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        
        // Navegar para a tela apropriada
        if (hasSeenOnboarding) {
          router.replace('/login');
        } else {
          router.replace('/onboarding');
        }
      } catch (error) {
        console.error('Erro na inicialização:', error);
        // Em caso de erro, ir para onboarding
        router.replace('/onboarding');
      }
    };

    // Mostrar animação de entrada primeiro
    setTimeout(() => {
      setShowIntro(false);
      initializeApp();
    }, 4000); // Aumentei para 4 segundos para uma melhor experiência
  }, []);

  // Animação de introdução principal
  if (showIntro) {
    return <ShamahAppIntro visible={true} />;
  }

  // Loading após intro
  if (showLoading) {
    return (
      <ShamahLoadingScreen 
        visible={true} 
        message="Iniciando Shamah Publi..."
        type="initial"
      />
    );
  }

  return (
    <ShamahBackground variant="cosmic" style={styles.container}>
      <View style={styles.content}>
        <LinearGradient
          colors={[ShamahColors.primary, ShamahColors.secondary, ShamahColors.accent]}
          style={styles.logoContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="flash" size={60} color="white" />
        </LinearGradient>
        
        <Text style={styles.appName}>Shamah Publi</Text>
        <Text style={styles.appTagline}>Crie e compartilhe com facilidade</Text>
        
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </View>
    </ShamahBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ShamahTheme.spacing.xl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ShamahTheme.spacing.xl,
    shadowColor: ShamahColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 20,
  },
  appName: {
    fontSize: ShamahTheme.typography.sizes['4xl'],
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
    textAlign: 'center',
    marginBottom: ShamahTheme.spacing.sm,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appTagline: {
    fontSize: ShamahTheme.typography.sizes.lg,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: ShamahTheme.spacing.xl * 2,
    fontWeight: ShamahTheme.typography.weights.medium,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: ShamahTheme.spacing.sm,
    marginBottom: ShamahTheme.spacing.md,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
    opacity: 0.6,
  },
  dot1: {
    backgroundColor: ShamahColors.primary,
  },
  dot2: {
    backgroundColor: ShamahColors.secondary,
  },
  dot3: {
    backgroundColor: ShamahColors.accent,
  },
  loadingText: {
    fontSize: ShamahTheme.typography.sizes.base,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: ShamahTheme.typography.weights.medium,
  },
});
