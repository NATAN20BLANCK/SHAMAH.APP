import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '../utils/AsyncStorage';

export interface FeedbackData {
  id: string;
  type: 'post' | 'recommendation' | 'trend' | 'ai_analysis';
  itemId: string;
  userId: string;
  rating: number; // 1-5 stars
  helpful: boolean;
  tags: string[]; // useful, accurate, relevant, outdated, etc.
  comment?: string;
  createdAt: Date;
  context?: {
    userEngagement?: number;
    timeSpent?: number;
    actionTaken?: string;
    platform?: string;
  };
}

export interface FeedbackInsights {
  totalFeedbacks: number;
  averageRating: number;
  helpfulPercentage: number;
  mostUsefulTags: string[];
  improvementAreas: string[];
  userSatisfaction: 'high' | 'medium' | 'low';
  recommendations: string[];
}

export interface FeedbackAnalytics {
  byType: Record<string, {
    count: number;
    avgRating: number;
    helpfulRate: number;
  }>;
  byPlatform: Record<string, {
    count: number;
    avgRating: number;
    helpfulRate: number;
  }>;
  trends: {
    last7Days: number;
    last30Days: number;
    growth: number;
  };
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

interface FeedbackManagerHook {
  feedbacks: FeedbackData[];
  insights: FeedbackInsights;
  analytics: FeedbackAnalytics;
  isLoading: boolean;
  submitFeedback: (feedback: Omit<FeedbackData, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  getFeedbackByItem: (itemId: string) => FeedbackData[];
  getFeedbackByType: (type: string) => FeedbackData[];
  getInsights: () => FeedbackInsights;
  getAnalytics: () => FeedbackAnalytics;
  clearFeedback: () => Promise<void>;
  exportFeedback: () => Promise<string>;
}

const STORAGE_KEY = '@shamah_feedback_data';

const FEEDBACK_TAGS = {
  POSITIVE: ['useful', 'accurate', 'relevant', 'timely', 'actionable', 'comprehensive'],
  NEGATIVE: ['outdated', 'irrelevant', 'inaccurate', 'confusing', 'incomplete', 'repetitive'],
  NEUTRAL: ['needs_improvement', 'partially_helpful', 'too_generic', 'too_specific'],
};

export function useFeedbackManager(): FeedbackManagerHook {
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedFeedbacks = JSON.parse(stored).map((f: any) => ({
          ...f,
          createdAt: new Date(f.createdAt),
        }));
        setFeedbacks(parsedFeedbacks);
      }
    } catch (error) {
      console.error('Erro ao carregar feedbacks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFeedbacks = async (newFeedbacks: FeedbackData[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFeedbacks));
      setFeedbacks(newFeedbacks);
    } catch (error) {
      console.error('Erro ao salvar feedbacks:', error);
    }
  };

  const submitFeedback = async (feedback: Omit<FeedbackData, 'id' | 'userId' | 'createdAt'>) => {
    try {
      const newFeedback: FeedbackData = {
        ...feedback,
        id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: 'current_user', // Em produção, vem do sistema de auth
        createdAt: new Date(),
      };

      const updatedFeedbacks = [...feedbacks, newFeedback];
      await saveFeedbacks(updatedFeedbacks);
      
      // Analisar feedback para melhorias imediatas
      analyzeFeedbackForImprovements(newFeedback);
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      throw error;
    }
  };

  const analyzeFeedbackForImprovements = (feedback: FeedbackData) => {
    // Análise simples para identificar padrões
    if (feedback.rating <= 2 && feedback.tags.includes('inaccurate')) {
      console.log('Feedback negativo sobre precisão detectado - ajustar algoritmo');
    }
    
    if (feedback.rating >= 4 && feedback.tags.includes('relevant')) {
      console.log('Feedback positivo sobre relevância - reforçar padrões');
    }
  };

  const getFeedbackByItem = useCallback((itemId: string) => {
    return feedbacks.filter(f => f.itemId === itemId);
  }, [feedbacks]);

  const getFeedbackByType = useCallback((type: string) => {
    return feedbacks.filter(f => f.type === type);
  }, [feedbacks]);

  const getInsights = useCallback((): FeedbackInsights => {
    if (feedbacks.length === 0) {
      return {
        totalFeedbacks: 0,
        averageRating: 0,
        helpfulPercentage: 0,
        mostUsefulTags: [],
        improvementAreas: [],
        userSatisfaction: 'medium',
        recommendations: [],
      };
    }

    const totalFeedbacks = feedbacks.length;
    const averageRating = feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedbacks;
    const helpfulCount = feedbacks.filter(f => f.helpful).length;
    const helpfulPercentage = (helpfulCount / totalFeedbacks) * 100;

    // Análise de tags
    const allTags = feedbacks.flatMap(f => f.tags);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostUsefulTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag);

    // Identificar áreas de melhoria
    const negativeFeedbacks = feedbacks.filter(f => f.rating <= 2);
    const improvementTags = negativeFeedbacks.flatMap(f => f.tags);
    const improvementCounts = improvementTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const improvementAreas = Object.entries(improvementCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([tag]) => tag);

    // Determinar satisfação do usuário
    let userSatisfaction: 'high' | 'medium' | 'low' = 'medium';
    if (averageRating >= 4 && helpfulPercentage >= 80) {
      userSatisfaction = 'high';
    } else if (averageRating <= 2.5 || helpfulPercentage < 50) {
      userSatisfaction = 'low';
    }

    // Gerar recomendações
    const recommendations: string[] = [];
    if (improvementAreas.includes('outdated')) {
      recommendations.push('Atualizar frequência de conteúdo');
    }
    if (improvementAreas.includes('irrelevant')) {
      recommendations.push('Melhorar personalização');
    }
    if (improvementAreas.includes('inaccurate')) {
      recommendations.push('Revisar fontes de dados');
    }
    if (helpfulPercentage < 70) {
      recommendations.push('Diversificar tipos de conteúdo');
    }
    if (averageRating < 3.5) {
      recommendations.push('Implementar filtros de qualidade');
    }

    return {
      totalFeedbacks,
      averageRating,
      helpfulPercentage,
      mostUsefulTags,
      improvementAreas,
      userSatisfaction,
      recommendations,
    };
  }, [feedbacks]);

  const getAnalytics = useCallback((): FeedbackAnalytics => {
    const byType = feedbacks.reduce((acc, feedback) => {
      const type = feedback.type;
      if (!acc[type]) {
        acc[type] = { count: 0, avgRating: 0, helpfulRate: 0 };
      }
      acc[type].count++;
      return acc;
    }, {} as Record<string, { count: number; avgRating: number; helpfulRate: number }>);

    // Calcular médias por tipo
    Object.keys(byType).forEach(type => {
      const typeFeedbacks = feedbacks.filter(f => f.type === type);
      byType[type].avgRating = typeFeedbacks.reduce((sum, f) => sum + f.rating, 0) / typeFeedbacks.length;
      byType[type].helpfulRate = (typeFeedbacks.filter(f => f.helpful).length / typeFeedbacks.length) * 100;
    });

    const byPlatform = feedbacks.reduce((acc, feedback) => {
      const platform = feedback.context?.platform || 'unknown';
      if (!acc[platform]) {
        acc[platform] = { count: 0, avgRating: 0, helpfulRate: 0 };
      }
      acc[platform].count++;
      return acc;
    }, {} as Record<string, { count: number; avgRating: number; helpfulRate: number }>);

    // Calcular médias por plataforma
    Object.keys(byPlatform).forEach(platform => {
      const platformFeedbacks = feedbacks.filter(f => f.context?.platform === platform);
      byPlatform[platform].avgRating = platformFeedbacks.reduce((sum, f) => sum + f.rating, 0) / platformFeedbacks.length;
      byPlatform[platform].helpfulRate = (platformFeedbacks.filter(f => f.helpful).length / platformFeedbacks.length) * 100;
    });

    // Análise de tendências
    const now = new Date();
    const last7Days = feedbacks.filter(f => 
      (now.getTime() - f.createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 7
    ).length;
    const last30Days = feedbacks.filter(f => 
      (now.getTime() - f.createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 30
    ).length;
    const growth = last7Days > 0 ? ((last7Days * 4.3) / last30Days) * 100 - 100 : 0;

    // Análise de sentimento
    const positive = feedbacks.filter(f => f.rating >= 4).length;
    const neutral = feedbacks.filter(f => f.rating === 3).length;
    const negative = feedbacks.filter(f => f.rating <= 2).length;

    return {
      byType,
      byPlatform,
      trends: {
        last7Days,
        last30Days,
        growth,
      },
      sentiment: {
        positive,
        neutral,
        negative,
      },
    };
  }, [feedbacks]);

  const clearFeedback = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setFeedbacks([]);
    } catch (error) {
      console.error('Erro ao limpar feedbacks:', error);
    }
  };

  const exportFeedback = async (): Promise<string> => {
    try {
      const insights = getInsights();
      const analytics = getAnalytics();
      
      const exportData = {
        exportDate: new Date().toISOString(),
        summary: insights,
        analytics,
        feedbacks: feedbacks.map(f => ({
          ...f,
          createdAt: f.createdAt.toISOString(),
        })),
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      return jsonString;
    } catch (error) {
      console.error('Erro ao exportar feedbacks:', error);
      throw error;
    }
  };

  return {
    feedbacks,
    insights: getInsights(),
    analytics: getAnalytics(),
    isLoading,
    submitFeedback,
    getFeedbackByItem,
    getFeedbackByType,
    getInsights,
    getAnalytics,
    clearFeedback,
    exportFeedback,
  };
}

// Utilitários para componentes
export const createQuickFeedback = (
  itemId: string,
  type: FeedbackData['type'],
  helpful: boolean,
  rating: number,
  tags: string[] = [],
  platform?: string
): Omit<FeedbackData, 'id' | 'userId' | 'createdAt'> => ({
  type,
  itemId,
  rating,
  helpful,
  tags,
  context: platform ? { platform } : undefined,
});

export const getFeedbackSuggestions = (
  type: FeedbackData['type'],
  rating: number
): string[] => {
  if (rating >= 4) {
    return FEEDBACK_TAGS.POSITIVE;
  } else if (rating <= 2) {
    return FEEDBACK_TAGS.NEGATIVE;
  } else {
    return FEEDBACK_TAGS.NEUTRAL;
  }
};

export const generateFeedbackReport = (
  feedbacks: FeedbackData[],
  insights: FeedbackInsights,
  analytics: FeedbackAnalytics
): string => {
  return `
# Relatório de Feedback - Shamah Publi

## Resumo Geral
- **Total de Feedbacks**: ${insights.totalFeedbacks}
- **Avaliação Média**: ${insights.averageRating.toFixed(1)}/5
- **Taxa de Utilidade**: ${insights.helpfulPercentage.toFixed(1)}%
- **Satisfação do Usuário**: ${insights.userSatisfaction}

## Tags Mais Úteis
${insights.mostUsefulTags.map(tag => `- ${tag}`).join('\n')}

## Áreas de Melhoria
${insights.improvementAreas.map(area => `- ${area}`).join('\n')}

## Recomendações
${insights.recommendations.map(rec => `- ${rec}`).join('\n')}

## Análise por Tipo
${Object.entries(analytics.byType).map(([type, data]) => 
  `- **${type}**: ${data.count} feedbacks, ${data.avgRating.toFixed(1)}/5, ${data.helpfulRate.toFixed(1)}% útil`
).join('\n')}

## Tendências
- **Últimos 7 dias**: ${analytics.trends.last7Days} feedbacks
- **Últimos 30 dias**: ${analytics.trends.last30Days} feedbacks
- **Crescimento**: ${analytics.trends.growth.toFixed(1)}%

## Sentimento
- **Positivo**: ${analytics.sentiment.positive} (${((analytics.sentiment.positive / insights.totalFeedbacks) * 100).toFixed(1)}%)
- **Neutro**: ${analytics.sentiment.neutral} (${((analytics.sentiment.neutral / insights.totalFeedbacks) * 100).toFixed(1)}%)
- **Negativo**: ${analytics.sentiment.negative} (${((analytics.sentiment.negative / insights.totalFeedbacks) * 100).toFixed(1)}%)
`;
};
