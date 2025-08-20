import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '../utils/AsyncStorage';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

export interface NotificationPreferences {
  trendsEnabled: boolean;
  newsEnabled: boolean;
  tipsEnabled: boolean;
  personalizedEnabled: boolean;
  scheduledTime: string; // HH:MM format
  frequency: 'daily' | 'weekly' | 'instant';
  platforms: string[];
}

export interface BlogNotification {
  id: string;
  title: string;
  body: string;
  data: {
    type: 'trend' | 'news' | 'tip' | 'personalized';
    postId?: string;
    category?: string;
    platform?: string;
  };
  scheduledFor?: Date;
  sent: boolean;
  createdAt: Date;
}

interface NotificationManagerHook {
  preferences: NotificationPreferences;
  notifications: BlogNotification[];
  hasPermission: boolean;
  isLoading: boolean;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  scheduleNotification: (notification: Omit<BlogNotification, 'id' | 'sent' | 'createdAt'>) => Promise<void>;
  sendTrendNotification: (trend: string, platform: string) => Promise<void>;
  sendPersonalizedNotification: (postId: string, title: string, preview: string) => Promise<void>;
  requestPermission: () => Promise<boolean>;
  clearNotifications: () => Promise<void>;
  getNotificationHistory: () => BlogNotification[];
}

const STORAGE_KEYS = {
  PREFERENCES: '@shamah_notification_preferences',
  NOTIFICATIONS: '@shamah_notifications',
};

const DEFAULT_PREFERENCES: NotificationPreferences = {
  trendsEnabled: true,
  newsEnabled: true,
  tipsEnabled: true,
  personalizedEnabled: true,
  scheduledTime: '09:00',
  frequency: 'daily',
  platforms: ['instagram', 'facebook', 'tiktok'],
};

// Configurar o comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function useNotificationManager(): NotificationManagerHook {
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [notifications, setNotifications] = useState<BlogNotification[]>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializar sistema de notificações
  useEffect(() => {
    initializeNotifications();
  }, []);

  // Configurar listener para notificações recebidas
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(handleNotificationReceived);
    return () => subscription.remove();
  }, []);

  // Agendar notificações baseadas nas preferências
  useEffect(() => {
    if (hasPermission && preferences.frequency === 'daily') {
      scheduleDailyNotifications();
    }
  }, [preferences, hasPermission]);

  const initializeNotifications = async () => {
    try {
      setIsLoading(true);
      
      // Verificar permissão
      const { status } = await Notifications.getPermissionsAsync();
      setHasPermission(status === 'granted');

      // Carregar preferências
      const savedPreferences = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }

      // Carregar histórico de notificações
      const savedNotifications = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
    } catch (error) {
      console.error('Erro ao inicializar notificações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);
      
      if (!granted) {
        Alert.alert(
          'Permissão Necessária',
          'Para receber notificações sobre trends e dicas, é necessário permitir notificações nas configurações do seu dispositivo.',
          [{ text: 'OK' }]
        );
      }
      
      return granted;
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return false;
    }
  };

  const updatePreferences = async (newPrefs: Partial<NotificationPreferences>) => {
    try {
      const updatedPrefs = { ...preferences, ...newPrefs };
      setPreferences(updatedPrefs);
      await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updatedPrefs));
      
      // Reagendar notificações se necessário
      if (hasPermission) {
        await Notifications.cancelAllScheduledNotificationsAsync();
        if (updatedPrefs.frequency === 'daily') {
          await scheduleDailyNotifications();
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
    }
  };

  const scheduleNotification = async (notification: Omit<BlogNotification, 'id' | 'sent' | 'createdAt'>) => {
    try {
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) return;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data,
        },
        trigger: notification.scheduledFor || null,
      });

      const newNotification: BlogNotification = {
        id: notificationId,
        ...notification,
        sent: false,
        createdAt: new Date(),
      };

      const updatedNotifications = [...notifications, newNotification];
      setNotifications(updatedNotifications);
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
    }
  };

  const sendTrendNotification = async (trend: string, platform: string) => {
    if (!preferences.trendsEnabled || !preferences.platforms.includes(platform)) {
      return;
    }

    await scheduleNotification({
      title: '🔥 Trend em Alta!',
      body: `"${trend}" está bombando no ${platform}. Aproveite agora!`,
      data: {
        type: 'trend',
        category: 'trend',
        platform,
      },
    });
  };

  const sendPersonalizedNotification = async (postId: string, title: string, preview: string) => {
    if (!preferences.personalizedEnabled) {
      return;
    }

    await scheduleNotification({
      title: '✨ Conteúdo Personalizado',
      body: `${title}\n${preview}`,
      data: {
        type: 'personalized',
        postId,
      },
    });
  };

  const scheduleDailyNotifications = async () => {
    try {
      const [hour, minute] = preferences.scheduledTime.split(':').map(Number);
      const now = new Date();
      const scheduledDate = new Date();
      scheduledDate.setHours(hour, minute, 0, 0);

      // Se o horário já passou hoje, agendar para amanhã
      if (scheduledDate <= now) {
        scheduledDate.setDate(scheduledDate.getDate() + 1);
      }

      // Agendar notificação diária
      await scheduleNotification({
        title: '📱 Shamah Publi',
        body: 'Veja as novidades e trends do dia para suas redes sociais!',
        data: {
          type: 'news',
          category: 'daily',
        },
        scheduledFor: scheduledDate,
      });
    } catch (error) {
      console.error('Erro ao agendar notificações diárias:', error);
    }
  };

  const handleNotificationReceived = useCallback((notification: Notifications.Notification) => {
    // Marcar notificação como enviada
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.request.identifier 
          ? { ...n, sent: true }
          : n
      )
    );
  }, []);

  const clearNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setNotifications([]);
      await AsyncStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    } catch (error) {
      console.error('Erro ao limpar notificações:', error);
    }
  };

  const getNotificationHistory = () => {
    return notifications.filter(n => n.sent).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  return {
    preferences,
    notifications,
    hasPermission,
    isLoading,
    updatePreferences,
    scheduleNotification,
    sendTrendNotification,
    sendPersonalizedNotification,
    requestPermission,
    clearNotifications,
    getNotificationHistory,
  };
}

// Funções auxiliares para uso em componentes
export const scheduleWeeklyTrends = async (notificationManager: ReturnType<typeof useNotificationManager>) => {
  const trends = [
    'Vídeos curtos estão em alta',
    'Carrosséis têm mais engajamento',
    'Stories interativos aumentam alcance',
    'Reels com música trending performam melhor',
    'Conteúdo educativo gera mais seguidores',
  ];

  const platforms = ['instagram', 'tiktok', 'facebook'];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    date.setHours(9, 0, 0, 0);

    const trend = trends[i % trends.length];
    const platform = platforms[i % platforms.length];

    await notificationManager.scheduleNotification({
      title: `📈 Trend da Semana - ${platform}`,
      body: trend,
      data: {
        type: 'trend',
        category: 'weekly',
        platform,
      },
      scheduledFor: date,
    });
  }
};

export const schedulePersonalizedContent = async (
  notificationManager: ReturnType<typeof useNotificationManager>,
  userPreferences: string[]
) => {
  const contentSuggestions = {
    'instagram': 'Crie um carrossel com dicas rápidas',
    'tiktok': 'Grave um vídeo seguindo a trend atual',
    'facebook': 'Compartilhe um post educativo',
    'linkedin': 'Publique insights profissionais',
    'twitter': 'Participe de conversas trending',
  };

  userPreferences.forEach(async (platform, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    date.setHours(14, 0, 0, 0);

    await notificationManager.scheduleNotification({
      title: `💡 Dica Personalizada - ${platform}`,
      body: contentSuggestions[platform] || 'Crie conteúdo relevante para sua audiência',
      data: {
        type: 'personalized',
        category: 'tip',
        platform,
      },
      scheduledFor: date,
    });
  });
};
