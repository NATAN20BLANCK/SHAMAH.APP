import { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '../utils/AsyncStorage';
import { videoProcessingService, VideoProcessingOptions, ProcessingProgress, ProcessedVideo } from '../services/VideoProcessingService';
import { aiAnalysisService, VideoAnalysis, PlatformRecommendation } from '../services/AIAnalysisService';

// Interfaces faltantes
export interface PerformanceMetrics {
  estimatedViews: number;
  estimatedEngagement: number;
  estimatedReach: number;
  confidence: number;
  factors: string[];
}

export interface TrendData {
  trending_hashtags: string[];
  trending_sounds: string[];
  popular_content_types: string[];
  best_posting_times: string[];
  engagement_trends: any[];
}

export interface CompetitorAnalysis {
  top_competitors: string[];
  successful_content_patterns: string[];
  content_gaps: string[];
  recommended_strategies: string[];
}

export interface ValidationResult {
  valid: boolean;
  issues: string[];
  recommendations: string[];
  aiRecommendations: string[];
  platformOptimizations: string[];
}

export interface ContentOptimization {
  title: string;
  description: string;
  hashtags: string[];
  thumbnailTips: string[];
  bestPostingTime: string;
}

export interface AdaptedVideo extends OriginalVideo {
  originalId: string;
  platform: string;
  adaptations: {
    resized: boolean;
    trimmed: boolean;
    captionsAdded: boolean;
    hashtagsAdded: boolean;
    watermarkAdded: boolean;
    audioAdjusted: boolean;
  };
  processingTime: number;
  outputQuality: number;
  optimizationScore: number;
  optimization: ContentOptimization;
}

export interface VideoSpecs {
  platform: 'tiktok' | 'instagram_reels' | 'youtube_shorts' | 'kwai' | 'facebook_reels' | 'twitter';
  aspectRatio: '9:16' | '1:1' | '16:9' | '4:5';
  maxDuration: number; // em segundos
  minDuration: number; // em segundos
  resolution: {
    width: number;
    height: number;
  };
  maxFileSize: number; // em MB
  supportedFormats: string[];
  audioRequired: boolean;
  features: {
    filters: boolean;
    text: boolean;
    music: boolean;
    effects: boolean;
    captions: boolean;
    hashtags: boolean;
    mentions: boolean;
  };
}

export interface AdaptationSettings {
  autoResize: boolean;
  autoTrim: boolean;
  autoAddCaptions: boolean;
  autoAddHashtags: boolean;
  autoAddWatermark: boolean;
  qualityPreset: 'low' | 'medium' | 'high' | 'ultra';
  preserveOriginalAudio: boolean;
  addBackgroundMusic: boolean;
  cropStrategy: 'center' | 'smart' | 'top' | 'bottom';
}

export interface OriginalVideo {
  id: string;
  uri: string;
  filename: string;
  duration: number;
  resolution: {
    width: number;
    height: number;
  };
  fileSize: number;
  format: string;
  hasAudio: boolean;
  metadata: {
    fps: number;
    bitrate: number;
    codec: string;
    createdAt: Date;
  };
}

export interface ReplicationJob {
  id: string;
  originalVideo: OriginalVideo;
  targetPlatforms: string[];
  settings: AdaptationSettings;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  results: AdaptedVideo[];
  startTime: Date;
  endTime?: Date;
  errors: string[];
}

interface VideoReplicationHook {
  // Estado
  currentJob: ReplicationJob | null;
  jobs: ReplicationJob[];
  isProcessing: boolean;
  supportedPlatforms: VideoSpecs[];
  defaultSettings: AdaptationSettings;
  
  // Funções principais
  startReplication: (video: OriginalVideo, targetPlatforms: string[], settings?: Partial<AdaptationSettings>) => Promise<string>;
  pauseReplication: (jobId: string) => Promise<void>;
  resumeReplication: (jobId: string) => Promise<void>;
  cancelReplication: (jobId: string) => Promise<void>;
  
  // Adaptação específica
  adaptVideoForPlatform: (video: OriginalVideo, platform: string, settings: AdaptationSettings) => Promise<AdaptedVideo>;
  previewAdaptation: (video: OriginalVideo, platform: string) => Promise<{ preview: string; changes: string[] }>;
  
  // Configurações
  updateSettings: (settings: Partial<AdaptationSettings>) => Promise<void>;
  getOptimalSettings: (video: OriginalVideo, platforms: string[]) => Promise<AdaptationSettings>;
  
  // Análise
  analyzeVideo: (videoUri: string) => Promise<OriginalVideo>;
  analyzeVideoWithAI: (videoUri: string) => Promise<VideoAnalysis>;
  getCompatibilityScore: (video: OriginalVideo, platform: string) => number;
  getRecommendedPlatforms: (video: OriginalVideo) => string[];
  
  // Histórico
  getJobHistory: () => ReplicationJob[];
  getJobById: (jobId: string) => ReplicationJob | null;
  clearHistory: () => Promise<void>;
  
  // Utilitários
  estimateProcessingTime: (video: OriginalVideo, platforms: string[]) => number;
  calculateStorageUsage: () => Promise<number>;
  exportResults: (jobId: string) => Promise<string>;
  
  // Métodos de IA avançados
  getPlatformRecommendations: (video: OriginalVideo) => Promise<string[]>;
  optimizeContentForPlatform: (video: OriginalVideo, platform: string) => Promise<AdaptationSettings>;
  predictPerformance: (video: OriginalVideo, platform: string) => Promise<PerformanceMetrics>;
  analyzeTrends: (platform: string) => Promise<TrendData>;
  analyzeCompetition: (niche: string, platform: string) => Promise<CompetitorAnalysis>;
  processVideoWithAI: (videoUri: string, settings: AdaptationSettings) => Promise<AdaptedVideo>;
  validateVideoForPlatform: (video: OriginalVideo, platform: string) => Promise<ValidationResult>;
}

const PLATFORM_SPECS: VideoSpecs[] = [
  {
    platform: 'tiktok',
    aspectRatio: '9:16',
    maxDuration: 180,
    minDuration: 1,
    resolution: { width: 1080, height: 1920 },
    maxFileSize: 287,
    supportedFormats: ['mp4', 'mov', 'avi'],
    audioRequired: true,
    features: {
      filters: true,
      text: true,
      music: true,
      effects: true,
      captions: true,
      hashtags: true,
      mentions: true,
    },
  },
  {
    platform: 'instagram_reels',
    aspectRatio: '9:16',
    maxDuration: 90,
    minDuration: 1,
    resolution: { width: 1080, height: 1920 },
    maxFileSize: 100,
    supportedFormats: ['mp4', 'mov'],
    audioRequired: true,
    features: {
      filters: true,
      text: true,
      music: true,
      effects: true,
      captions: true,
      hashtags: true,
      mentions: true,
    },
  },
  {
    platform: 'youtube_shorts',
    aspectRatio: '9:16',
    maxDuration: 60,
    minDuration: 1,
    resolution: { width: 1080, height: 1920 },
    maxFileSize: 2000,
    supportedFormats: ['mp4', 'mov', 'avi', 'wmv'],
    audioRequired: false,
    features: {
      filters: true,
      text: true,
      music: true,
      effects: false,
      captions: true,
      hashtags: true,
      mentions: false,
    },
  },
  {
    platform: 'kwai',
    aspectRatio: '9:16',
    maxDuration: 60,
    minDuration: 1,
    resolution: { width: 720, height: 1280 },
    maxFileSize: 200,
    supportedFormats: ['mp4', 'mov'],
    audioRequired: true,
    features: {
      filters: true,
      text: true,
      music: true,
      effects: true,
      captions: true,
      hashtags: true,
      mentions: true,
    },
  },
  {
    platform: 'facebook_reels',
    aspectRatio: '9:16',
    maxDuration: 60,
    minDuration: 1,
    resolution: { width: 1080, height: 1920 },
    maxFileSize: 100,
    supportedFormats: ['mp4', 'mov'],
    audioRequired: true,
    features: {
      filters: true,
      text: true,
      music: true,
      effects: true,
      captions: true,
      hashtags: true,
      mentions: true,
    },
  },
  {
    platform: 'twitter',
    aspectRatio: '16:9',
    maxDuration: 140,
    minDuration: 1,
    resolution: { width: 1280, height: 720 },
    maxFileSize: 512,
    supportedFormats: ['mp4', 'mov'],
    audioRequired: false,
    features: {
      filters: false,
      text: true,
      music: false,
      effects: false,
      captions: true,
      hashtags: true,
      mentions: true,
    },
  },
];

const DEFAULT_SETTINGS: AdaptationSettings = {
  autoResize: true,
  autoTrim: true,
  autoAddCaptions: true,
  autoAddHashtags: true,
  autoAddWatermark: true,
  qualityPreset: 'high',
  preserveOriginalAudio: true,
  addBackgroundMusic: false,
  cropStrategy: 'smart',
};

const STORAGE_KEYS = {
  JOBS: '@shamah_replication_jobs',
  SETTINGS: '@shamah_replication_settings',
  ADAPTED_VIDEOS: '@shamah_adapted_videos',
};

export function useVideoReplication(): VideoReplicationHook {
  const [currentJob, setCurrentJob] = useState<ReplicationJob | null>(null);
  const [jobs, setJobs] = useState<ReplicationJob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [defaultSettings, setDefaultSettings] = useState<AdaptationSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      // Carregar jobs
      const storedJobs = await AsyncStorage.getItem(STORAGE_KEYS.JOBS);
      if (storedJobs) {
        const parsedJobs = JSON.parse(storedJobs).map((job: any) => ({
          ...job,
          startTime: new Date(job.startTime),
          endTime: job.endTime ? new Date(job.endTime) : undefined,
        }));
        setJobs(parsedJobs);
      }

      // Carregar configurações
      const storedSettings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (storedSettings) {
        setDefaultSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const saveJobs = async (updatedJobs: ReplicationJob[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(updatedJobs));
      setJobs(updatedJobs);
    } catch (error) {
      console.error('Erro ao salvar jobs:', error);
    }
  };

  const generateJobId = (): string => {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const generateVideoId = (): string => {
    return `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const analyzeVideo = async (videoUri: string): Promise<OriginalVideo> => {
    try {
      // Simular análise do vídeo - em produção, usar FFmpeg ou lib similar
      const fileInfo = await FileSystem.getInfoAsync(videoUri);
      
      // Valores simulados - em produção, extrair metadados reais
      const originalVideo: OriginalVideo = {
        id: generateVideoId(),
        uri: videoUri,
        filename: videoUri.split('/').pop() || 'video.mp4',
        duration: 30, // Simular 30 segundos
        resolution: {
          width: 1920,
          height: 1080,
        },
        fileSize: (fileInfo as any).size ? (fileInfo as any).size / (1024 * 1024) : 50, // MB
        format: 'mp4',
        hasAudio: true,
        metadata: {
          fps: 30,
          bitrate: 5000,
          codec: 'h264',
          createdAt: new Date(),
        },
      };

      return originalVideo;
    } catch (error) {
      console.error('Erro ao analisar vídeo:', error);
      throw error;
    }
  };

  const getCompatibilityScore = (video: OriginalVideo, platform: string): number => {
    const platformSpec = PLATFORM_SPECS.find(spec => spec.platform === platform);
    if (!platformSpec) return 0;

    let score = 100;

    // Verificar duração
    if (video.duration > platformSpec.maxDuration) {
      score -= 20;
    } else if (video.duration < platformSpec.minDuration) {
      score -= 30;
    }

    // Verificar tamanho do arquivo
    if (video.fileSize > platformSpec.maxFileSize) {
      score -= 15;
    }

    // Verificar formato
    if (!platformSpec.supportedFormats.includes(video.format)) {
      score -= 10;
    }

    // Verificar aspect ratio
    const videoAspectRatio = video.resolution.width / video.resolution.height;
    let targetAspectRatio = 16 / 9;
    
    if (platformSpec.aspectRatio === '9:16') {
      targetAspectRatio = 9 / 16;
    } else if (platformSpec.aspectRatio === '1:1') {
      targetAspectRatio = 1;
    } else if (platformSpec.aspectRatio === '4:5') {
      targetAspectRatio = 4 / 5;
    }

    const aspectRatioDiff = Math.abs(videoAspectRatio - targetAspectRatio);
    if (aspectRatioDiff > 0.1) {
      score -= 25;
    }

    // Verificar áudio
    if (platformSpec.audioRequired && !video.hasAudio) {
      score -= 20;
    }

    return Math.max(0, Math.min(100, score));
  };

  const getRecommendedPlatforms = (video: OriginalVideo): string[] => {
    const platformScores = PLATFORM_SPECS.map(spec => ({
      platform: spec.platform,
      score: getCompatibilityScore(video, spec.platform),
    }));

    return platformScores
      .filter(p => p.score >= 60)
      .sort((a, b) => b.score - a.score)
      .map(p => p.platform);
  };

  const adaptVideoForPlatform = async (
    video: OriginalVideo, 
    platform: string, 
    settings: AdaptationSettings
  ): Promise<AdaptedVideo> => {
    const platformSpec = PLATFORM_SPECS.find(spec => spec.platform === platform);
    if (!platformSpec) {
      throw new Error(`Plataforma ${platform} não suportada`);
    }

    const startTime = Date.now();
    const adaptations = {
      resized: false,
      trimmed: false,
      captionsAdded: false,
      hashtagsAdded: false,
      watermarkAdded: false,
      audioAdjusted: false,
    };

    try {
      // Simular processamento - em produção, usar FFmpeg
      
      // 1. Redimensionar se necessário
      let newWidth = video.resolution.width;
      let newHeight = video.resolution.height;
      
      if (settings.autoResize) {
        if (platformSpec.aspectRatio === '9:16' && video.resolution.width > video.resolution.height) {
          // Converter landscape para portrait
          newWidth = platformSpec.resolution.width;
          newHeight = platformSpec.resolution.height;
          adaptations.resized = true;
        } else if (platformSpec.aspectRatio === '16:9' && video.resolution.height > video.resolution.width) {
          // Converter portrait para landscape
          newWidth = platformSpec.resolution.width;
          newHeight = platformSpec.resolution.height;
          adaptations.resized = true;
        }
      }

      // 2. Cortar duração se necessário
      let newDuration = video.duration;
      if (settings.autoTrim && video.duration > platformSpec.maxDuration) {
        newDuration = platformSpec.maxDuration;
        adaptations.trimmed = true;
      }

      // 3. Adicionar legendas se configurado
      if (settings.autoAddCaptions && platformSpec.features.captions) {
        adaptations.captionsAdded = true;
      }

      // 4. Adicionar hashtags se configurado
      if (settings.autoAddHashtags && platformSpec.features.hashtags) {
        adaptations.hashtagsAdded = true;
      }

      // 5. Adicionar watermark se configurado
      if (settings.autoAddWatermark) {
        adaptations.watermarkAdded = true;
      }

      // 6. Ajustar áudio se configurado
      if (!settings.preserveOriginalAudio && platformSpec.audioRequired) {
        adaptations.audioAdjusted = true;
      }

      // Simular tempo de processamento
      const processingTime = Date.now() - startTime;

      // Calcular qualidade e score de otimização
      const outputQuality = settings.qualityPreset === 'ultra' ? 95 : 
                          settings.qualityPreset === 'high' ? 85 :
                          settings.qualityPreset === 'medium' ? 70 : 60;

      const optimizationScore = getCompatibilityScore(video, platform);

      const adaptedVideo: AdaptedVideo = {
        ...video,
        id: generateVideoId(),
        originalId: video.id,
        platform,
        resolution: {
          width: newWidth,
          height: newHeight,
        },
        duration: newDuration,
        adaptations,
        processingTime,
        outputQuality,
        optimizationScore,
        optimization: {
          title: `${video.filename} - ${platform}`,
          description: `Vídeo otimizado para ${platform}`,
          hashtags: [],
          thumbnailTips: [],
          bestPostingTime: 'afternoon',
        },
      };

      return adaptedVideo;
    } catch (error) {
      console.error('Erro na adaptação:', error);
      throw error;
    }
  };

  const startReplication = async (
    video: OriginalVideo, 
    targetPlatforms: string[], 
    settings?: Partial<AdaptationSettings>
  ): Promise<string> => {
    const jobId = generateJobId();
    const finalSettings = { ...defaultSettings, ...settings };
    
    const newJob: ReplicationJob = {
      id: jobId,
      originalVideo: video,
      targetPlatforms,
      settings: finalSettings,
      status: 'pending',
      progress: 0,
      results: [],
      startTime: new Date(),
      errors: [],
    };

    setCurrentJob(newJob);
    setIsProcessing(true);

    try {
      // Atualizar status para processando
      newJob.status = 'processing';
      const updatedJobs = [...jobs, newJob];
      await saveJobs(updatedJobs);

      // Processar cada plataforma
      for (let i = 0; i < targetPlatforms.length; i++) {
        const platform = targetPlatforms[i];
        
        try {
          const adaptedVideo = await adaptVideoForPlatform(video, platform, finalSettings);
          newJob.results.push(adaptedVideo);
          
          // Atualizar progresso
          newJob.progress = ((i + 1) / targetPlatforms.length) * 100;
          setCurrentJob({ ...newJob });
          
        } catch (error) {
          newJob.errors.push(`Erro na plataforma ${platform}: ${(error as Error).message}`);
        }
      }

      // Finalizar job
      newJob.status = newJob.errors.length === 0 ? 'completed' : 'failed';
      newJob.endTime = new Date();
      newJob.progress = 100;

      const finalJobs = jobs.map(job => job.id === jobId ? newJob : job);
      await saveJobs(finalJobs);

      setCurrentJob(null);
      setIsProcessing(false);

      return jobId;
    } catch (error) {
      newJob.status = 'failed';
      newJob.errors.push(`Erro geral: ${(error as Error).message}`);
      
      const finalJobs = jobs.map(job => job.id === jobId ? newJob : job);
      await saveJobs(finalJobs);
      
      setCurrentJob(null);
      setIsProcessing(false);
      
      throw error;
    }
  };

  const previewAdaptation = async (
    video: OriginalVideo, 
    platform: string
  ): Promise<{ preview: string; changes: string[] }> => {
    const platformSpec = PLATFORM_SPECS.find(spec => spec.platform === platform);
    if (!platformSpec) {
      throw new Error(`Plataforma ${platform} não suportada`);
    }

    const changes: string[] = [];

    // Verificar mudanças necessárias
    if (video.duration > platformSpec.maxDuration) {
      changes.push(`Duração será reduzida de ${video.duration}s para ${platformSpec.maxDuration}s`);
    }

    if (video.fileSize > platformSpec.maxFileSize) {
      changes.push(`Tamanho será reduzido de ${video.fileSize}MB para ${platformSpec.maxFileSize}MB`);
    }

    const videoAspectRatio = video.resolution.width / video.resolution.height;
    let targetAspectRatio = 16 / 9;
    
    if (platformSpec.aspectRatio === '9:16') {
      targetAspectRatio = 9 / 16;
    } else if (platformSpec.aspectRatio === '1:1') {
      targetAspectRatio = 1;
    }

    if (Math.abs(videoAspectRatio - targetAspectRatio) > 0.1) {
      changes.push(`Proporção será alterada para ${platformSpec.aspectRatio}`);
    }

    if (platformSpec.audioRequired && !video.hasAudio) {
      changes.push('Áudio será adicionado');
    }

    // Gerar preview (URL simulada)
    const preview = `preview_${platform}_${video.id}.jpg`;

    return { preview, changes };
  };

  const estimateProcessingTime = (video: OriginalVideo, platforms: string[]): number => {
    // Estimar tempo baseado na duração do vídeo e número de plataformas
    const baseTime = video.duration * 2; // 2 segundos por segundo de vídeo
    const platformMultiplier = platforms.length;
    const complexityMultiplier = video.resolution.width > 1920 ? 2 : 1;
    
    return baseTime * platformMultiplier * complexityMultiplier;
  };

  const updateSettings = async (settings: Partial<AdaptationSettings>) => {
    const newSettings = { ...defaultSettings, ...settings };
    setDefaultSettings(newSettings);
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
  };

  const getOptimalSettings = async (video: OriginalVideo, platforms: string[]): Promise<AdaptationSettings> => {
    // Analisar vídeo e plataformas para sugerir melhores configurações
    const settings = { ...defaultSettings };
    
    // Se o vídeo é muito longo, ativar auto-trim
    if (video.duration > 60) {
      settings.autoTrim = true;
    }
    
    // Se o vídeo não tem áudio, não preservar áudio original
    if (!video.hasAudio) {
      settings.preserveOriginalAudio = false;
      settings.addBackgroundMusic = true;
    }
    
    // Se muitas plataformas, usar qualidade média para economizar tempo
    if (platforms.length > 3) {
      settings.qualityPreset = 'medium';
    }
    
    return settings;
  };

  const cancelReplication = async (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job && job.status === 'processing') {
      job.status = 'failed';
      job.errors.push('Processamento cancelado pelo usuário');
      
      const updatedJobs = jobs.map(j => j.id === jobId ? job : j);
      await saveJobs(updatedJobs);
      
      if (currentJob?.id === jobId) {
        setCurrentJob(null);
        setIsProcessing(false);
      }
    }
  };

  const getJobHistory = () => {
    return jobs.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  };

  const getJobById = (jobId: string) => {
    return jobs.find(job => job.id === jobId) || null;
  };

  const clearHistory = async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.JOBS);
    setJobs([]);
  };

  const calculateStorageUsage = async (): Promise<number> => {
    // Simular cálculo de uso de armazenamento
    const totalVideos = jobs.reduce((sum, job) => sum + job.results.length, 0);
    return totalVideos * 50; // 50MB por vídeo adaptado (simulado)
  };

  const exportResults = async (jobId: string): Promise<string> => {
    const job = getJobById(jobId);
    if (!job) {
      throw new Error('Job não encontrado');
    }

    const exportData = {
      jobId: job.id,
      originalVideo: job.originalVideo,
      results: job.results,
      settings: job.settings,
      processingTime: job.endTime ? job.endTime.getTime() - job.startTime.getTime() : 0,
      exportedAt: new Date().toISOString(),
    };

    return JSON.stringify(exportData, null, 2);
  };

  // Métodos de IA avançados
  const analyzeVideoWithAI = async (videoUri: string): Promise<VideoAnalysis> => {
    return await aiAnalysisService.analyzeVideo(videoUri);
  };

  const getPlatformRecommendations = async (videoUri: string): Promise<PlatformRecommendation[]> => {
    return await aiAnalysisService.getPlatformRecommendations(videoUri);
  };

  const optimizeContentForPlatform = async (videoUri: string, platform: string) => {
    return await aiAnalysisService.optimizeContent(videoUri, platform);
  };

  const predictPerformance = async (videoUri: string, platform: string, timing: string) => {
    return await aiAnalysisService.predictPerformance(videoUri, platform, timing);
  };

  const analyzeTrends = async (category: string) => {
    return await aiAnalysisService.analyzeTrends(category);
  };

  const analyzeCompetition = async (niche: string) => {
    return await aiAnalysisService.analyzeCompetition(niche);
  };

  // Processamento avançado com serviços
  const processVideoWithAI = async (
    videoUri: string,
    platform: string,
    onProgress: (progress: ProcessingProgress) => void
  ): Promise<ProcessedVideo> => {
    // Primeiro, analisar o vídeo com IA
    const analysis = await analyzeVideoWithAI(videoUri);
    
    // Obter especificações da plataforma
    const platformSpec = PLATFORM_SPECS.find(spec => spec.platform === platform);
    if (!platformSpec) {
      throw new Error(`Plataforma ${platform} não suportada`);
    }

    // Configurar opções de processamento baseadas na análise
    const options: VideoProcessingOptions = {
      aspectRatio: platformSpec.aspectRatio,
      resolution: platformSpec.resolution,
      duration: Math.min(platformSpec.maxDuration, Math.max(platformSpec.minDuration, 30)),
      format: platformSpec.supportedFormats[0],
      bitrate: analysis.technical.quality === 'ultra' ? 3000 : 
               analysis.technical.quality === 'high' ? 2000 : 1500,
      framerate: 30,
      optimization: {
        quality: analysis.technical.quality,
        size: platformSpec.maxFileSize < 100 ? 'small' : 'medium',
      },
    };

    // Processar com o serviço
    return await videoProcessingService.processVideo(videoUri, options, onProgress);
  };

  const validateVideoForPlatform = async (videoUri: string, platform: string): Promise<ValidationResult> => {
    const analysis = await analyzeVideoWithAI(videoUri);
    const validation = await videoProcessingService.validateVideo(videoUri);
    
    return {
      ...validation,
      aiRecommendations: analysis.recommendations.improvements,
      platformOptimizations: analysis.recommendations.platforms.includes(platform) ? 
        ['Otimizado para esta plataforma'] : 
        [`Considere ajustar para ${platform}`],
    };
  };

  // Métodos de IA avançados adaptados
  const getPlatformRecommendationsAdapted = async (video: OriginalVideo): Promise<string[]> => {
    const recommendations = await getPlatformRecommendations(video.uri);
    return recommendations.map(rec => rec.platform);
  };

  const optimizeContentForPlatformAdapted = async (video: OriginalVideo, platform: string): Promise<AdaptationSettings> => {
    const optimization = await optimizeContentForPlatform(video.uri, platform);
    return {
      autoResize: true,
      autoTrim: true,
      autoAddCaptions: optimization.description.length > 0,
      autoAddHashtags: optimization.hashtags.length > 0,
      autoAddWatermark: false,
      qualityPreset: 'high',
      preserveOriginalAudio: true,
      addBackgroundMusic: false,
      cropStrategy: 'smart'
    };
  };

  const predictPerformanceAdapted = async (video: OriginalVideo, platform: string): Promise<PerformanceMetrics> => {
    return await predictPerformance(video.uri, platform, 'optimal');
  };

  const processVideoWithAIAdapted = async (videoUri: string, settings: AdaptationSettings): Promise<AdaptedVideo> => {
    // Processar o vídeo (resultado não usado no momento)
    await processVideoWithAI(videoUri, 'instagram_reels', () => {});
    
    // Buscar video original para pegar propriedades base
    const originalVideo: OriginalVideo = {
      id: Date.now().toString(),
      uri: videoUri,
      filename: `video_${Date.now()}.mp4`,
      duration: 30,
      resolution: { width: 1080, height: 1920 },
      fileSize: 50,
      format: 'mp4',
      hasAudio: true,
      metadata: {
        fps: 30,
        bitrate: 2000,
        codec: 'h264',
        createdAt: new Date(),
      },
    };

    return {
      ...originalVideo,
      originalId: originalVideo.id,
      platform: 'instagram_reels',
      uri: `processed_${Date.now()}.mp4`, // Usar nome único como uri temporariamente
      adaptations: {
        resized: settings.autoResize,
        trimmed: settings.autoTrim,
        captionsAdded: settings.autoAddCaptions,
        hashtagsAdded: settings.autoAddHashtags,
        watermarkAdded: settings.autoAddWatermark,
        audioAdjusted: !settings.preserveOriginalAudio,
      },
      processingTime: 0, // Usar valor padrão
      outputQuality: 90,
      optimizationScore: 85,
      optimization: {
        title: `Processed ${originalVideo.filename}`,
        description: '',
        hashtags: [],
        thumbnailTips: [],
        bestPostingTime: 'afternoon',
      },
    };
  };

  const analyzeTrendsAdapted = async (platform: string): Promise<TrendData> => {
    const trends = await analyzeTrends(platform);
    return {
      trending_hashtags: trends.hashtags,
      trending_sounds: trends.sounds,
      popular_content_types: trends.trending,
      best_posting_times: ['09:00', '12:00', '18:00'],
      engagement_trends: [],
    };
  };

  const analyzeCompetitionAdapted = async (niche: string, platform: string): Promise<CompetitorAnalysis> => {
    const competition = await analyzeCompetition(niche);
    return {
      top_competitors: competition.topCreators.map(c => c.name),
      successful_content_patterns: competition.topCreators.flatMap(c => c.content),
      content_gaps: competition.contentGaps,
      recommended_strategies: competition.opportunities,
    };
  };

  const validateVideoForPlatformAdapted = async (video: OriginalVideo, platform: string): Promise<ValidationResult> => {
    return await validateVideoForPlatform(video.uri, platform);
  };

  return {
    // Estado
    currentJob,
    jobs,
    isProcessing,
    supportedPlatforms: PLATFORM_SPECS,
    defaultSettings,
    
    // Funções principais
    startReplication,
    pauseReplication: async () => {}, // Implementar se necessário
    resumeReplication: async () => {}, // Implementar se necessário
    cancelReplication,
    
    // Adaptação específica
    adaptVideoForPlatform,
    previewAdaptation,
    
    // Configurações
    updateSettings,
    getOptimalSettings,
    
    // Análise
    analyzeVideo,
    getCompatibilityScore,
    getRecommendedPlatforms,
    
    // Histórico
    getJobHistory,
    getJobById,
    clearHistory,
    
    // Utilitários
    estimateProcessingTime,
    calculateStorageUsage,
    exportResults,
    
    // Métodos de IA avançados
    analyzeVideoWithAI,
    getPlatformRecommendations: getPlatformRecommendationsAdapted,
    optimizeContentForPlatform: optimizeContentForPlatformAdapted,
    predictPerformance: predictPerformanceAdapted,
    analyzeTrends: analyzeTrendsAdapted,
    analyzeCompetition: analyzeCompetitionAdapted,
    processVideoWithAI: processVideoWithAIAdapted,
    validateVideoForPlatform: validateVideoForPlatformAdapted,
  };
}
