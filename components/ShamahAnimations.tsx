import React from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
} from 'react-native-reanimated';
import { ShamahTheme } from '../constants/theme';

interface AnimationConfig {
  duration?: number;
  delay?: number;
  damping?: number;
  stiffness?: number;
  mass?: number;
}

export const useScreenEnterAnimation = (config?: AnimationConfig) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const scale = useSharedValue(0.9);

  React.useEffect(() => {
    const duration = config?.duration || ShamahTheme.animation.duration.normal;
    const delay = config?.delay || 0;

    opacity.value = withDelay(delay, withTiming(1, { duration }));
    translateY.value = withDelay(delay, withSpring(0, {
      damping: config?.damping || 15,
      stiffness: config?.stiffness || 150,
      mass: config?.mass || 1,
    }));
    scale.value = withDelay(delay, withSpring(1, {
      damping: config?.damping || 15,
      stiffness: config?.stiffness || 150,
      mass: config?.mass || 1,
    }));
  }, [config?.damping, config?.delay, config?.duration, config?.mass, config?.stiffness, opacity, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return { animatedStyle, opacity, translateY, scale };
};

export const useStaggeredAnimation = (index: number, total: number) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const scale = useSharedValue(0.95);

  React.useEffect(() => {
    const delay = (index * 100);
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(delay, withSpring(0, {
      damping: 12,
      stiffness: 120,
    }));
    scale.value = withDelay(delay, withSpring(1, {
      damping: 12,
      stiffness: 120,
    }));
  }, [index, opacity, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return animatedStyle;
};
// ...existing code...

export const usePressAnimation = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 400 });
    opacity.value = withTiming(0.8, { duration: 100 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 400 });
    opacity.value = withTiming(1, { duration: 100 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return { animatedStyle, onPressIn, onPressOut };
};

export const useLoadingAnimation = () => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000 }),
      -1,
      false
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return animatedStyle;
};

export const usePulseAnimation = (scale: number = 1.05) => {
  const pulseScale = useSharedValue(1);

  React.useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(scale, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      false
    );
  }, [pulseScale, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return animatedStyle;
};

interface AnimatedScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  delay?: number;
}

export const AnimatedScreen: React.FC<AnimatedScreenProps> = ({ 
  children, 
  style, 
  delay = 0 
}) => {
  const { animatedStyle } = useScreenEnterAnimation({ delay });

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

interface AnimatedCardProps {
  children: React.ReactNode;
  index: number;
  style?: ViewStyle;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  index, 
  style 
}) => {
  const animatedStyle = useStaggeredAnimation(index, 0);

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

interface AnimatedButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  onPress, 
  style,
  disabled = false 
}) => {
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();

  return (
    <Animated.View style={[animatedStyle, style]}>
      {React.cloneElement(children as React.ReactElement<any>, {
        onPressIn: !disabled ? onPressIn : undefined,
        onPressOut: !disabled ? onPressOut : undefined,
        onPress: !disabled ? onPress : undefined,
      })}
    </Animated.View>
  );
};

export const useRotatingGradient = () => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withSequence(
      withTiming(360, { duration: 8000 }),
      withTiming(0, { duration: 0 })
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return animatedStyle;
};

export const useShakeAnimation = () => {
  const translateX = useSharedValue(0);

  const shake = () => {
    translateX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return { animatedStyle, shake };
};

export const useFloatAnimation = (amplitude: number = 10, duration: number = 2000) => {
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-amplitude, { duration: duration }),
        withTiming(amplitude, { duration: duration })
      ),
      -1,
      true
    );
  }, [translateY, amplitude, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return animatedStyle;
};

export const useRotateAnimation = (duration: number = 3000) => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration }),
      -1,
      false
    );
  }, [rotation, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return animatedStyle;
};

export const useSwayAnimation = (amplitude: number = 15, duration: number = 2500) => {
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(-amplitude, { duration }),
        withTiming(amplitude, { duration })
      ),
      -1,
      true
    );
  }, [translateX, amplitude, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return animatedStyle;
};

interface FloatingElementProps {
  children: React.ReactNode;
  style?: ViewStyle;
  amplitude?: number;
  duration?: number;
  type?: 'float' | 'rotate' | 'sway' | 'pulse';
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  style,
  amplitude = 10,
  duration = 2000,
  type = 'float'
}) => {
  let animatedStyle;

  switch (type) {
    case 'float':
      animatedStyle = useFloatAnimation(amplitude, duration);
      break;
    case 'rotate':
      animatedStyle = useRotateAnimation(duration);
      break;
    case 'sway':
      animatedStyle = useSwayAnimation(amplitude, duration);
      break;
    case 'pulse':
      animatedStyle = usePulseAnimation(1 + amplitude / 100);
      break;
    default:
      animatedStyle = useFloatAnimation(amplitude, duration);
  }

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};
// ...existing code...


