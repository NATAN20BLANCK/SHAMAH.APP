import React, { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import AsyncStorage from '../utils/AsyncStorage';
import { translations } from '../constants/translations';

// Mock para expo-localization
const getLocales = () => [{ languageCode: 'pt' }];

type Language = 'pt' | 'en' | 'es';
type TranslationKey = keyof typeof translations.pt;

interface I18nHook {
  language: Language;
  availableLanguages: Language[];
  t: (key: TranslationKey, params?: Record<string, string>) => string;
  setLanguage: (language: Language) => Promise<void>;
  detectLanguage: () => Promise<Language>;
  getLanguageInfo: (language: Language) => {
    name: string;
    nativeName: string;
    flag: string;
  };
  formatNumber: (value: number) => string;
  formatCurrency: (value: number) => string;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
  formatDateTime: (date: Date) => string;
  formatRelativeTime: (date: Date) => string;
  isRTL: () => boolean;
  getDirection: () => 'ltr' | 'rtl';
}

// Context para I18n
const I18nContext = createContext<I18nHook | null>(null);

const LANGUAGE_INFO = {
  pt: {
    name: 'Português',
    nativeName: 'Português',
    flag: '🇧🇷',
  },
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  es: {
    name: 'Español',
    nativeName: 'Español',
    flag: '🇪🇸',
  },
};

const RTL_LANGUAGES: Language[] = [];

export const useI18n = (): I18nHook => {
  const [language, setCurrentLanguage] = useState<Language>('pt');
  const availableLanguages = useMemo(() => ['pt', 'en', 'es'] as Language[], []);

  // Detectar idioma do sistema
  const detectLanguage = useCallback(async (): Promise<Language> => {
    try {
      // Tentar obter do AsyncStorage primeiro
      const storedLanguage = await AsyncStorage.getItem('app_language');
      if (storedLanguage && availableLanguages.includes(storedLanguage as Language)) {
        return storedLanguage as Language;
      }

      // Detectar do sistema
      const locales = getLocales();
      const systemLanguage = locales[0]?.languageCode as Language;
      
      if (availableLanguages.includes(systemLanguage)) {
        return systemLanguage;
      }

      return 'pt'; // fallback
    } catch {
      console.warn('Erro ao detectar idioma');
      return 'pt';
    }
  }, [availableLanguages]);

  // Função principal de tradução
  const t = useCallback((key: TranslationKey, params?: Record<string, string>): string => {
    try {
      let translation = translations[language][key] || translations.pt[key] || key;

      // Substituir parâmetros se fornecidos
      if (params) {
        Object.entries(params).forEach(([param, value]) => {
          translation = translation.replace(new RegExp(`{{${param}}}`, 'g'), value);
        });
      }

      return translation;
    } catch (error) {
      console.warn(`Tradução não encontrada para: ${key}`, error);
      return key;
    }
  }, [language]);

  // Definir idioma
  const setLanguage = useCallback(async (newLanguage: Language): Promise<void> => {
    try {
      if (availableLanguages.includes(newLanguage)) {
        setCurrentLanguage(newLanguage);
        await AsyncStorage.setItem('app_language', newLanguage);
      }
    } catch {
      console.error('Erro ao definir idioma');
    }
  }, [availableLanguages]);

  // Obter informações do idioma
  const getLanguageInfo = useCallback((lang: Language) => {
    return LANGUAGE_INFO[lang] || LANGUAGE_INFO.pt;
  }, []);

  // Formatação de números
  const formatNumber = useCallback((value: number): string => {
    try {
      return new Intl.NumberFormat(language === 'pt' ? 'pt-BR' : language === 'en' ? 'en-US' : 'es-ES').format(value);
    } catch {
      return value.toString();
    }
  }, [language]);

  // Formatação de moeda
  const formatCurrency = useCallback((value: number): string => {
    try {
      const currency = language === 'pt' ? 'BRL' : language === 'en' ? 'USD' : 'EUR';
      const locale = language === 'pt' ? 'pt-BR' : language === 'en' ? 'en-US' : 'es-ES';
      
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
      }).format(value);
    } catch {
      return `${value}`;
    }
  }, [language]);

  // Formatação de data
  const formatDate = useCallback((date: Date): string => {
    try {
      const locale = language === 'pt' ? 'pt-BR' : language === 'en' ? 'en-US' : 'es-ES';
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch {
      return date.toLocaleDateString();
    }
  }, [language]);

  // Formatação de hora
  const formatTime = useCallback((date: Date): string => {
    try {
      const locale = language === 'pt' ? 'pt-BR' : language === 'en' ? 'en-US' : 'es-ES';
      return new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return date.toLocaleTimeString();
    }
  }, [language]);

  // Formatação de data e hora
  const formatDateTime = useCallback((date: Date): string => {
    return `${formatDate(date)} ${formatTime(date)}`;
  }, [formatDate, formatTime]);

  // Formatação de tempo relativo
  const formatRelativeTime = useCallback((date: Date): string => {
    try {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) {
        return 'agora mesmo';
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `há ${hours} hora${hours > 1 ? 's' : ''}`;
      } else {
        const days = Math.floor(diffInSeconds / 86400);
        if (days === 1) {
          return 'ontem';
        } else if (days < 7) {
          return `há ${days} dia${days > 1 ? 's' : ''}`;
        } else {
          return formatDate(date);
        }
      }
    } catch {
      return formatDate(date);
    }
  }, [formatDate]);

  // Verificar se é RTL
  const isRTL = useCallback((): boolean => {
    return RTL_LANGUAGES.includes(language);
  }, [language]);

  // Obter direção do texto
  const getDirection = useCallback((): 'ltr' | 'rtl' => {
    return isRTL() ? 'rtl' : 'ltr';
  }, [isRTL]);

  // Inicializar idioma na primeira carga
  useEffect(() => {
    detectLanguage().then(setCurrentLanguage);
  }, [detectLanguage]);

  return {
    language,
    availableLanguages,
    t,
    setLanguage,
    detectLanguage,
    getLanguageInfo,
    formatNumber,
    formatCurrency,
    formatDate,
    formatTime,
    formatDateTime,
    formatRelativeTime,
    isRTL,
    getDirection,
  };
};

// Utilitários para componentes
export const withTranslation = <T extends object>(
  Component: React.ComponentType<T & { t: (key: TranslationKey) => string }>
) => {
  const WithTranslationComponent = (props: T) => {
    const { t } = useI18n();
    return <Component {...props} t={t} />;
  };
  
  WithTranslationComponent.displayName = `withTranslation(${Component.displayName || Component.name})`;
  
  return WithTranslationComponent;
};

// Provider de contexto
interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const i18n = useI18n();

  return (
    <I18nContext.Provider value={i18n}>
      {children}
    </I18nContext.Provider>
  );
};

// Hook para usar o contexto
export const useI18nContext = (): I18nHook => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18nContext deve ser usado dentro de um I18nProvider');
  }
  return context;
};

// Utilitários para validação
export const validateTranslationKey = (key: string): key is TranslationKey => {
  return key in translations.pt;
};

// Utilitários para pluralização
export const pluralize = (
  count: number,
  singular: TranslationKey,
  plural: TranslationKey,
  language: Language = 'pt'
): string => {
  const key = count === 1 ? singular : plural;
  return translations[language][key] || translations.pt[key] || key;
};

// Exportar tipos
export type { Language, TranslationKey, I18nHook };
