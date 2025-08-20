import React, { createContext, useContext, ReactNode } from 'react';
import { useLoadingManager, LoadingManagerHook } from '../hooks/useLoadingManager';
import ShamahLoadingScreen from '../components/ShamahLoadingScreen';

interface LoadingContextType extends LoadingManagerHook {
  // Extensões futuras podem ser adicionadas aqui
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading deve ser usado dentro de um LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const loadingManager = useLoadingManager();

  return (
    <LoadingContext.Provider value={loadingManager}>
      {children}
      <ShamahLoadingScreen
        visible={loadingManager.loading.visible}
        message={loadingManager.loading.message}
        type={loadingManager.loading.type}
        progress={loadingManager.loading.progress}
        onComplete={loadingManager.hideLoading}
      />
    </LoadingContext.Provider>
  );
};
