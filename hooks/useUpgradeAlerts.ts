import { useState, useEffect, useCallback } from 'react';
import { UpgradeAlertData } from '../components/AutoUpgradeAlert';

export interface AlertData {
  id: string;
  type: 'warning' | 'limit' | 'premium';
  title: string;
  message: string;
  primaryAction: string;
  secondaryAction?: string;
  icon: string;
  priority: number; // 1 = highest priority
}

export interface UserUsage {
  currentPlan: 'free' | 'creator' | 'professional' | 'agency';
  accountsConnected: number;
  postsThisMonth: number;
  storageUsed: number; // MB
  aiUsageThisMonth: number;
  scheduledPosts: number;
}

export interface PlanLimits {
  accounts: number; // -1 = unlimited
  posts: number; // -1 = unlimited
  storage: number; // MB, -1 = unlimited
  aiRequests: number; // -1 = unlimited
  scheduledPosts: number; // -1 = unlimited
}

// Configurações de limites por plano
const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    accounts: 2,
    posts: 20,
    storage: 100,
    aiRequests: 5,
    scheduledPosts: 5
  },
  creator: {
    accounts: 5,
    posts: 100,
    storage: 1000,
    aiRequests: 50,
    scheduledPosts: 20
  },
  professional: {
    accounts: 15,
    posts: -1,
    storage: 5000,
    aiRequests: 200,
    scheduledPosts: -1
  },
  agency: {
    accounts: -1,
    posts: -1,
    storage: 10000,
    aiRequests: -1,
    scheduledPosts: -1
  }
};

// Alertas específicos por tela/aba
const TAB_SPECIFIC_ALERTS: Record<string, string[]> = {
  'portfolio': ['storage', 'posts'],
  'servicos': ['feature', 'ai'],
  'afiliados': ['accounts', 'premium'],
  'contas': ['accounts', 'limit'],
  'planos': [], // Não mostra alertas na própria tela de planos
};

export const useUpgradeAlerts = () => {
  const [currentAlert, setCurrentAlert] = useState<UpgradeAlertData | null>(null);
  const [alertQueue, setAlertQueue] = useState<UpgradeAlertData[]>([]);
  const [alertHistory, setAlertHistory] = useState<string[]>([]);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  
  // Simulação de dados do usuário - em produção viria do backend/contexto
  const [userUsage] = useState<UserUsage>({
    currentPlan: 'free',
    accountsConnected: 1,
    postsThisMonth: 18,
    storageUsed: 85,
    aiUsageThisMonth: 4,
    scheduledPosts: 3
  });

  // Função para verificar se precisa mostrar alerta baseado no uso atual
  const checkLimits = useCallback(() => {
    const limits = PLAN_LIMITS[userUsage.currentPlan];
    const alerts: UpgradeAlertData[] = [];

    // Verificar posts próximo do limite
    if (limits.posts !== -1 && userUsage.postsThisMonth >= limits.posts * 0.8) {
      alerts.push({
        id: 'posts-limit',
        type: 'limit',
        title: 'Limite de Posts Próximo!',
        message: `Você já usou ${userUsage.postsThisMonth} de ${limits.posts} posts este mês. Faça upgrade para continuar postando sem limitações.`,
        currentPlan: userUsage.currentPlan,
        recommendedPlan: 'creator',
        limitValue: limits.posts,
        currentValue: userUsage.postsThisMonth,
        urgency: userUsage.postsThisMonth >= limits.posts ? 'critical' : 'high',
      });
    }

    // Verificar contas conectadas
    if (limits.accounts !== -1 && userUsage.accountsConnected >= limits.accounts) {
      alerts.push({
        id: 'accounts-limit',
        type: 'accounts',
        title: 'Limite de Contas Atingido!',
        message: `Você atingiu o limite de ${limits.accounts} contas conectadas. Upgrade para conectar mais contas sociais.`,
        currentPlan: userUsage.currentPlan,
        recommendedPlan: 'creator',
        limitValue: limits.accounts,
        currentValue: userUsage.accountsConnected,
        urgency: 'high',
      });
    }

    // Verificar armazenamento
    if (limits.storage !== -1 && userUsage.storageUsed >= limits.storage * 0.8) {
      alerts.push({
        id: 'storage-limit',
        type: 'storage',
        title: 'Armazenamento Quase Cheio!',
        message: `Você está usando ${userUsage.storageUsed}MB de ${limits.storage}MB. Libere espaço ou faça upgrade.`,
        currentPlan: userUsage.currentPlan,
        recommendedPlan: 'creator',
        limitValue: limits.storage,
        currentValue: userUsage.storageUsed,
        urgency: userUsage.storageUsed >= limits.storage * 0.95 ? 'critical' : 'medium',
      });
    }

    // Verificar créditos de IA
    if (limits.aiRequests !== -1 && userUsage.aiUsageThisMonth >= limits.aiRequests) {
      alerts.push({
        id: 'ai-limit',
        type: 'ai',
        title: 'Créditos IA Esgotados!',
        message: `Você usou todos os ${limits.aiRequests} créditos de IA este mês. Upgrade para continuar usando IA.`,
        currentPlan: userUsage.currentPlan,
        recommendedPlan: 'professional',
        limitValue: limits.aiRequests,
        currentValue: userUsage.aiUsageThisMonth,
        urgency: 'high',
      });
    }

    return alerts;
  }, [userUsage]);

  // Função para mostrar alerta específico para uma funcionalidade premium
  const showFeatureAlert = useCallback((feature: string, requiredPlan: string = 'creator') => {
    const alert: UpgradeAlertData = {
      id: `feature-${feature}`,
      type: 'feature',
      title: 'Recurso Premium',
      message: `A funcionalidade "${feature}" está disponível apenas em planos superiores. Faça upgrade para acessar todos os recursos.`,
      currentPlan: userUsage.currentPlan,
      recommendedPlan: requiredPlan,
      feature,
      urgency: 'medium',
    };
    
    setCurrentAlert(alert);
    setIsAlertVisible(true);
  }, [userUsage.currentPlan]);

  // Função para verificar alertas específicos da aba atual
  const checkTabAlerts = useCallback((tabName: string) => {
    const allowedAlertTypes = TAB_SPECIFIC_ALERTS[tabName] || [];
    if (allowedAlertTypes.length === 0) return;

    const allAlerts = checkLimits();
    const tabSpecificAlerts = allAlerts.filter(alert => 
      allowedAlertTypes.includes(alert.type)
    );

    if (tabSpecificAlerts.length > 0) {
      // Mostrar o alerta de maior prioridade (crítico > alto > médio > baixo)
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const sortedAlerts = tabSpecificAlerts.sort((a, b) => 
        priorityOrder[b.urgency] - priorityOrder[a.urgency]
      );
      
      const alertToShow = sortedAlerts[0];
      
      // Só mostrar se não foi dispensado recentemente
      if (!alertHistory.includes(alertToShow.id)) {
        setCurrentAlert(alertToShow);
        setIsAlertVisible(true);
      }
    }
  }, [checkLimits, alertHistory]);

  // Função para dispensar alerta temporariamente
  const dismissAlert = useCallback(() => {
    if (currentAlert) {
      setAlertHistory(prev => [...prev, currentAlert.id]);
    }
    setIsAlertVisible(false);
    setCurrentAlert(null);
  }, [currentAlert]);

  // Função para fechar alerta definitivamente
  const closeAlert = useCallback(() => {
    setIsAlertVisible(false);
    setCurrentAlert(null);
  }, []);

  // Função para navegação para upgrade
  const handleUpgrade = useCallback((plan: string) => {
    closeAlert();
    // Aqui você implementaria a navegação para a tela de planos
    console.log(`Navegando para upgrade do plano: ${plan}`);
  }, [closeAlert]);

  return {
    currentAlert,
    isAlertVisible,
    userUsage,
    showFeatureAlert,
    checkTabAlerts,
    dismissAlert,
    closeAlert,
    handleUpgrade,
    checkLimits,
  };
};
