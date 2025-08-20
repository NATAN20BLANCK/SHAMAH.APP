import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import ShamahPageTransition, { useShamahPageTransition } from '../../components/ShamahPageTransition';
import { ShamahColors } from '../../constants/theme';

/**
 * Layout personalizado com transições animadas entre telas
 * Este é um exemplo de como implementar navegação com animações
 */
export default function AnimatedTabLayout() {
  const { isVisible, direction, show, hide } = useShamahPageTransition();

  return (
    <View style={{ flex: 1, backgroundColor: ShamahColors.neutral[50] }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none', // Desabilitar animação padrão
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        <Stack.Screen 
          name="inicio" 
          options={{
            title: 'Início',
          }}
        />
        <Stack.Screen 
          name="contas" 
          options={{
            title: 'Contas',
          }}
        />
        <Stack.Screen 
          name="agendados" 
          options={{
            title: 'Agendados',
          }}
        />
        <Stack.Screen 
          name="planos" 
          options={{
            title: 'Planos',
          }}
        />
        <Stack.Screen 
          name="perfil" 
          options={{
            title: 'Perfil',
          }}
        />
      </Stack>
    </View>
  );
}

// Hook para controlar transições de navegação
export function useAnimatedNavigation() {
  const [currentScreen, setCurrentScreen] = React.useState('inicio');
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const navigateWithAnimation = async (
    targetScreen: string, 
    direction: 'slide-right' | 'slide-left' | 'slide-up' | 'slide-down' | 'fade' = 'slide-right'
  ) => {
    setIsTransitioning(true);
    
    // Simular transição (integrar com expo-router)
    setTimeout(() => {
      setCurrentScreen(targetScreen);
      setIsTransitioning(false);
    }, 300);
  };

  return {
    currentScreen,
    isTransitioning,
    navigateWithAnimation,
  };
}

// Exemplo de uso em componente
export function ExampleScreenWithTransition() {
  const { navigateWithAnimation } = useAnimatedNavigation();

  return (
    <ShamahPageTransition 
      isVisible={true}
      direction="slide-right"
      duration={300}
    >
      {/* Conteúdo da tela aqui */}
    </ShamahPageTransition>
  );
}
