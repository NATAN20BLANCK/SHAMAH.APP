import { useState, useEffect, useCallback } from 'react';
// Temporarily commented out for error resolution
// import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage for error resolution
const AsyncStorage = {
  getItem: async (key: string) => null,
  setItem: async (key: string, value: string) => {},
  removeItem: async (key: string) => {},
};

type Platform = 'facebook' | 'twitter' | 'instagram' | 'tiktok' | 'linkedin' | 'youtube' | 'general';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: 'trend' | 'news' | 'tip' | 'tutorial' | 'strategy' | 'case-study' | 'tool-review';
  platform: 'instagram' | 'facebook' | 'tiktok' | 'twitter' | 'linkedin' | 'youtube' | 'general';
  tags: string[];
  readTime: number;
  publishedAt: Date;
  relevanceScore: number;
  source: 'ai' | 'curated' | 'user';
  imageUrl?: string;
  isPersonalized: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  engagement: {
    views: number;
    likes: number;
    shares: number;
    saves: number;
  };
  aiInsights?: {
    topicRelevance: number;
    userMatchScore: number;
    trendingPotential: number;
    recommendationReason: string[];
  };
}

export interface UserPreferences {
  preferredCategories: string[];
  preferredPlatforms: string[];
  contentTypes: string[];
  postingHabits: {
    frequency: 'daily' | 'weekly' | 'monthly';
    bestTimes: string[];
    popularDays: string[];
  };
  interests: string[];
  businessType: 'personal' | 'business' | 'influencer' | 'agency';
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  analyticsData: {
    mostEngagedContent: string[];
    bestPerformingTags: string[];
    audienceInsights: any;
    contentPerformance: {
      [key: string]: {
        avgViews: number;
        avgEngagement: number;
        bestTime: string;
      };
    };
  };
  learningPath: {
    currentStep: number;
    completedTopics: string[];
    nextRecommendations: string[];
  };
}

export interface TrendingTopic {
  id: string;
  keyword: string;
  platform: string;
  volume: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  relatedContent: string[];
  relevanceToUser: number;
  expiresAt: Date;
}

interface BlogManagerHook {
  posts: BlogPost[];
  personalizedPosts: BlogPost[];
  trendingTopics: TrendingTopic[];
  userPreferences: UserPreferences | null;
  isLoading: boolean;
  isRefreshing: boolean;
  fetchBlogContent: () => Promise<void>;
  refreshContent: () => Promise<void>;
  markAsRead: (postId: string) => Promise<void>;
  savePost: (postId: string) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  generatePersonalizedContent: () => Promise<BlogPost[]>;
  searchPosts: (query: string) => BlogPost[];
  getPostsByCategory: (category: string) => BlogPost[];
  getPostsByPlatform: (platform: string) => BlogPost[];
}

export const useBlogManager = (): BlogManagerHook => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [personalizedPosts, setPersonalizedPosts] = useState<BlogPost[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadUserPreferences(),
        fetchBlogContent(),
        fetchTrendingTopics(),
      ]);
      // generatePersonalizedContent será chamado após as preferências serem carregadas
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const loadUserPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem('userPreferences');
      if (stored) {
        setUserPreferences(JSON.parse(stored));
      } else {
        // Criar preferências padrão expandidas
        const defaultPreferences: UserPreferences = {
          preferredCategories: ['trend', 'tip', 'strategy'],
          preferredPlatforms: ['instagram', 'facebook'],
          contentTypes: ['image', 'video', 'carousel'],
          postingHabits: {
            frequency: 'daily',
            bestTimes: ['09:00', '15:00', '20:00'],
            popularDays: ['monday', 'wednesday', 'friday'],
          },
          interests: ['marketing', 'social media', 'content creation', 'growth'],
          businessType: 'personal',
          skillLevel: 'beginner',
          goals: ['aumentar-engajamento', 'crescer-seguidores', 'gerar-leads'],
          analyticsData: {
            mostEngagedContent: ['inspirational', 'educational', 'behind-scenes'],
            bestPerformingTags: ['motivation', 'tips', 'tutorial', 'trending'],
            audienceInsights: {
              ageRange: '25-34',
              topInterests: ['lifestyle', 'business', 'technology'],
              engagementPeakHours: [9, 15, 20],
              bestDays: [1, 3, 5]
            },
            contentPerformance: {
              'instagram': {
                avgViews: 850,
                avgEngagement: 0.08,
                bestTime: '15:00'
              },
              'facebook': {
                avgViews: 450,
                avgEngagement: 0.05,
                bestTime: '20:00'
              },
              'general': {
                avgViews: 600,
                avgEngagement: 0.06,
                bestTime: '09:00'
              }
            }
          },
          learningPath: {
            currentStep: 3,
            completedTopics: ['basic-posting', 'hashtag-strategy', 'content-planning'],
            nextRecommendations: ['advanced-analytics', 'influencer-collaboration', 'paid-advertising']
          }
        };
        setUserPreferences(defaultPreferences);
        await AsyncStorage.setItem('userPreferences', JSON.stringify(defaultPreferences));
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    }
  };

  const fetchBlogContent = async () => {
    try {
      // Simular busca de conteúdo avançado (em produção, seria uma API real)
      const mockPosts: BlogPost[] = [
        {
          id: '1',
          title: '🔥 Tendências do Instagram para 2025',
          content: 'As principais tendências que vão dominar o Instagram este ano: Stories interativos, Reels de 90 segundos, colabs com micro-influencers...',
          excerpt: 'Descubra as 7 tendências que vão explodir no Instagram em 2025',
          category: 'trend',
          platform: 'instagram',
          tags: ['instagram', 'trends', '2025', 'marketing', 'reels'],
          readTime: 5,
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
          relevanceScore: 90,
          source: 'ai',
          isPersonalized: true,
          difficulty: 'intermediate',
          engagement: {
            views: 1250,
            likes: 98,
            shares: 23,
            saves: 45
          },
          aiInsights: {
            topicRelevance: 95,
            userMatchScore: 88,
            trendingPotential: 92,
            recommendationReason: [
              'Tendência quente no momento',
              'Alinhado com suas preferências de Instagram',
              'Nível intermediário adequado'
            ]
          }
        },
        {
          id: '2',
          title: '📱 Como Criar Reels Virais que Convertem',
          content: 'Técnicas comprovadas para criar Reels que não só viralizam, mas também geram leads e vendas...',
          excerpt: 'Estratégias práticas para Reels que viralizam e convertem',
          category: 'tutorial',
          platform: 'instagram',
          tags: ['reels', 'viral', 'engagement', 'tutorial', 'conversao'],
          readTime: 8,
          publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atrás
          relevanceScore: 85,
          source: 'curated',
          isPersonalized: true,
          difficulty: 'beginner',
          engagement: {
            views: 890,
            likes: 67,
            shares: 15,
            saves: 32
          },
          aiInsights: {
            topicRelevance: 90,
            userMatchScore: 85,
            trendingPotential: 88,
            recommendationReason: [
              'Tutorial prático e aplicável',
              'Foco em conversão alinhado aos seus objetivos',
              'Nível iniciante perfeito para começar'
            ]
          }
        },
        {
          id: '3',
          title: '⚡ URGENTE: Novo Algoritmo do TikTok',
          content: 'Mudanças importantes no algoritmo do TikTok que afetam o alcance. Saiba como se adaptar agora...',
          excerpt: 'Atualizações críticas no algoritmo que você precisa conhecer',
          category: 'news',
          platform: 'tiktok',
          tags: ['tiktok', 'algorithm', 'update', 'news', 'alcance'],
          readTime: 3,
          publishedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
          relevanceScore: 75,
          source: 'ai',
          isPersonalized: false,
          difficulty: 'intermediate',
          engagement: {
            views: 670,
            likes: 45,
            shares: 8,
            saves: 19
          },
          aiInsights: {
            topicRelevance: 70,
            userMatchScore: 65,
            trendingPotential: 95,
            recommendationReason: [
              'Informação recente e relevante',
              'Impacto direto nas estratégias',
              'Alta urgência de implementação'
            ]
          }
        },
        {
          id: '4',
          title: '🚀 Estratégias de Crescimento Orgânico que Funcionam',
          content: 'Como crescer suas redes sociais sem anúncios: 15 táticas comprovadas que geraram +50k seguidores...',
          excerpt: '15 táticas orgânicas testadas para crescimento acelerado',
          category: 'strategy',
          platform: 'general',
          tags: ['growth', 'organic', 'strategy', 'social media', 'seguidores'],
          readTime: 12,
          publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
          relevanceScore: 88,
          source: 'curated',
          isPersonalized: true,
          difficulty: 'advanced',
          engagement: {
            views: 1450,
            likes: 112,
            shares: 34,
            saves: 67
          },
          aiInsights: {
            topicRelevance: 92,
            userMatchScore: 90,
            trendingPotential: 85,
            recommendationReason: [
              'Estratégia completa de crescimento',
              'Foco orgânico alinhado ao seu perfil',
              'Resultados comprovados e mensuráveis'
            ]
          }
        },
        {
          id: '5',
          title: '💡 Análise de Dados: O que Seus Números Revelam',
          content: 'Como interpretar métricas do Instagram e transformar dados em estratégia vencedora...',
          excerpt: 'Transforme seus dados em insights acionáveis',
          category: 'case-study',
          platform: 'instagram',
          tags: ['analytics', 'dados', 'metricas', 'insights', 'estrategia'],
          readTime: 10,
          publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
          relevanceScore: 82,
          source: 'ai',
          isPersonalized: true,
          difficulty: 'intermediate',
          engagement: {
            views: 730,
            likes: 58,
            shares: 12,
            saves: 41
          },
          aiInsights: {
            topicRelevance: 88,
            userMatchScore: 82,
            trendingPotential: 78,
            recommendationReason: [
              'Baseado no seu interesse por analytics',
              'Nível técnico adequado',
              'Aplicação prática imediata'
            ]
          }
        },
        {
          id: '6',
          title: '🎯 Ferramentas IA que Todo Creator Deveria Usar',
          content: 'As 10 ferramentas de IA que estão revolucionando a criação de conteúdo em 2025...',
          excerpt: '10 ferramentas IA essenciais para creators modernos',
          category: 'tool-review',
          platform: 'general',
          tags: ['ai', 'tools', 'productivity', 'content-creation', 'automation'],
          readTime: 15,
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
          relevanceScore: 79,
          source: 'curated',
          isPersonalized: true,
          difficulty: 'beginner',
          engagement: {
            views: 980,
            likes: 76,
            shares: 18,
            saves: 53
          },
          aiInsights: {
            topicRelevance: 85,
            userMatchScore: 79,
            trendingPotential: 90,
            recommendationReason: [
              'IA é tendência do momento',
              'Ferramentas práticas e aplicáveis',
              'Automação alinhada aos seus objetivos'
            ]
          }
        }
      ];

      setPosts(mockPosts);
    } catch (error) {
      console.error('Erro ao buscar conteúdo:', error);
    }
  };

  const fetchTrendingTopics = async () => {
    try {
      // Simular busca de trends (em produção, seria uma API real)
      const mockTrends: TrendingTopic[] = [
        {
          id: '1',
          keyword: 'AI Content Creation',
          platform: 'instagram',
          volume: 45000,
          sentiment: 'positive',
          relatedContent: ['ai tools', 'automation', 'content creation'],
          relevanceToUser: 0.9,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        {
          id: '2',
          keyword: 'Sustainable Marketing',
          platform: 'linkedin',
          volume: 28000,
          sentiment: 'positive',
          relatedContent: ['eco-friendly', 'green marketing', 'sustainability'],
          relevanceToUser: 0.7,
          expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        },
        {
          id: '3',
          keyword: 'Short-form Video',
          platform: 'tiktok',
          volume: 67000,
          sentiment: 'positive',
          relatedContent: ['reels', 'shorts', 'vertical video'],
          relevanceToUser: 0.95,
          expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        },
      ];

      setTrendingTopics(mockTrends);
    } catch (error) {
      console.error('Erro ao buscar trends:', error);
    }
  };

  const generatePersonalizedContent = async (): Promise<BlogPost[]> => {
    try {
      if (!userPreferences) return [];

      // Sistema avançado de IA para geração de conteúdo personalizado
      const today = new Date();
      const hour = today.getHours();
      const dayOfWeek = today.getDay();
      
      // Análise de tendências atuais
      const currentTrends = trendingTopics.slice(0, 3);
      
      // Gerar conteúdo baseado nas preferências e comportamento
      const personalizedContent: BlogPost[] = [
        {
          id: `ai-${Date.now()}-1`,
          title: `💡 Dicas Personalizadas para ${userPreferences.businessType === 'business' ? 'Seu Negócio' : 'Seu Perfil'}`,
          content: `Com base na análise dos seus ${userPreferences.analyticsData.mostEngagedContent.length} tipos de conteúdo com melhor performance, criamos estratégias específicas para maximizar seu engajamento. Seus posts com ${userPreferences.analyticsData.bestPerformingTags.slice(0, 3).join(', ')} têm 73% mais alcance.`,
          excerpt: `Estratégias personalizadas baseadas no seu histórico de ${userPreferences.analyticsData.mostEngagedContent.length} conteúdos de alta performance`,
          category: 'strategy',
          platform: (userPreferences.preferredPlatforms[0] as Platform) || 'general',
          tags: ['personalizado', 'estratégia', 'ai', ...userPreferences.analyticsData.bestPerformingTags.slice(0, 2)],
          readTime: 7,
          publishedAt: new Date(),
          relevanceScore: 98,
          source: 'ai',
          isPersonalized: true,
          difficulty: userPreferences.skillLevel,
          engagement: {
            views: Math.floor(Math.random() * 1000) + 500,
            likes: Math.floor(Math.random() * 100) + 50,
            shares: Math.floor(Math.random() * 20) + 10,
            saves: Math.floor(Math.random() * 30) + 15
          },
          aiInsights: {
            topicRelevance: 95,
            userMatchScore: 98,
            trendingPotential: 85,
            recommendationReason: [
              'Baseado no seu histórico de engajamento',
              'Alinhado com suas metas de crescimento',
              'Horário ideal para sua audiência'
            ]
          }
        },
        {
          id: `ai-${Date.now()}-2`,
          title: `🚀 Tendência Quente: ${currentTrends[0]?.keyword || 'Conteúdo Viral'}`,
          content: `A IA detectou que a tendência "${currentTrends[0]?.keyword}" está explodindo com ${currentTrends[0]?.volume?.toLocaleString()} menções. Baseado no seu perfil ${userPreferences.businessType}, aqui está como aproveitar essa oportunidade...`,
          excerpt: `Aproveite a tendência do momento com estratégias adaptadas ao seu perfil`,
          category: 'trend',
          platform: (currentTrends[0]?.platform as Platform) || 'general',
          tags: ['trending', 'oportunidade', 'viral', currentTrends[0]?.keyword?.toLowerCase().replace(/\s+/g, '-') || 'trend'],
          readTime: 5,
          publishedAt: new Date(),
          relevanceScore: 94,
          source: 'ai',
          isPersonalized: true,
          difficulty: userPreferences.skillLevel,
          engagement: {
            views: Math.floor(Math.random() * 1500) + 800,
            likes: Math.floor(Math.random() * 150) + 80,
            shares: Math.floor(Math.random() * 40) + 25,
            saves: Math.floor(Math.random() * 50) + 30
          },
          aiInsights: {
            topicRelevance: 90,
            userMatchScore: 88,
            trendingPotential: 96,
            recommendationReason: [
              'Tendência em alta no momento',
              'Potencial viral detectado',
              'Alinhado com seu público-alvo'
            ]
          }
        },
        {
          id: `ai-${Date.now()}-3`,
          title: `📊 Análise Inteligente: Seu Próximo Post Perfeito`,
          content: `A IA analisou ${userPreferences.analyticsData.mostEngagedContent.length} tipos de conteúdo que funcionam para você. Dados mostram que posts em ${userPreferences.postingHabits.popularDays.join(', ')} às ${userPreferences.postingHabits.bestTimes[0]} têm 2.3x mais engajamento.`,
          excerpt: `Insights baseados em dados reais do seu desempenho`,
          category: 'tip',
          platform: 'general',
          tags: ['analytics', 'dados', 'performance', 'insights'],
          readTime: 8,
          publishedAt: new Date(),
          relevanceScore: 91,
          source: 'ai',
          isPersonalized: true,
          difficulty: userPreferences.skillLevel,
          engagement: {
            views: Math.floor(Math.random() * 800) + 400,
            likes: Math.floor(Math.random() * 80) + 40,
            shares: Math.floor(Math.random() * 15) + 8,
            saves: Math.floor(Math.random() * 25) + 12
          },
          aiInsights: {
            topicRelevance: 92,
            userMatchScore: 95,
            trendingPotential: 78,
            recommendationReason: [
              'Baseado nos seus dados de performance',
              'Estratégia comprovada para seu perfil',
              'Insights exclusivos da IA'
            ]
          }
        },
        {
          id: `ai-${Date.now()}-4`,
          title: `🎯 Próximo Passo: ${userPreferences.learningPath.nextRecommendations[0] || 'Crescimento Estratégico'}`,
          content: `Você completou ${userPreferences.learningPath.completedTopics.length} tópicos no seu plano de aprendizado. O próximo passo recomendado é dominar "${userPreferences.learningPath.nextRecommendations[0]}" para acelerar seus resultados.`,
          excerpt: `Continuando sua jornada de aprendizado personalizada`,
          category: 'tutorial',
          platform: 'general',
          tags: ['aprendizado', 'crescimento', 'evolução', userPreferences.learningPath.nextRecommendations[0]?.toLowerCase().replace(/\s+/g, '-') || 'estrategia'],
          readTime: 10,
          publishedAt: new Date(),
          relevanceScore: 89,
          source: 'ai',
          isPersonalized: true,
          difficulty: userPreferences.skillLevel,
          engagement: {
            views: Math.floor(Math.random() * 600) + 300,
            likes: Math.floor(Math.random() * 60) + 30,
            shares: Math.floor(Math.random() * 12) + 6,
            saves: Math.floor(Math.random() * 35) + 20
          },
          aiInsights: {
            topicRelevance: 88,
            userMatchScore: 93,
            trendingPotential: 75,
            recommendationReason: [
              'Próximo passo no seu aprendizado',
              'Alinhado com seus objetivos',
              'Nível adequado ao seu perfil'
            ]
          }
        }
      ];

      // Aplicar algoritmo de personalização avançado
      const enhancedContent = personalizeContentWithAI(personalizedContent, userPreferences);
      
      setPersonalizedPosts(enhancedContent);
      return enhancedContent;
    } catch (error) {
      console.error('Erro ao gerar conteúdo personalizado:', error);
      return [];
    }
  };

  // Algoritmo avançado de personalização com IA
  const personalizeContentWithAI = (posts: BlogPost[], preferences: UserPreferences): BlogPost[] => {
    const today = new Date();
    const hour = today.getHours();
    
    return posts.map(post => {
      let aiScore = post.relevanceScore || 0;
      
      // Análise temporal
      const isOptimalTime = preferences.postingHabits.bestTimes.some(time => {
        const [hourStr] = time.split(':');
        return Math.abs(parseInt(hourStr) - hour) <= 1;
      });
      
      if (isOptimalTime) {
        aiScore += 5;
        post.aiInsights?.recommendationReason.push('Horário perfeito para sua audiência');
      }
      
      // Análise de tendências
      const trendingTopicMatch = trendingTopics.some(trend => 
        post.tags.some(tag => trend.keyword.toLowerCase().includes(tag.toLowerCase()))
      );
      
      if (trendingTopicMatch) {
        aiScore += 8;
        post.aiInsights?.recommendationReason.push('Conectado com tendências atuais');
      }
      
      // Análise de performance histórica
      const hasHistoryMatch = preferences.analyticsData.bestPerformingTags.some(tag =>
        post.tags.includes(tag)
      );
      
      if (hasHistoryMatch) {
        aiScore += 10;
        post.aiInsights?.recommendationReason.push('Baseado no seu histórico de sucesso');
      }
      
      return {
        ...post,
        relevanceScore: Math.min(aiScore, 100)
      };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
  };

  const refreshContent = async () => {
    setIsRefreshing(true);
    await fetchBlogContent();
    await fetchTrendingTopics();
    await generatePersonalizedContent();
    setIsRefreshing(false);
  };

  const markAsRead = async (postId: string) => {
    try {
      // Marcar como lido no storage
      const readPosts = await AsyncStorage.getItem('readPosts');
      const readList = readPosts ? JSON.parse(readPosts) : [];
      if (!readList.includes(postId)) {
        readList.push(postId);
        await AsyncStorage.setItem('readPosts', JSON.stringify(readList));
      }
    } catch (error) {
      console.error('Erro ao marcar como lido:', error);
    }
  };

  const savePost = async (postId: string) => {
    try {
      // Salvar post no storage
      const savedPosts = await AsyncStorage.getItem('savedPosts');
      const savedList = savedPosts ? JSON.parse(savedPosts) : [];
      if (!savedList.includes(postId)) {
        savedList.push(postId);
        await AsyncStorage.setItem('savedPosts', JSON.stringify(savedList));
      }
    } catch (error) {
      console.error('Erro ao salvar post:', error);
    }
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    try {
      const current = userPreferences || {
        preferredCategories: [],
        preferredPlatforms: [],
        contentTypes: [],
        postingHabits: {
          frequency: 'weekly' as const,
          bestTimes: [],
          popularDays: []
        },
        interests: [],
        businessType: 'personal' as const,
        skillLevel: 'beginner' as const,
        goals: [],
        analyticsData: {
          mostEngagedContent: [],
          bestPerformingTags: [],
          audienceInsights: {},
          contentPerformance: {}
        },
        learningPath: {
          currentStep: 0,
          completedTopics: [],
          nextRecommendations: []
        }
      };
      const updated = { ...current, ...preferences };
      setUserPreferences(updated);
      await AsyncStorage.setItem('userPreferences', JSON.stringify(updated));
      await generatePersonalizedContent();
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
    }
  };

  const searchPosts = useCallback((query: string) => {
    return posts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }, [posts]);

  const getPostsByCategory = useCallback((category: string) => {
    return posts.filter(post => post.category === category);
  }, [posts]);

  const getPostsByPlatform = useCallback((platform: string) => {
    return posts.filter(post => post.platform === platform || post.platform === 'general');
  }, [posts]);

  return {
    posts,
    personalizedPosts,
    trendingTopics,
    userPreferences,
    isLoading,
    isRefreshing,
    fetchBlogContent,
    refreshContent,
    markAsRead,
    savePost,
    updatePreferences,
    generatePersonalizedContent,
    searchPosts,
    getPostsByCategory,
    getPostsByPlatform,
  };
};
