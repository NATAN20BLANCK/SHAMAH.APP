import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShamahColors, ShamahGradients } from '../../constants/Colors';
import { ShamahTheme } from '../../constants/theme';

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const insets = useSafeAreaInsets();

  const getTabIcon = (routeName: string, focused: boolean) => {
    let iconName: keyof typeof Ionicons.glyphMap;
    
    switch (routeName) {
      case 'contas':
        iconName = 'link-outline';
        break;
      case 'afiliados':
        iconName = 'wallet-outline';
        break;
      case 'inicio':
        iconName = 'home-outline';
        break;
      case 'agendados':
        iconName = 'bar-chart-outline';
        break;
      case 'blog':
        iconName = 'newspaper-outline';
        break;
      case 'perfil':
        iconName = 'person-outline';
        break;
      default:
        iconName = 'help-outline';
    }

    return iconName;
  };

  const getTabLabel = (routeName: string) => {
    switch (routeName) {
      case 'contas':
        return 'CONTAS';
      case 'afiliados':
        return 'AFILIADOS';
      case 'inicio':
        return 'INÍCIO';
      case 'agendados':
        return 'HISTÓRICO';
      case 'blog':
        return 'BLOG';
      case 'perfil':
        return 'PERFIL';
      default:
        return routeName.toUpperCase();
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <LinearGradient
        colors={['#f1a863ff', '#69d406ff']}
        style={[styles.gradient, { borderTopLeftRadius: 24, borderTopRightRadius: 24, backdropFilter: 'blur(12px)', backgroundColor: 'rgba(255,255,255,0.08)' }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {/* Tab Items */}
        <View style={styles.tabContainer}>
          {state.routes.map((route: any, index: number) => {
            if (route.name === 'diagnostico') return null; // Pular aba de diagnóstico
            
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const iconName = getTabIcon(route.name, isFocused);
            const label = getTabLabel(route.name);

            return (
              <View key={route.key} style={styles.tabItemContainer}>
                <TouchableOpacity
                  style={[
                    styles.tabItem,
                    isFocused && styles.tabItemFocused
                  ]}
                  onPress={onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconContainer}>
                    {/* Ícone de fundo, efeito cristal */}
                    <Ionicons
                      name={iconName}
                      size={28}
                      color={'#fff'}
                      style={{ position: 'absolute', opacity: 0.18, left: -2, top: -2 }}
                    />
                    {/* Ícone principal, sempre branco */}
                    <Ionicons
                      name={iconName}
                      size={24}
                      color={'#fff'}
                      style={{ position: 'absolute', left: 0, top: 0 }}
                    />
                    {isFocused && <View style={styles.activeIndicator} />}
                  </View>
                  <Text style={[
                    styles.tabLabel,
                    { color: isFocused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)' }
                  ]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Removido o indicador central fixo */}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    boxShadow: '0 -4px 12px rgba(99, 102, 241, 0.2)',
    zIndex: 999, // Abaixo dos FABs (1000), mas acima do conteúdo
  },
  gradient: {
    paddingTop: ShamahTheme.spacing.md,
    paddingBottom: ShamahTheme.spacing.sm,
    paddingHorizontal: ShamahTheme.spacing.xs,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'relative',
  },
  tabItemContainer: {
    flex: 1,
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ShamahTheme.spacing.xs,
    paddingHorizontal: ShamahTheme.spacing.xs,
    borderRadius: ShamahTheme.borderRadius.md,
    minHeight: 50,
  },
  tabItemFocused: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 2,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
    textAlign: 'center',
    marginTop: 1,
  },
});
