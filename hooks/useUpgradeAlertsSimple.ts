import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

export interface AlertData {
  id: string;
  type: 'warning' | 'limit' | 'premium';
  title: string;
  message: string;
  primaryAction: string;
  secondaryAction?: string;
  icon: string;
  priority: number;
}

export function useUpgradeAlertsSimple() {
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<AlertData | null>(null);

  const triggerAlert = useCallback((type: 'posts' | 'accounts' | 'storage' | 'ai' | 'premium') => {
    let alert: AlertData;

    switch (type) {
      case 'posts':
        alert = {
          id: 'posts-limit',
          type: 'limit',
          title: 'Limite de Posts Atingido',
          message: 'Você atingiu o limite de posts do plano gratuito. Faça upgrade para continuar.',
          primaryAction: 'Fazer Upgrade',
          secondaryAction: 'Cancelar',
          icon: '📝',
          priority: 1,
        };
        break;
      case 'accounts':
        alert = {
          id: 'accounts-limit',
          type: 'limit',
          title: 'Limite de Contas Atingido',
          message: 'Você pode conectar até 3 contas no plano gratuito. Upgrade para mais contas.',
          primaryAction: 'Fazer Upgrade',
          secondaryAction: 'Cancelar',
          icon: '🔗',
          priority: 1,
        };
        break;
      case 'storage':
        alert = {
          id: 'storage-limit',
          type: 'warning',
          title: 'Armazenamento Quase Cheio',
          message: 'Você está usando 90% do seu armazenamento. Considere fazer upgrade.',
          primaryAction: 'Fazer Upgrade',
          secondaryAction: 'OK',
          icon: '☁️',
          priority: 2,
        };
        break;
      case 'ai':
        alert = {
          id: 'ai-limit',
          type: 'limit',
          title: 'Limite de IA Atingido',
          message: 'Você esgotou suas gerações de IA gratuitas. Upgrade para unlimited.',
          primaryAction: 'Fazer Upgrade',
          secondaryAction: 'Cancelar',
          icon: '🤖',
          priority: 1,
        };
        break;
      default:
        alert = {
          id: 'premium',
          type: 'premium',
          title: 'Recurso Premium',
          message: 'Este recurso está disponível apenas para usuários premium.',
          primaryAction: 'Fazer Upgrade',
          secondaryAction: 'Cancelar',
          icon: '⭐',
          priority: 1,
        };
    }

    // Para demo, usar Alert nativo
    Alert.alert(
      alert.title,
      alert.message,
      [
        {
          text: alert.secondaryAction || 'Cancelar',
          style: 'cancel',
        },
        {
          text: alert.primaryAction,
          onPress: () => {
            console.log('Navegando para planos...');
            // Aqui seria a navegação para planos
          },
        },
      ]
    );
  }, []);

  const showAlert = useCallback((alert: AlertData) => {
    setCurrentAlert(alert);
    setIsAlertVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    setIsAlertVisible(false);
    setCurrentAlert(null);
  }, []);

  const handleUpgrade = useCallback(() => {
    console.log('Redirecionando para planos...');
    hideAlert();
  }, [hideAlert]);

  return {
    triggerAlert,
    showAlert,
    hideAlert,
    handleUpgrade,
    isAlertVisible,
    currentAlert,
  };
}
