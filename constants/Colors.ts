/**
 * Shamah Publi - Sistema de Cores Unificado
 * Paleta de cores moderna e profissional
 */

// CORES PRIMÁRIAS DA MARCA
const shamahPrimary = '#6366f1'; // Indigo vibrante
const shamahSecondary = '#8b5cf6'; // Violet elegante  
const shamahAccent = '#06b6d4'; // Cyan vibrante
const shamahSuccess = '#10b981'; // Emerald
const shamahWarning = '#f59e0b'; // Amber
const shamahDanger = '#ef4444'; // Red
const shamahWhite = '#ffffff'; // Branco puro

// NEUTROS SOFISTICADOS
const shamahNeutral = {
  50: '#f8fafc',
  100: '#f1f5f9', 
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
};

// GRADIENTES DA MARCA
export const ShamahGradients = {
  primary: [shamahPrimary, shamahSecondary] as const,
  secondary: [shamahSecondary, shamahAccent] as const,
  success: [shamahSuccess, '#059669'] as const,
  sunset: [shamahWarning, '#f97316'] as const,
  ocean: [shamahAccent, '#0891b2'] as const,
  cosmic: [shamahPrimary, shamahSecondary, shamahAccent] as const,
  midnight: ['#1e1b4b', '#312e81', '#3730a3'] as const,
  dawn: ['#fef3c7', '#fed7aa', '#fecaca'] as const,
};

// SISTEMA DE CORES UNIFICADO
export const ShamahColors = {
  // Cores principais
  primary: shamahPrimary,
  secondary: shamahSecondary,
  accent: shamahAccent,
  success: shamahSuccess,
  warning: shamahWarning,
  danger: shamahDanger,
  error: shamahDanger, // Alias
  white: shamahWhite,
  
  // Textos
  textPrimary: shamahNeutral[900],
  textSecondary: shamahNeutral[600],
  textLight: shamahNeutral[50],
  
  // Fundos
  backgroundPrimary: shamahNeutral[50],
  backgroundSecondary: shamahWhite,
  backgroundDark: shamahNeutral[900],
  
  // Bordas
  borderLight: shamahNeutral[200],
  borderMedium: shamahNeutral[300],
  borderDark: shamahNeutral[700],
  
  // Neutros
  neutral: shamahNeutral,
  
  // Botões
  button: {
    primary: shamahPrimary,
    secondary: shamahSecondary,
    success: shamahSuccess,
    warning: shamahWarning,
    danger: shamahDanger,
  },
  
  // Overlays
  overlay: {
    light: 'rgba(15, 23, 42, 0.4)',
    medium: 'rgba(15, 23, 42, 0.6)',
    heavy: 'rgba(15, 23, 42, 0.8)',
  },
  
  // Estados
  states: {
    hover: 'rgba(99, 102, 241, 0.1)',
    pressed: 'rgba(99, 102, 241, 0.2)',
    disabled: shamahNeutral[300],
    focus: shamahPrimary,
  }
};

// SISTEMA DE CORES PARA TEMAS (Light/Dark)
export const Colors = {
  light: {
    text: shamahNeutral[900],
    textSecondary: shamahNeutral[600],
    background: shamahNeutral[50],
    backgroundSecondary: shamahWhite,
    tint: shamahPrimary,
    icon: shamahNeutral[500],
    tabIconDefault: shamahNeutral[400],
    tabIconSelected: shamahPrimary,
    border: shamahNeutral[200],
    card: shamahWhite,
    cardShadow: 'rgba(99, 102, 241, 0.1)',
  },
  dark: {
    text: shamahNeutral[50],
    textSecondary: shamahNeutral[400],
    background: shamahNeutral[900],
    backgroundSecondary: shamahNeutral[800],
    tint: shamahSecondary,
    icon: shamahNeutral[400],
    tabIconDefault: shamahNeutral[500],
    tabIconSelected: shamahSecondary,
    border: shamahNeutral[700],
    card: shamahNeutral[800],
    cardShadow: 'rgba(139, 92, 246, 0.2)',
  },
};

// EXPORT PADRÃO (para compatibilidade)
export default {
  ShamahColors,
  ShamahGradients,
  Colors,
};
