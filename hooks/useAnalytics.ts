import { useState, useEffect } from 'react';
import AsyncStorage from '../utils/AsyncStorage';

export interface AnalyticsEvent {
  id: string;
  type: 'screen_view' | 'button_click' | 'feature_use' | 'user_action' | 'error' | 'performance';
  name: string;
  screen?: string;
  category?: string;
  properties?: Record<string, any>;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  duration?: number;
  metadata?: {
    device?: string;
    os?: string;
    version?: string;
    language?: string;
    timezone?: string;
  };
}

export interface UserSession {
  id: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  screenViews: string[];
  interactions: number;
  features: string[];
  errors: number;
  isActive: boolean;
}

export interface AnalyticsInsights {
  totalEvents: number;
  totalSessions: number;
  averageSessionDuration: number;
  mostUsedFeatures: { name: string; count: number }[];
  mostViewedScreens: { name: string; count: number }[];
  userEngagement: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    retention: number;
  };
  errorRate: number;
  performanceMetrics: {
    averageLoadTime: number;
    slowestScreens: { name: string; time: number }[];
  };
}

export interface AnalyticsConfig {
  enabled: boolean;
  collectUserData: boolean;
  collectPerformanceData: boolean;
  batchSize: number;
  uploadInterval: number; // em minutos
  maxStorageEvents: number;
}

interface AnalyticsHook {
  config: AnalyticsConfig;
  currentSession: UserSession | null;
  insights: AnalyticsInsights;
  isLoading: boolean;
  track: (event: Omit<AnalyticsEvent, 'id' | 'sessionId' | 'timestamp'>) => Promise<void>;
  trackScreen: (screenName: string, properties?: Record<string, any>) => Promise<void>;
  trackAction: (action: string, category?: string, properties?: Record<string, any>) => Promise<void>;
  trackError: (error: Error, context?: string) => Promise<void>;
  trackPerformance: (metric: string, value: number, screen?: string) => Promise<void>;
  startSession: (userId?: string) => Promise<void>;
  endSession: () => Promise<void>;
  getEvents: (filters?: { type?: string; screen?: string; dateRange?: { start: Date; end: Date } }) => Promise<AnalyticsEvent[]>;
  getInsights: () => Promise<AnalyticsInsights>;
  exportData: () => Promise<string>;
  clearData: () => Promise<void>;
  updateConfig: (newConfig: Partial<AnalyticsConfig>) => Promise<void>;
}

const STORAGE_KEYS = {
  EVENTS: '@shamah_analytics_events',
  SESSIONS: '@shamah_analytics_sessions',
  CONFIG: '@shamah_analytics_config',
  CURRENT_SESSION: '@shamah_analytics_current_session',
};

const DEFAULT_CONFIG: AnalyticsConfig = {
  enabled: true,
  collectUserData: true,
  collectPerformanceData: true,
  batchSize: 50,
  uploadInterval: 15,
  maxStorageEvents: 1000,
};

export function useAnalytics(): AnalyticsHook {
  const [config, setConfig] = useState<AnalyticsConfig>(DEFAULT_CONFIG);
  const [currentSession, setCurrentSession] = useState<UserSession | null>(null);
  const [insights, setInsights] = useState<AnalyticsInsights>({
    totalEvents: 0,
    totalSessions: 0,
    averageSessionDuration: 0,
    mostUsedFeatures: [],
    mostViewedScreens: [],
    userEngagement: {
      dailyActiveUsers: 0,
      weeklyActiveUsers: 0,
      monthlyActiveUsers: 0,
      retention: 0,
    },
    errorRate: 0,
    performanceMetrics: {
      averageLoadTime: 0,
      slowestScreens: [],
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAnalytics();
  }, []);

  const initializeAnalytics = async () => {
    try {
      setIsLoading(true);
      
      // Carregar configurações
      const storedConfig = await AsyncStorage.getItem(STORAGE_KEYS.CONFIG);
      if (storedConfig) {
        setConfig(JSON.parse(storedConfig));
      }

      // Carregar sessão atual
      const storedSession = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
      if (storedSession) {
        const session = JSON.parse(storedSession);
        session.startTime = new Date(session.startTime);
        setCurrentSession(session);
      }

      // Gerar insights
      await generateInsights();
    } catch (error) {
      console.error('Erro ao inicializar analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const generateEventId = (): string => {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const track = async (eventData: Omit<AnalyticsEvent, 'id' | 'sessionId' | 'timestamp'>) => {
    if (!config.enabled) return;

    try {
      const event: AnalyticsEvent = {
        ...eventData,
        id: generateEventId(),
        sessionId: currentSession?.id || 'no-session',
        timestamp: new Date(),
        metadata: {
          device: 'mobile', // Em produção, obter do dispositivo
          os: 'ios', // Em produção, obter do sistema
          version: '1.0.0',
          language: 'pt-BR',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      // Salvar evento
      const existingEvents = await getStoredEvents();
      const updatedEvents = [...existingEvents, event];
      
      // Limitar número de eventos armazenados
      if (updatedEvents.length > config.maxStorageEvents) {
        updatedEvents.splice(0, updatedEvents.length - config.maxStorageEvents);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updatedEvents));

      // Atualizar sessão atual
      if (currentSession) {
        const updatedSession: UserSession = {
          ...currentSession,
          interactions: currentSession.interactions + 1,
          features: [...new Set([...currentSession.features, eventData.name])],
          errors: eventData.type === 'error' ? currentSession.errors + 1 : currentSession.errors,
        };

        if (eventData.type === 'screen_view' && eventData.screen) {
          updatedSession.screenViews = [...updatedSession.screenViews, eventData.screen];
        }

        setCurrentSession(updatedSession);
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(updatedSession));
      }

      // Atualizar insights em tempo real
      await generateInsights();
    } catch (error) {
      console.error('Erro ao registrar evento:', error);
    }
  };

  const trackScreen = async (screenName: string, properties?: Record<string, any>) => {
    await track({
      type: 'screen_view',
      name: screenName,
      screen: screenName,
      properties,
    });
  };

  const trackAction = async (action: string, category?: string, properties?: Record<string, any>) => {
    await track({
      type: 'user_action',
      name: action,
      category,
      properties,
    });
  };

  const trackError = async (error: Error, context?: string) => {
    await track({
      type: 'error',
      name: error.name,
      properties: {
        message: error.message,
        stack: error.stack,
        context,
      },
    });
  };

  const trackPerformance = async (metric: string, value: number, screen?: string) => {
    if (!config.collectPerformanceData) return;

    await track({
      type: 'performance',
      name: metric,
      screen,
      duration: value,
      properties: {
        metric,
        value,
      },
    });
  };

  const startSession = async (userId?: string) => {
    try {
      const session: UserSession = {
        id: generateSessionId(),
        userId,
        startTime: new Date(),
        screenViews: [],
        interactions: 0,
        features: [],
        errors: 0,
        isActive: true,
      };

      setCurrentSession(session);
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));

      // Salvar na lista de sessões
      const existingSessions = await getStoredSessions();
      const updatedSessions = [...existingSessions, session];
      await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updatedSessions));
    } catch (error) {
      console.error('Erro ao iniciar sessão:', error);
    }
  };

  const endSession = async () => {
    if (!currentSession) return;

    try {
      const endTime = new Date();
      const duration = endTime.getTime() - currentSession.startTime.getTime();

      const finalSession: UserSession = {
        ...currentSession,
        endTime,
        duration,
        isActive: false,
      };

      // Atualizar sessão armazenada
      const sessions = await getStoredSessions();
      const updatedSessions = sessions.map(session => 
        session.id === currentSession.id ? finalSession : session
      );
      await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updatedSessions));

      // Limpar sessão atual
      setCurrentSession(null);
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    } catch (error) {
      console.error('Erro ao finalizar sessão:', error);
    }
  };

  const getStoredEvents = async (): Promise<AnalyticsEvent[]> => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.EVENTS);
      if (stored) {
        return JSON.parse(stored).map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp),
        }));
      }
      return [];
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      return [];
    }
  };

  const getStoredSessions = async (): Promise<UserSession[]> => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (stored) {
        return JSON.parse(stored).map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: session.endTime ? new Date(session.endTime) : undefined,
        }));
      }
      return [];
    } catch (error) {
      console.error('Erro ao carregar sessões:', error);
      return [];
    }
  };

  const getEvents = async (filters?: { type?: string; screen?: string; dateRange?: { start: Date; end: Date } }) => {
    try {
      let events = await getStoredEvents();

      if (filters) {
        if (filters.type) {
          events = events.filter(event => event.type === filters.type);
        }
        if (filters.screen) {
          events = events.filter(event => event.screen === filters.screen);
        }
        if (filters.dateRange) {
          events = events.filter(event => 
            event.timestamp >= filters.dateRange!.start && 
            event.timestamp <= filters.dateRange!.end
          );
        }
      }

      return events;
    } catch (error) {
      console.error('Erro ao filtrar eventos:', error);
      return [];
    }
  };

  const generateInsights = async () => {
    try {
      const events = await getStoredEvents();
      const sessions = await getStoredSessions();

      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Calcular métricas básicas
      const totalEvents = events.length;
      const totalSessions = sessions.length;
      const averageSessionDuration = sessions.reduce((sum, session) => 
        sum + (session.duration || 0), 0) / sessions.length || 0;

      // Features mais usadas
      const featureUsage = events.reduce((acc, event) => {
        if (event.type === 'user_action' || event.type === 'feature_use') {
          acc[event.name] = (acc[event.name] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const mostUsedFeatures = Object.entries(featureUsage)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));

      // Telas mais visualizadas
      const screenViews = events.reduce((acc, event) => {
        if (event.type === 'screen_view' && event.screen) {
          acc[event.screen] = (acc[event.screen] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const mostViewedScreens = Object.entries(screenViews)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));

      // Engajamento do usuário
      const dailyActiveUsers = sessions.filter(session => 
        session.startTime >= oneDayAgo).length;
      const weeklyActiveUsers = sessions.filter(session => 
        session.startTime >= oneWeekAgo).length;
      const monthlyActiveUsers = sessions.filter(session => 
        session.startTime >= oneMonthAgo).length;

      // Taxa de erro
      const errorEvents = events.filter(event => event.type === 'error');
      const errorRate = totalEvents > 0 ? (errorEvents.length / totalEvents) * 100 : 0;

      // Métricas de performance
      const performanceEvents = events.filter(event => event.type === 'performance');
      const averageLoadTime = performanceEvents.reduce((sum, event) => 
        sum + (event.duration || 0), 0) / performanceEvents.length || 0;

      const screenLoadTimes = performanceEvents.reduce((acc, event) => {
        if (event.screen) {
          if (!acc[event.screen]) {
            acc[event.screen] = { total: 0, count: 0 };
          }
          acc[event.screen].total += event.duration || 0;
          acc[event.screen].count += 1;
        }
        return acc;
      }, {} as Record<string, { total: number; count: number }>);

      const slowestScreens = Object.entries(screenLoadTimes)
        .map(([name, data]) => ({ name, time: data.total / data.count }))
        .sort((a, b) => b.time - a.time)
        .slice(0, 5);

      const newInsights: AnalyticsInsights = {
        totalEvents,
        totalSessions,
        averageSessionDuration,
        mostUsedFeatures,
        mostViewedScreens,
        userEngagement: {
          dailyActiveUsers,
          weeklyActiveUsers,
          monthlyActiveUsers,
          retention: weeklyActiveUsers > 0 ? (dailyActiveUsers / weeklyActiveUsers) * 100 : 0,
        },
        errorRate,
        performanceMetrics: {
          averageLoadTime,
          slowestScreens,
        },
      };

      setInsights(newInsights);
    } catch (error) {
      console.error('Erro ao gerar insights:', error);
    }
  };

  const getInsights = async () => {
    await generateInsights();
    return insights;
  };

  const exportData = async (): Promise<string> => {
    try {
      const events = await getStoredEvents();
      const sessions = await getStoredSessions();
      const exportData = {
        exportDate: new Date().toISOString(),
        config,
        insights,
        events,
        sessions,
      };
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      throw error;
    }
  };

  const clearData = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.EVENTS,
        STORAGE_KEYS.SESSIONS,
        STORAGE_KEYS.CURRENT_SESSION,
      ]);
      
      setCurrentSession(null);
      setInsights({
        totalEvents: 0,
        totalSessions: 0,
        averageSessionDuration: 0,
        mostUsedFeatures: [],
        mostViewedScreens: [],
        userEngagement: {
          dailyActiveUsers: 0,
          weeklyActiveUsers: 0,
          monthlyActiveUsers: 0,
          retention: 0,
        },
        errorRate: 0,
        performanceMetrics: {
          averageLoadTime: 0,
          slowestScreens: [],
        },
      });
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  };

  const updateConfig = async (newConfig: Partial<AnalyticsConfig>) => {
    try {
      const updatedConfig = { ...config, ...newConfig };
      setConfig(updatedConfig);
      await AsyncStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updatedConfig));
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
    }
  };

  return {
    config,
    currentSession,
    insights,
    isLoading,
    track,
    trackScreen,
    trackAction,
    trackError,
    trackPerformance,
    startSession,
    endSession,
    getEvents,
    getInsights,
    exportData,
    clearData,
    updateConfig,
  };
}
