import { Platform } from 'react-native';

export interface VideoAnalysis {
  content: {
    type: 'person' | 'landscape' | 'product' | 'text' | 'mixed';
    confidence: number;
    description: string;
    tags: string[];
  };
  technical: {
    quality: 'low' | 'medium' | 'high' | 'ultra';
    stability: number;
    lighting: 'poor' | 'good' | 'excellent';
    audio: 'none' | 'voice' | 'music' | 'mixed';
  };
  engagement: {
    hookStrength: number;
    visualAppeal: number;
    pacing: 'slow' | 'medium' | 'fast';
    trend: 'rising' | 'stable' | 'declining';
  };
  recommendations: {
    platforms: string[];
    timing: string[];
    improvements: string[];
    hashtags: string[];
  };
}

export interface PlatformRecommendation {
  platform: string;
  score: number;
  reasons: string[];
  optimizations: string[];
  expectedPerformance: {
    views: number;
    engagement: number;
    reach: number;
  };
}

export interface ContentOptimization {
  title: string;
  description: string;
  hashtags: string[];
  bestTimes: string[];
  audienceTargeting: {
    age: string;
    interests: string[];
    location: string[];
  };
}

export class AIAnalysisService {
  private apiKey: string | null = null;
  private analysisCache: Map<string, VideoAnalysis> = new Map();
  
  // Configurar API key (para serviços reais)
  setApiKey(key: string) {
    this.apiKey = key;
  }

  // Análise completa de vídeo
  async analyzeVideo(videoUri: string): Promise<VideoAnalysis> {
    // Verificar cache
    const cached = this.analysisCache.get(videoUri);
    if (cached) return cached;

    // Simular análise de IA
    await this.delay(2000);
    
    const analysis: VideoAnalysis = {
      content: {
        type: this.randomChoice(['person', 'landscape', 'product', 'text', 'mixed']),
        confidence: Math.random() * 0.3 + 0.7, // 70-100%
        description: this.generateDescription(),
        tags: this.generateTags(),
      },
      technical: {
        quality: this.randomChoice(['low', 'medium', 'high', 'ultra']),
        stability: Math.random() * 0.3 + 0.7, // 70-100%
        lighting: this.randomChoice(['poor', 'good', 'excellent']),
        audio: this.randomChoice(['none', 'voice', 'music', 'mixed']),
      },
      engagement: {
        hookStrength: Math.random() * 0.4 + 0.6, // 60-100%
        visualAppeal: Math.random() * 0.3 + 0.7, // 70-100%
        pacing: this.randomChoice(['slow', 'medium', 'fast']),
        trend: this.randomChoice(['rising', 'stable', 'declining']),
      },
      recommendations: {
        platforms: this.generatePlatformRecommendations(),
        timing: this.generateTimingRecommendations(),
        improvements: this.generateImprovements(),
        hashtags: this.generateHashtags(),
      },
    };

    // Cache por 1 hora
    this.analysisCache.set(videoUri, analysis);
    setTimeout(() => this.analysisCache.delete(videoUri), 3600000);
    
    return analysis;
  }

  // Recomendações específicas por plataforma
  async getPlatformRecommendations(videoUri: string): Promise<PlatformRecommendation[]> {
    const analysis = await this.analyzeVideo(videoUri);
    
    const platforms = [
      'TikTok',
      'Instagram Reels',
      'YouTube Shorts',
      'Kwai',
      'Facebook Reels',
      'Twitter',
    ];

    return platforms.map(platform => ({
      platform,
      score: this.calculatePlatformScore(analysis, platform),
      reasons: this.generatePlatformReasons(analysis, platform),
      optimizations: this.generatePlatformOptimizations(analysis, platform),
      expectedPerformance: this.generatePerformanceProjection(analysis, platform),
    }));
  }

  // Otimização de conteúdo
  async optimizeContent(videoUri: string, platform: string): Promise<ContentOptimization> {
    const analysis = await this.analyzeVideo(videoUri);
    
    return {
      title: this.generateOptimizedTitle(analysis, platform),
      description: this.generateOptimizedDescription(analysis, platform),
      hashtags: this.generateOptimizedHashtags(analysis, platform),
      bestTimes: this.generateBestTimes(platform),
      audienceTargeting: this.generateAudienceTargeting(analysis, platform),
    };
  }

  // Análise de tendências
  async analyzeTrends(category: string): Promise<{
    trending: string[];
    hashtags: string[];
    sounds: string[];
    effects: string[];
    challengesOpportunities: string[];
  }> {
    await this.delay(1000);
    
    return {
      trending: [
        'Transformação pessoal',
        'Lifestyle minimalista',
        'Produtividade criativa',
        'Wellness journey',
        'Microlearning',
      ],
      hashtags: [
        '#viral2024',
        '#trending',
        '#foryou',
        '#explore',
        '#motivacao',
        '#lifestyle',
        '#criatividade',
      ],
      sounds: [
        'Trending Audio 1',
        'Viral Sound Effect',
        'Popular BGM',
        'Trending Music',
      ],
      effects: [
        'Transition Effect',
        'Color Grading',
        'Speed Ramp',
        'Text Animation',
      ],
      challengesOpportunities: [
        'Criar conteúdo educativo curto',
        'Usar transições criativas',
        'Aproveitar trending sounds',
        'Focar em micro-nichos',
      ],
    };
  }

  // Análise de concorrência
  async analyzeCompetition(niche: string): Promise<{
    topCreators: Array<{
      name: string;
      followers: number;
      engagement: number;
      content: string[];
    }>;
    contentGaps: string[];
    opportunities: string[];
    benchmarks: {
      avgViews: number;
      avgEngagement: number;
      postFrequency: number;
    };
  }> {
    await this.delay(1500);
    
    return {
      topCreators: [
        {
          name: 'Creator 1',
          followers: Math.floor(Math.random() * 1000000) + 100000,
          engagement: Math.random() * 0.1 + 0.05,
          content: ['Tutoriais', 'Lifestyle', 'Motivação'],
        },
        {
          name: 'Creator 2',
          followers: Math.floor(Math.random() * 500000) + 50000,
          engagement: Math.random() * 0.15 + 0.08,
          content: ['Reviews', 'Dicas', 'Entretenimento'],
        },
      ],
      contentGaps: [
        'Conteúdo educativo avançado',
        'Tutorials práticos',
        'Behind the scenes',
        'Colaborações',
      ],
      opportunities: [
        'Nichos menos explorados',
        'Horários alternativos',
        'Formatos inovadores',
        'Temas sazonais',
      ],
      benchmarks: {
        avgViews: Math.floor(Math.random() * 100000) + 10000,
        avgEngagement: Math.random() * 0.08 + 0.03,
        postFrequency: Math.random() * 5 + 1,
      },
    };
  }

  // Predição de performance
  async predictPerformance(
    videoUri: string,
    platform: string,
    timing: string
  ): Promise<{
    estimatedViews: number;
    estimatedEngagement: number;
    estimatedReach: number;
    confidence: number;
    factors: string[];
  }> {
    const analysis = await this.analyzeVideo(videoUri);
    
    await this.delay(800);
    
    const baseScore = this.calculatePlatformScore(analysis, platform);
    const timingMultiplier = this.getTimingMultiplier(timing);
    
    return {
      estimatedViews: Math.floor(baseScore * timingMultiplier * 10000),
      estimatedEngagement: baseScore * timingMultiplier * 0.1,
      estimatedReach: Math.floor(baseScore * timingMultiplier * 5000),
      confidence: Math.random() * 0.3 + 0.7,
      factors: [
        'Qualidade do conteúdo',
        'Timing de publicação',
        'Hashtags relevantes',
        'Tendências atuais',
        'Engajamento histórico',
      ],
    };
  }

  // Métodos auxiliares
  private randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateDescription(): string {
    const descriptions = [
      'Conteúdo criativo com foco em lifestyle',
      'Vídeo educativo e inspirador',
      'Entretenimento com toque pessoal',
      'Tutorial prático e objetivo',
      'Conteúdo motivacional e autêntico',
    ];
    return this.randomChoice(descriptions);
  }

  private generateTags(): string[] {
    const allTags = [
      'criativo', 'inspirador', 'educativo', 'viral', 'trending',
      'lifestyle', 'motivacao', 'tutorial', 'dicas', 'transformacao',
      'produtividade', 'wellness', 'autenticidade', 'inovacao',
    ];
    return allTags.sort(() => Math.random() - 0.5).slice(0, 5);
  }

  private generatePlatformRecommendations(): string[] {
    const platforms = ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'Kwai'];
    return platforms.sort(() => Math.random() - 0.5).slice(0, 3);
  }

  private generateTimingRecommendations(): string[] {
    return [
      '18:00 - 22:00 (Horário nobre)',
      '12:00 - 14:00 (Almoço)',
      '06:00 - 08:00 (Manhã)',
      'Fins de semana',
    ];
  }

  private generateImprovements(): string[] {
    const improvements = [
      'Melhorar iluminação',
      'Adicionar texto chamativo',
      'Usar trending sounds',
      'Criar hook mais forte',
      'Otimizar duração',
      'Adicionar call-to-action',
    ];
    return improvements.sort(() => Math.random() - 0.5).slice(0, 3);
  }

  private generateHashtags(): string[] {
    const hashtags = [
      '#viral', '#trending', '#foryou', '#explore', '#motivacao',
      '#lifestyle', '#criatividade', '#inspiracao', '#tutorial',
      '#dicas', '#transformacao', '#produtividade', '#wellness',
    ];
    return hashtags.sort(() => Math.random() - 0.5).slice(0, 8);
  }

  private calculatePlatformScore(analysis: VideoAnalysis, platform: string): number {
    let score = 0.5;
    
    // Fator de qualidade técnica
    score += analysis.technical.quality === 'ultra' ? 0.2 : 
             analysis.technical.quality === 'high' ? 0.15 : 0.1;
    
    // Fator de engajamento
    score += analysis.engagement.hookStrength * 0.15;
    score += analysis.engagement.visualAppeal * 0.1;
    
    // Fatores específicos da plataforma
    if (platform === 'TikTok') {
      score += analysis.engagement.pacing === 'fast' ? 0.1 : 0;
      score += analysis.technical.audio !== 'none' ? 0.1 : 0;
    }
    
    return Math.min(score, 1);
  }

  private generatePlatformReasons(analysis: VideoAnalysis, platform: string): string[] {
    const reasons = [];
    
    if (analysis.technical.quality === 'high' || analysis.technical.quality === 'ultra') {
      reasons.push('Alta qualidade visual');
    }
    
    if (analysis.engagement.hookStrength > 0.8) {
      reasons.push('Hook forte no início');
    }
    
    if (platform === 'TikTok' && analysis.engagement.pacing === 'fast') {
      reasons.push('Ritmo adequado para TikTok');
    }
    
    if (analysis.technical.audio !== 'none') {
      reasons.push('Conteúdo com áudio');
    }
    
    return reasons.slice(0, 3);
  }

  private generatePlatformOptimizations(analysis: VideoAnalysis, platform: string): string[] {
    const optimizations = [];
    
    if (platform === 'TikTok') {
      optimizations.push('Adicionar trending sound');
      optimizations.push('Usar hashtags virais');
      optimizations.push('Criar hook nos primeiros 3s');
    } else if (platform === 'Instagram Reels') {
      optimizations.push('Usar stickers interativos');
      optimizations.push('Criar carrossel de imagens');
      optimizations.push('Adicionar localização');
    }
    
    return optimizations.slice(0, 3);
  }

  private generatePerformanceProjection(analysis: VideoAnalysis, platform: string): {
    views: number;
    engagement: number;
    reach: number;
  } {
    const score = this.calculatePlatformScore(analysis, platform);
    
    return {
      views: Math.floor(score * 50000),
      engagement: Math.floor(score * 2500),
      reach: Math.floor(score * 25000),
    };
  }

  private generateOptimizedTitle(analysis: VideoAnalysis, platform: string): string {
    const titles = [
      'Você não vai acreditar no que aconteceu!',
      'O segredo que ninguém te conta',
      'Transformação incrível em 30 dias',
      'Dica que mudou minha vida',
      'Tutorial que todo mundo precisa ver',
    ];
    return this.randomChoice(titles);
  }

  private generateOptimizedDescription(analysis: VideoAnalysis, platform: string): string {
    return `Conteúdo criado especialmente para ${platform}. ${analysis.content.description}`;
  }

  private generateOptimizedHashtags(analysis: VideoAnalysis, platform: string): string[] {
    const platformHashtags = {
      'TikTok': ['#fyp', '#viral', '#tiktok'],
      'Instagram Reels': ['#reels', '#instagram', '#explore'],
      'YouTube Shorts': ['#shorts', '#youtube', '#viral'],
    };
    
    return [...(platformHashtags[platform as keyof typeof platformHashtags] || []), ...analysis.recommendations.hashtags.slice(0, 5)];
  }

  private generateBestTimes(platform: string): string[] {
    const times = {
      'TikTok': ['18:00-22:00', '12:00-14:00', '06:00-08:00'],
      'Instagram Reels': ['19:00-21:00', '11:00-13:00', '17:00-19:00'],
      'YouTube Shorts': ['14:00-16:00', '20:00-22:00', '09:00-11:00'],
    };
    
    return times[platform as keyof typeof times] || ['18:00-22:00', '12:00-14:00'];
  }

  private generateAudienceTargeting(analysis: VideoAnalysis, platform: string): {
    age: string;
    interests: string[];
    location: string[];
  } {
    return {
      age: this.randomChoice(['18-24', '25-34', '35-44', '18-34']),
      interests: analysis.content.tags.slice(0, 3),
      location: ['Brasil', 'América Latina', 'Global'],
    };
  }

  private getTimingMultiplier(timing: string): number {
    const hour = parseInt(timing.split(':')[0]);
    
    if (hour >= 18 && hour <= 22) return 1.3; // Horário nobre
    if (hour >= 12 && hour <= 14) return 1.2; // Almoço
    if (hour >= 6 && hour <= 8) return 1.1;   // Manhã
    return 1.0;
  }
}

export const aiAnalysisService = new AIAnalysisService();
