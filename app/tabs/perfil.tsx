import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ShamahColors } from '../../constants/Colors';
import ShamahBackground from '../../components/ShamahBackground';
import ShamahCard from '../../components/ShamahCard';
import ShamahButton from '../../components/ShamahButton';
import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../contexts/LoadingContext';

export default function PerfilScreen() {
  const { user, login, register, socialLogin, logout, isAuthenticated } = useAuth();
  const { showAuthLoading, hideLoading } = useLoading();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Debug para verificar o estado de autenticação
  console.log('PerfilScreen - isAuthenticated:', isAuthenticated, 'user:', user);

  // BOTÃO DE TESTE - REMOVER DEPOIS
  const forceLogout = () => {
    logout();
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }
    
    try {
      showAuthLoading(isLogin ? 'Fazendo login...' : 'Criando conta...');
      
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, 'Usuario');
      }
      
      hideLoading();
      // Não precisa redirecionar, já está na tela certa
    } catch (error) {
      console.error('Auth error:', error);
      hideLoading();
      Alert.alert('Erro', 'Falha na autenticação. Tente novamente.');
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      showAuthLoading(`Conectando com ${provider}...`);
      
      await socialLogin(provider.toLowerCase() as any);
      
      hideLoading();
    } catch (error) {
      console.error('Social login error:', error);
      hideLoading();
      Alert.alert('Erro', `Falha ao conectar com ${provider}. Tente novamente.`);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  // Se não estiver autenticado, mostra tela de login
  if (!isAuthenticated) {
    return (
      <ShamahBackground variant="cosmic">
        {/* BOTÃO DE TESTE */}
        <TouchableOpacity 
          style={{
            position: 'absolute',
            top: 50,
            right: 20,
            backgroundColor: 'red',
            padding: 10,
            borderRadius: 5,
            zIndex: 9999,
          }}
          onPress={() => {
            console.log('Testando login mock...');
            // Simular login para teste
            login('test@test.com', '123456');
          }}
        >
          <Text style={{color: 'white', fontSize: 12}}>TESTE LOGIN</Text>
        </TouchableOpacity>

        <ScrollView style={styles.loginContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.loginHeader}>
            <Text style={styles.loginTitle}>Entre na sua conta</Text>
            <Text style={styles.loginSubtitle}>
              Acesse todas as funcionalidades do Shamah Publi
            </Text>
          </View>

          <ShamahCard variant="glass" style={styles.loginForm}>
            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                style={[styles.toggleButton, isLogin && styles.toggleActive]}
                onPress={() => setIsLogin(true)}
              >
                <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>
                  Entrar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleButton, !isLogin && styles.toggleActive]}
                onPress={() => setIsLogin(false)}
              >
                <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>
                  Criar Conta
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={ShamahColors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Seu email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={ShamahColors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={ShamahColors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Sua senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor={ShamahColors.textSecondary}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color={ShamahColors.textSecondary} 
                />
              </TouchableOpacity>
            </View>

            <ShamahButton
              title={isLogin ? "Entrar" : "Criar Conta"}
              onPress={handleEmailAuth}
              variant="primary"
              style={styles.authButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <ShamahButton
              title="Continuar com Google"
              onPress={() => handleSocialLogin('Google')}
              variant="outline"
              icon="logo-google"
              style={styles.socialButton}
            />

            <ShamahButton
              title="Continuar com Facebook"
              onPress={() => handleSocialLogin('Facebook')}
              variant="outline"
              icon="logo-facebook"
              style={styles.socialButton}
            />

            <ShamahButton
              title="Continuar com Apple"
              onPress={() => handleSocialLogin('Apple')}
              variant="outline"
              icon="logo-apple"
              style={styles.socialButton}
            />
          </ShamahCard>

          <TouchableOpacity style={styles.guestButton}>
            <Text style={styles.guestText}>Continuar como convidado</Text>
          </TouchableOpacity>
        </ScrollView>
      </ShamahBackground>
    );
  }

  // Se estiver autenticado, mostra perfil do usuário
  return (
    <ScrollView style={styles.container}>
      {/* BOTÃO DE TESTE */}
      <TouchableOpacity 
        style={{
          position: 'absolute',
          top: 10,
          right: 20,
          backgroundColor: 'red',
          padding: 10,
          borderRadius: 5,
          zIndex: 9999,
        }}
        onPress={forceLogout}
      >
        <Text style={{color: 'white', fontSize: 12}}>TESTE LOGOUT</Text>
      </TouchableOpacity>

      {/* Header do Perfil */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ 
              uri: user?.avatar || 'https://via.placeholder.com/120/6B73FF/FFFFFF?text=' + (user?.name?.charAt(0) || 'U')
            }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editAvatarBtn}>
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{user?.name || 'Usuário'}</Text>
        <Text style={styles.email}>{user?.email || 'email@exemplo.com'}</Text>
        <Text style={styles.memberSince}>
          Membro desde {user?.email ? 'Janeiro 2024' : 'Janeiro 2024'}
        </Text>
      </View>

      {/* Estatísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>42</Text>
          <Text style={styles.statLabel}>Planos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>18</Text>
          <Text style={styles.statLabel}>Afiliados</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>156</Text>
          <Text style={styles.statLabel}>Pontos</Text>
        </View>
      </View>

      {/* Menu de Opções */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-outline" size={24} color={ShamahColors.primary} />
          <Text style={styles.menuText}>Editar Perfil</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={24} color={ShamahColors.primary} />
          <Text style={styles.menuText}>Configurações</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={24} color={ShamahColors.primary} />
          <Text style={styles.menuText}>Notificações</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={24} color={ShamahColors.primary} />
          <Text style={styles.menuText}>Ajuda & Suporte</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="shield-checkmark-outline" size={24} color={ShamahColors.primary} />
          <Text style={styles.menuText}>Privacidade</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="information-circle-outline" size={24} color={ShamahColors.primary} />
          <Text style={styles.menuText}>Sobre o App</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Botão de Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.version}>Versão 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: ShamahColors.primary,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: ShamahColors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  memberSince: {
    fontSize: 14,
    color: '#999',
  },
  statsContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ShamahColors.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  logoutBtn: {
    backgroundColor: '#ff4757',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  version: {
    fontSize: 12,
    color: '#999',
  },
  // Estilos para Login
  loginContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loginHeader: {
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ShamahColors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    color: ShamahColors.textSecondary,
    textAlign: 'center',
  },
  loginForm: {
    padding: 24,
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: ShamahColors.backgroundPrimary,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: ShamahColors.textSecondary,
  },
  toggleTextActive: {
    color: ShamahColors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ShamahColors.backgroundPrimary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    color: ShamahColors.textPrimary,
  },
  authButton: {
    marginVertical: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: ShamahColors.borderLight,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: ShamahColors.textSecondary,
  },
  socialButton: {
    marginBottom: 12,
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 40,
  },
  guestText: {
    fontSize: 16,
    color: ShamahColors.primary,
    textDecorationLine: 'underline',
  },
});
