import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import ShamahLoadingScreen from '../components/ShamahLoadingScreen';

// Mock AsyncStorage for web
const AsyncStorage = {
  getItem: async (key: string) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: async (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }
};

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    console.log('🚀 IndexScreen - Estado:', {
      isLoading,
      isAuthenticated, 
    });

    const checkInitialFlow = async () => {
      try {
        // Verificar se é primeira vez que abre o app
        const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
        
        if (!hasCompletedOnboarding) {
          console.log('📱 Primeira vez - Redirecionando para onboarding');
          router.replace('/onboarding');
          return;
        }

        // Se já fez onboarding, verificar autenticação
        if (isAuthenticated) {
          console.log('✅ Usuário autenticado - Redirecionando para tabs');
          router.replace('/tabs');
        } else {
          console.log('🔐 Usuário não autenticado - Redirecionando para login');
          router.replace('/tabs/perfil');
        }
      } catch (error) {
        console.error('❌ Erro ao verificar estado inicial:', error);
        // Em caso de erro, redirecionar para tabs
        router.replace('/tabs');
      }
    };

    // Só executar quando não estiver carregando
    if (!isLoading) {
      checkInitialFlow();
    }
  }, [isLoading, isAuthenticated, router]);

  // Mostrar loading enquanto verifica o estado
  if (isLoading) {
    return <ShamahLoadingScreen visible={true} />;
  }

  // Fallback - também mostrar loading
  return <ShamahLoadingScreen visible={true} />;
}
