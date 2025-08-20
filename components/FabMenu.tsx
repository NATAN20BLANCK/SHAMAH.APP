import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ShamahColors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

interface FloatingAction {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}

const FabMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  const actions: FloatingAction[] = [
    {
      icon: 'add-circle-outline',
      label: 'ADICIONAR',
      color: '#10b981',
      onPress: () => {
        toggleMenu();
        router.push('/tabs/replicacao');
      }
    },
    {
      icon: 'videocam-outline',
      label: 'EDITOR',
      color: '#8b5cf6',
      onPress: () => {
        toggleMenu();
        router.push('/tabs/replicacao');
      }
    },
    {
      icon: 'people-outline',
      label: 'AFILIADOS',
      color: '#f59e0b',
      onPress: () => {
        toggleMenu();
        router.push('/tabs/planos');
      }
    },
    {
      icon: 'calendar-outline',
      label: 'AGENDAR',
      color: '#3b82f6',
      onPress: () => {
        toggleMenu();
        router.push('/tabs/explore');
      }
    },
    {
      icon: 'link-outline',
      label: 'CONTAS',
      color: '#ef4444',
      onPress: () => {
        toggleMenu();
        router.push('/tabs/perfil');
      }
    }
  ];

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    setIsOpen(!isOpen);
    
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(rotateValue, {
        toValue,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  };

  const getActionStyle = (index: number) => {
    let finalX, finalY;
    
    switch(index) {
      case 0: // ADICIONAR - Direita
        finalX = 120;
        finalY = 0;
        break;
      case 1: // EDITOR - Topo
        finalX = 0;
        finalY = -120;
        break;
      case 2: // AFILIADOS - Esquerda
        finalX = -120;
        finalY = 0;
        break;
      case 3: // AGENDAR - Diagonal superior direita
        finalX = 85;
        finalY = -85;
        break;
      case 4: // CONTAS - Diagonal superior esquerda
        finalX = -85;
        finalY = -85;
        break;
      default:
        finalX = 0;
        finalY = 0;
    }

    const delay = index * 0.1;

    const translateX = animatedValue.interpolate({
      inputRange: [0, 0.3 + delay, 1],
      outputRange: [0, finalX * 0.3, finalX],
      extrapolate: 'clamp',
    });

    const translateY = animatedValue.interpolate({
      inputRange: [0, 0.3 + delay, 1],
      outputRange: [0, finalY * 0.3, finalY],
      extrapolate: 'clamp',
    });

    const opacity = animatedValue.interpolate({
      inputRange: [0, 0.2 + delay, 0.8 + delay, 1],
      outputRange: [0, 0, 0.8, 1],
      extrapolate: 'clamp',
    });

    const scale = animatedValue.interpolate({
      inputRange: [0, 0.4 + delay, 0.8 + delay, 1],
      outputRange: [0, 0.3, 0.9, 1],
      extrapolate: 'clamp',
    });

    const bounceScale = animatedValue.interpolate({
      inputRange: [0, 0.7, 0.9, 1],
      outputRange: [1, 1, 1.2, 1],
      extrapolate: 'clamp',
    });

    return {
      transform: [
        { translateX },
        { translateY },
        { scale: scale },
        { scaleX: bounceScale },
        { scaleY: bounceScale },
      ],
      opacity,
    };
  };

  const mainButtonRotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      {isOpen && (
        <Animated.View 
          style={[
            styles.backdrop,
            {
              opacity: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.3],
              })
            }
          ]}
        >
          <TouchableOpacity 
            style={StyleSheet.absoluteFillObject}
            onPress={toggleMenu}
            activeOpacity={1}
          />
        </Animated.View>
      )}

      {/* Action Buttons */}
      {actions.map((action, index) => (
        <Animated.View
          key={action.label}
          style={[styles.actionButton, getActionStyle(index)]}
        >
          <TouchableOpacity
            style={styles.actionTouchable}
            onPress={action.onPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[
                action.color,
                action.color + 'cc'
              ]}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name={action.icon} size={26} color="white" />
            </LinearGradient>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}

      {/* Main FAB */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={toggleMenu}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#6366f1', '#8b5cf6', '#06b6d4']}
          style={styles.mainGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View style={{ transform: [{ rotate: mainButtonRotation }] }}>
            <Ionicons name="add" size={40} color="white" />
          </Animated.View>
        </LinearGradient>
        
        <View style={styles.glowOuter} />
        <View style={styles.glowInner} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 80,
    height: 80,
    marginTop: -40,
    marginLeft: -40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: -height,
    left: -width / 2,
    width: width * 2,
    height: height * 2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: -1,
  },
  actionButton: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 999,
  },
  actionTouchable: {
    alignItems: 'center',
  },
  actionGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    lineHeight: 16,
    minWidth: 80,
    paddingHorizontal: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    paddingTop: 4,
    paddingBottom: 2,
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1000,
  },
  mainGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 15,
  },
  glowOuter: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6366f1',
    opacity: 0.2,
    zIndex: -1,
  },
  glowInner: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#8b5cf6',
    opacity: 0.3,
    zIndex: -1,
  },
});

export default FabMenu;
