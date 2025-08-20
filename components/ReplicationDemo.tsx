import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

interface ReplicationDemoProps {
  onPress?: () => void;
}

export const ReplicationDemo: React.FC<ReplicationDemoProps> = ({ onPress }) => {
  const [pulseAnim] = useState(new Animated.Value(1));
  const [progressAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0));

  const platforms = [
    { name: 'TikTok', icon: '🎵', color: '#ff0050' },
    { name: 'Reels', icon: '📷', color: '#E4405F' },
    { name: 'Shorts', icon: '🎬', color: '#FF0000' },
    { name: 'Kwai', icon: '🌟', color: '#FF6B35' },
  ];

  useEffect(() => {
    const animationSequence = () => {
      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Progress animation
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start();

      // Scale animation for platforms
      Animated.stagger(200, 
        platforms.map((_, index) => 
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            delay: index * 300,
          })
        )
      ).start();
    };

    animationSequence();
    const interval = setInterval(animationSequence, 5000);
    return () => clearInterval(interval);
  }, [platforms, progressAnim, pulseAnim, scaleAnim]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <LinearGradient
        colors={['#6366f1', '#8b5cf6', '#06b6d4']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="videocam" size={24} color="white" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Replicação Inteligente</Text>
            <Text style={styles.subtitle}>Um vídeo → Múltiplas plataformas</Text>
          </View>
        </View>

        {/* Demo Visual */}
        <View style={styles.demoContainer}>
          {/* Original Video */}
          <View style={styles.originalVideo}>
            <Animated.View style={[styles.videoIcon, { transform: [{ scale: pulseAnim }] }]}>
              <Ionicons name="play-circle" size={48} color="white" />
            </Animated.View>
            <Text style={styles.originalText}>Seu Vídeo</Text>
          </View>

          {/* Arrow */}
          <View style={styles.arrowContainer}>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </View>

          {/* Platforms */}
          <View style={styles.platformsContainer}>
            {platforms.map((platform, index) => (
              <Animated.View
                key={platform.name}
                style={[
                  styles.platformItem,
                  {
                    transform: [{ scale: scaleAnim }],
                    opacity: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1],
                    }),
                  },
                ]}
              >
                <View style={[styles.platformIcon, { backgroundColor: platform.color }]}>
                  <Text style={styles.platformEmoji}>{platform.icon}</Text>
                </View>
                <Text style={styles.platformName}>{platform.name}</Text>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>Adaptação automática em progresso...</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
            <Text style={styles.featureText}>Resolução otimizada</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
            <Text style={styles.featureText}>Duração ajustada</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
            <Text style={styles.featureText}>Legendas automáticas</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.actionButton} onPress={onPress}>
          <Text style={styles.actionButtonText}>🚀 Experimente Agora</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  demoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  originalVideo: {
    alignItems: 'center',
    flex: 1,
  },
  videoIcon: {
    marginBottom: 8,
  },
  originalText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  arrowContainer: {
    marginHorizontal: 16,
  },
  platformsContainer: {
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  platformItem: {
    alignItems: 'center',
    marginBottom: 8,
    width: '45%',
  },
  platformIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  platformEmoji: {
    fontSize: 16,
  },
  platformName: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 10,
    color: 'white',
    marginLeft: 4,
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
});
