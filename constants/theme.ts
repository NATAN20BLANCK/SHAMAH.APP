import { ShamahColors, ShamahGradients } from './Colors';

export { ShamahColors, ShamahGradients }; // Exportar ShamahColors e ShamahGradients

/**
 * Shamah Publi - Tema da Identidade Visual
 * Sistema completo de design consistente e moderno
 */

export const ShamahTheme = {
  // Paleta de cores da marca
  colors: {
    primary: ShamahColors.primary,
    secondary: ShamahColors.secondary,
    accent: ShamahColors.accent,
    success: ShamahColors.success,
    warning: ShamahColors.warning,
    danger: ShamahColors.danger,
    neutral: ShamahColors.neutral,
    
    // Gradientes assinatura
    gradients: ShamahGradients,
    
    // Cards e surfaces
    card: {
      background: 'rgba(255, 255, 255, 0.95)',
      backgroundDark: 'rgba(30, 41, 59, 0.95)',
      border: ShamahColors.neutral[200],
      shadow: 'rgba(99, 102, 241, 0.1)',
    },
    
    // Botões
    button: {
      primary: ShamahColors.primary,
      secondary: ShamahColors.secondary,
      success: ShamahColors.success,
      warning: ShamahColors.warning,
      danger: ShamahColors.danger,
      disabled: ShamahColors.neutral[300],
    },
    
    // Tab bar personalizada
    tabBar: {
      background: 'rgba(255, 255, 255, 0.95)',
      backgroundDark: 'rgba(30, 41, 59, 0.95)',
      border: ShamahColors.neutral[200],
      shadow: '0 -2px 10px rgba(99, 102, 241, 0.1)',
    }
  },
  
  // Tipografia melhorada
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    sizes: {
      xs: 13,      // Era 12, agora 13
      sm: 15,      // Era 14, agora 15  
      base: 17,    // Era 16, agora 17
      lg: 20,      // Era 18, agora 20
      xl: 22,      // Era 20, agora 22
      '2xl': 26,   // Era 24, agora 26
      '3xl': 32,   // Era 30, agora 32
      '4xl': 38,   // Era 36, agora 38
      '5xl': 52,   // Era 48, agora 52
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    }
  },
  
  // Espaçamentos consistentes
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  
  // Border radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  },
  
  // Sombras elegantes
  shadows: {
    sm: '0 1px 2px rgba(99, 102, 241, 0.05)',
    md: '0 4px 6px rgba(99, 102, 241, 0.1)',
    lg: '0 10px 15px rgba(99, 102, 241, 0.1)',
    xl: '0 20px 25px rgba(99, 102, 241, 0.15)',
    '2xl': '0 25px 50px rgba(99, 102, 241, 0.25)',
  },
  
  // Animações
  animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      default: 'ease-in-out',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    }
  },
  
  // Layout
  layout: {
    headerHeight: 60,
    tabBarHeight: 80,
    fabSize: 64,
    containerPadding: 20,
  }
};

// Tema legado para compatibilidade
export const theme = {
  colors: {
    gradient: ShamahGradients.primary,
    card: ShamahTheme.colors.card.background,
    cardAlt: ShamahTheme.colors.card.backgroundDark,
    text: ShamahColors.neutral[50],
    button: ShamahColors.success,
    tabBar: ShamahTheme.colors.tabBar.background
  },
  borderRadius: ShamahTheme.borderRadius.xl,
  borderRadiusSmall: ShamahTheme.borderRadius.lg
};