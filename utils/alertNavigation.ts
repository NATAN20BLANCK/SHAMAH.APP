// Navegação para Alertas - Utility Functions
// Este arquivo contém funções auxiliares para facilitar a navegação 
// dos alertas para a tela de planos com os parâmetros corretos

import { router } from 'expo-router';

export interface AlertNavigationParams {
  highlightPlan: string;
  source: string;
  alertType: string;
}

export const navigateToPlansFromAlert = (
  alertType: 'posts' | 'accounts' | 'storage' | 'ai' | 'premium'
) => {
  const planMapping: Record<string, string> = {
    posts: 'creator',      // Limite de posts -> Plano Criador
    accounts: 'creator',   // Limite de contas -> Plano Criador  
    storage: 'professional', // Limite de armazenamento -> Plano Profissional
    ai: 'professional',    // IA Premium -> Plano Profissional
    premium: 'professional' // Recursos Premium -> Plano Profissional
  };

  const params: AlertNavigationParams = {
    highlightPlan: planMapping[alertType] || 'professional',
    source: 'alert',
    alertType
  };

  router.push({
    pathname: '/(tabs)/planos',
    params: params as any
  });
};

export const getRecommendedPlanName = (
  alertType: 'posts' | 'accounts' | 'storage' | 'ai' | 'premium'
): string => {
  const planNames: Record<string, string> = {
    posts: 'Plano Criador',
    accounts: 'Plano Criador',
    storage: 'Plano Profissional',
    ai: 'Plano Profissional',
    premium: 'Plano Profissional'
  };

  return planNames[alertType] || 'Plano Profissional';
};
