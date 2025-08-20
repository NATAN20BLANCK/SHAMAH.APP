import { useState, useEffect, useCallback } from 'react';
// Temporarily commented out for error resolution
// import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage - FORÇANDO PRIMEIRA VEZ SEMPRE
const AsyncStorage = {
  getItem: async (key: string) => {
    // FORÇAR PRIMEIRA VEZ - sempre retorna null
    console.log('AsyncStorage.getItem:', key, '→ null (PRIMEIRA VEZ)');
    return null;
  },
  setItem: async (key: string, value: string) => {
    console.log('AsyncStorage.setItem:', key, value);
  },
  removeItem: async (key: string) => {
    console.log('AsyncStorage.removeItem:', key);
  },
  multiRemove: async (keys: string[]) => {
    console.log('AsyncStorage.multiRemove:', keys);
  },
};

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider?: 'email' | 'google' | 'facebook' | 'apple';
  plan?: 'Gratuito' | 'Básico' | 'Premium' | 'Pro';
  planExpiry?: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isFirstTime: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    isFirstTime: true, // SEMPRE TRUE na primeira vez
  });

  const checkAuthState = useCallback(async () => {
    try {
      console.log('🔍 Verificando estado de autenticação...');
      
      const [userToken, hasSeenOnboarding] = await Promise.all([
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('hasSeenOnboarding'),
      ]);

      console.log('📱 userToken:', userToken);
      console.log('👀 hasSeenOnboarding:', hasSeenOnboarding);

      if (userToken) {
        // Simular busca de dados do usuário
        const userData = await getUserData(userToken);
        console.log('✅ Usuário logado:', userData);
        setAuthState({
          user: userData,
          isLoading: false,
          isAuthenticated: true,
          isFirstTime: !hasSeenOnboarding,
        });
      } else {
        console.log('❌ Usuário NÃO logado');
        console.log('🆕 Primeira vez?', !hasSeenOnboarding);
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          isFirstTime: !hasSeenOnboarding, // Se hasSeenOnboarding é null, então é primeira vez
        });
      }
    } catch (error) {
      console.error('❌ Erro ao verificar autenticação:', error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        isFirstTime: true,
      });
    }
  }, []);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  const getUserData = async (token: string): Promise<User> => {
    // Simular API call
    return {
      id: '1',
      email: 'usuario@example.com',
      name: 'Usuário Teste',
      avatar: 'https://via.placeholder.com/100',
      provider: 'email',
      plan: 'Premium', // Para demonstração - em produção viria do backend
      planExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
    };
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Simular login API
      const response = await mockLogin(email, password);
      
      if (response.success) {
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        
        setAuthState({
          user: response.user,
          isLoading: false,
          isAuthenticated: true,
          isFirstTime: false,
        });
        return true;
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const socialLogin = async (provider: 'google' | 'facebook' | 'apple'): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Simular login social
      const response = await mockSocialLogin(provider);
      
      if (response.success) {
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        
        setAuthState({
          user: response.user,
          isLoading: false,
          isAuthenticated: true,
          isFirstTime: false,
        });
        return true;
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    } catch (error) {
      console.error('Erro no login social:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Simular registro
      const response = await mockRegister(email, password, name);
      
      if (response.success) {
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        
        setAuthState({
          user: response.user,
          isLoading: false,
          isAuthenticated: true,
          isFirstTime: false,
        });
        return true;
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    } catch (error) {
      console.error('Erro no registro:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData']);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        isFirstTime: false,
      });
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const markOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      setAuthState(prev => ({ ...prev, isFirstTime: false }));
    } catch (error) {
      console.error('Erro ao marcar onboarding:', error);
    }
  };

  return {
    ...authState,
    login,
    socialLogin,
    register,
    logout,
    markOnboardingComplete,
    checkAuthState,
  };
};

// Mock functions - substitua pelas chamadas reais da API
const mockLogin = async (email: string, password: string) => {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    success: true,
    token: 'mock-token-123',
    user: {
      id: '1',
      email,
      name: 'Usuário Teste',
      avatar: 'https://via.placeholder.com/100',
      provider: 'email' as const,
      plan: 'Básico' as const, // Para demonstração
      planExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
    },
  };
};

const mockSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    success: true,
    token: `mock-${provider}-token-123`,
    user: {
      id: '1',
      email: `usuario@${provider}.com`,
      name: `Usuário ${provider}`,
      avatar: 'https://via.placeholder.com/100',
      provider,
      plan: 'Básico' as const, // Para demonstração
      planExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
    },
  };
};

const mockRegister = async (email: string, password: string, name: string) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    success: true,
    token: 'mock-register-token-123',
    user: {
      id: '1',
      email,
      name,
      avatar: 'https://via.placeholder.com/100',
      provider: 'email' as const,
    },
  };
};
