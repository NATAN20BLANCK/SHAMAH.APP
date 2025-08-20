import { useColorScheme } from './useColorScheme';
import { Colors } from '../constants/Colors';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export const theme = {
  colors: {
    gradient: ['#0D47A1', '#512DA8'] as const,
    card: '#ffffff22',
    cardAlt: '#1A237Ecc',
    text: '#fff',
    textSecondary: '#e0e0e0',
    button: '#00c853',
    accent: '#ffd600',
    tabBar: '#ffffff11'
  },
  borderRadius: 24,
  borderRadiusSmall: 12
};