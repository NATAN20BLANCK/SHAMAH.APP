import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ShamahBackground from '../components/ShamahBackground';
import ShamahCard from '../components/ShamahCard';
import ShamahButton from '../components/ShamahButton';
import { AnimatedScreen, AnimatedCard } from '../components/ShamahAnimations';
import { ShamahTheme } from '../constants/theme';
import { ShamahColors } from '../constants/Colors';
import { useLoading } from '../contexts/LoadingContext';
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen() {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    showPassword: false,
    isLogin: true
  });
  const { showAuthLoading, hideLoading } = useLoading();
  const { login, register, socialLogin } = useAuth();

  const updateForm = useCallback((key: string, value: string | boolean) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleEmailLogin = async () => {
    if (!formState.email || !formState.password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }
    
    try {
      showAuthLoading(formState.isLogin ? 'Fazendo login...' : 'Criando conta...');
      
      if (formState.isLogin) {
        await login(formState.email, formState.password);
      } else {
        await register(formState.email, formState.password, 'Usuario');
      }
      
      hideLoading();
      router.push('/tabs');
    } catch (error) {
      console.error('Login error:', error);
      hideLoading();
      Alert.alert('Erro', 'Falha na autenticação. Tente novamente.');
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      showAuthLoading(`Conectando com ${provider}...`);
      
      await socialLogin(provider.toLowerCase() as any);
      
      hideLoading();
      router.push('/tabs');
    } catch (error) {
      console.error('Social login error:', error);
      hideLoading();
      Alert.alert('Erro', `Falha ao conectar com ${provider}. Tente novamente.`);
    }
  };

  const handleSkipLogin = () => {
    router.push('/tabs');
  };

  return (
    <ShamahBackground variant="cosmic" style={styles.container}>
      <AnimatedScreen>
        {/* Header com Logo */}
        <View style={styles.header}>
          <AnimatedCard index={0}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={[ShamahColors.primary, ShamahColors.secondary, ShamahColors.accent]}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="flash" size={40} color="white" />
              </LinearGradient>
              <Text style={styles.appName}>Shamah Publi</Text>
              <Text style={styles.appTagline}>Crie e compartilhe com facilidade</Text>
            </View>
          </AnimatedCard>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <AnimatedCard index={1}>
            <ShamahCard variant="glass" style={styles.formCard}>
              <Text style={styles.formTitle}>
                {formState.isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
              </Text>
              
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Seu e-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={formState.email}
                  onChangeText={text => updateForm('email', text)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  enablesReturnKeyAutomatically
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Sua senha"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={formState.password}
                  onChangeText={text => updateForm('password', text)}
                  secureTextEntry={!formState.showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => updateForm('showPassword', !formState.showPassword)}
                >
                  <Ionicons 
                    name={formState.showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="rgba(255,255,255,0.7)" 
                  />
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <ShamahButton
                title={formState.isLogin ? 'Entrar' : 'Criar Conta'}
                onPress={handleEmailLogin}
                style={styles.loginButton}
              />

              {/* Toggle Login/Register */}
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => updateForm('isLogin', !formState.isLogin)}
              >
                <Text style={styles.toggleText}>
                  {formState.isLogin ? 'Não tem conta? Criar conta' : 'Já tem conta? Entrar'}
                </Text>
              </TouchableOpacity>
            </ShamahCard>
          </AnimatedCard>
        </View>

        {/* Social Login Options */}
        <View style={styles.socialContainer}>
          <AnimatedCard index={2}>
            <ShamahCard variant="glass" style={styles.socialCard}>
              <Text style={styles.socialTitle}>Ou continue com</Text>
              
              <View style={styles.socialButtons}>
                {/* Google */}
                <TouchableOpacity
                  style={[styles.socialButton, styles.googleButton]}
                  onPress={() => handleSocialLogin('Google')}
                >
                  <Ionicons name="logo-google" size={24} color="white" />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>

                {/* Facebook */}
                <TouchableOpacity
                  style={[styles.socialButton, styles.facebookButton]}
                  onPress={() => handleSocialLogin('Facebook')}
                >
                  <Ionicons name="logo-facebook" size={24} color="white" />
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity>

                {/* Apple */}
                <TouchableOpacity
                  style={[styles.socialButton, styles.appleButton]}
                  onPress={() => handleSocialLogin('Apple')}
                >
                  <Ionicons name="logo-apple" size={24} color="white" />
                  <Text style={styles.socialButtonText}>Apple</Text>
                </TouchableOpacity>
              </View>
            </ShamahCard>
          </AnimatedCard>
        </View>

        {/* Skip Login */}
        <View style={styles.skipContainer}>
          <AnimatedCard index={3}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkipLogin}>
              <Text style={styles.skipText}>Continuar sem login</Text>
            </TouchableOpacity>
          </AnimatedCard>
        </View>
      </AnimatedScreen>
    </ShamahBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: ShamahTheme.spacing.md,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: ShamahTheme.spacing.xl,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ShamahTheme.spacing.md,
    shadowColor: ShamahColors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 15,
  },
  appName: {
    fontSize: ShamahTheme.typography.sizes['3xl'],
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
    fontWeight: ShamahTheme.typography.weights.medium,
  },
  formContainer: {
    paddingHorizontal: ShamahTheme.spacing.md,
    marginBottom: ShamahTheme.spacing.lg,
  },
  formCard: {
    padding: ShamahTheme.spacing.xl,
  },
  formTitle: {
    fontSize: ShamahTheme.typography.sizes.xl,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
    textAlign: 'center',
    marginBottom: ShamahTheme.spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    paddingHorizontal: ShamahTheme.spacing.md,
    paddingVertical: ShamahTheme.spacing.sm,
    marginBottom: ShamahTheme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputIcon: {
    marginRight: ShamahTheme.spacing.sm,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: ShamahTheme.typography.sizes.base,
    fontWeight: ShamahTheme.typography.weights.medium,
    height: 40,
    padding: 0,
  },
  eyeIcon: {
    padding: ShamahTheme.spacing.xs,
  },
  loginButton: {
    marginTop: ShamahTheme.spacing.md,
    marginBottom: ShamahTheme.spacing.lg,
  },
  toggleButton: {
    alignSelf: 'center',
  },
  toggleText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: ShamahTheme.typography.sizes.sm,
    fontWeight: ShamahTheme.typography.weights.medium,
  },
  socialContainer: {
    paddingHorizontal: ShamahTheme.spacing.md,
    marginBottom: ShamahTheme.spacing.lg,
  },
  socialCard: {
    padding: ShamahTheme.spacing.lg,
  },
  socialTitle: {
    fontSize: ShamahTheme.typography.sizes.base,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: ShamahTheme.spacing.lg,
    fontWeight: ShamahTheme.typography.weights.medium,
  },
  socialButtons: {
    gap: ShamahTheme.spacing.md,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ShamahTheme.spacing.md,
    paddingHorizontal: ShamahTheme.spacing.lg,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  socialButtonText: {
    color: 'white',
    fontSize: ShamahTheme.typography.sizes.base,
    fontWeight: ShamahTheme.typography.weights.semibold,
    marginLeft: ShamahTheme.spacing.sm,
  },
  skipContainer: {
    paddingHorizontal: ShamahTheme.spacing.md,
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: ShamahTheme.spacing.md,
    paddingHorizontal: ShamahTheme.spacing.lg,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: ShamahTheme.typography.sizes.sm,
    fontWeight: ShamahTheme.typography.weights.medium,
    textDecorationLine: 'underline',
  },
});
