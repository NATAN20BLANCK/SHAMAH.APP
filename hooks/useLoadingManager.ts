import { useState, useRef, useCallback } from 'react';

export interface LoadingState {
  visible: boolean;
  message: string;
  type: 'initial' | 'uploading' | 'processing' | 'downloading' | 'saving' | 'auth' | 'sync';
  progress: number;
}

export interface LoadingManagerHook {
  loading: LoadingState;
  showLoading: (message: string, type?: LoadingState['type']) => void;
  hideLoading: () => void;
  updateProgress: (progress: number) => void;
  updateMessage: (message: string) => void;
  showInitialLoading: () => void;
  showUploadLoading: (message?: string) => void;
  showProcessingLoading: (message?: string) => void;
  showAuthLoading: (message?: string) => void;
  showSyncLoading: (message?: string) => void;
}

export const useLoadingManager = (): LoadingManagerHook => {
  const [loading, setLoading] = useState<LoadingState>({
    visible: false,
    message: 'Carregando...',
    type: 'initial',
    progress: 0,
  });

  const showLoading = useCallback((message: string, type: LoadingState['type'] = 'initial') => {
    setLoading({
      visible: true,
      message,
      type,
      progress: 0,
    });
  }, []);

  const hideLoading = useCallback(() => {
    setLoading(prev => ({
      ...prev,
      visible: false,
    }));
  }, []);

  const updateProgress = useCallback((progress: number) => {
    setLoading(prev => ({
      ...prev,
      progress: Math.min(100, Math.max(0, progress)),
    }));
  }, []);

  const updateMessage = useCallback((message: string) => {
    setLoading(prev => ({
      ...prev,
      message,
    }));
  }, []);

  // Funções específicas por tipo de carregamento
  const showInitialLoading = useCallback(() => {
    showLoading('Iniciando Shamah Publi...', 'initial');
  }, [showLoading]);

  const showUploadLoading = useCallback((message: string = 'Enviando mídia...') => {
    showLoading(message, 'uploading');
  }, [showLoading]);

  const showProcessingLoading = useCallback((message: string = 'Processando conteúdo...') => {
    showLoading(message, 'processing');
  }, [showLoading]);

  const showAuthLoading = useCallback((message: string = 'Autenticando...') => {
    showLoading(message, 'auth');
  }, [showLoading]);

  const showSyncLoading = useCallback((message: string = 'Sincronizando dados...') => {
    showLoading(message, 'sync');
  }, [showLoading]);

  return {
    loading,
    showLoading,
    hideLoading,
    updateProgress,
    updateMessage,
    showInitialLoading,
    showUploadLoading,
    showProcessingLoading,
    showAuthLoading,
    showSyncLoading,
  };
};

// Simulador de progresso para demonstração
export const useProgressSimulator = () => {
  const progressRef = useRef<number | null>(null);

  const simulateProgress = useCallback((
    onProgress: (progress: number) => void,
    onComplete: () => void,
    duration: number = 3000
  ) => {
    let progress = 0;
    const increment = 100 / (duration / 100);

    if (progressRef.current) {
      clearInterval(progressRef.current);
    }

    progressRef.current = window.setInterval(() => {
      progress += increment;
      
      if (progress >= 100) {
        progress = 100;
        onProgress(progress);
        
        if (progressRef.current) {
          clearInterval(progressRef.current);
          progressRef.current = null;
        }
        
        setTimeout(onComplete, 500);
      } else {
        onProgress(progress);
      }
    }, 100);
  }, []);

  const stopSimulation = useCallback(() => {
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
  }, []);

  return {
    simulateProgress,
    stopSimulation,
  };
};
