import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  Platform,
  Animated,
  Easing,
  FlatList,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ShamahColors, ShamahGradients } from '../constants/Colors';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Interface para especificações de plataforma
interface PlatformSpecs {
  id: string;
  name: string;
  icon: string;
  color: string;
  resolution: { width: number; height: number };
  maxDuration: number;
  maxFileSize: number;
  aspectRatio: string;
  description: string;
}

// Interface para trabalho de replicação
interface ReplicationJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  targetPlatforms: string[];
  originalVideo: any;
  results: any[];
  createdAt: Date;
  updatedAt: Date;
}

// Mock data para plataformas
const PLATFORMS: PlatformSpecs[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'logo-instagram',
    color: '#E4405F',
    resolution: { width: 1080, height: 1920 },
    maxDuration: 90,
    maxFileSize: 100,
    aspectRatio: '9:16',
    description: 'Stories e Reels'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'musical-notes',
    color: '#000000',
    resolution: { width: 1080, height: 1920 },
    maxDuration: 180,
    maxFileSize: 150,
    aspectRatio: '9:16',
    description: 'Vídeos curtos'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'logo-youtube',
    color: '#FF0000',
    resolution: { width: 1920, height: 1080 },
    maxDuration: 3600,
    maxFileSize: 2000,
    aspectRatio: '16:9',
    description: 'Shorts e vídeos'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'logo-facebook',
    color: '#1877F2',
    resolution: { width: 1080, height: 1080 },
    maxDuration: 240,
    maxFileSize: 200,
    aspectRatio: '1:1',
    description: 'Posts e Stories'
  }
];

// Mock data para vídeos
const MOCK_VIDEOS = [
  {
    id: '1',
    title: 'Apresentação Produto A',
    duration: 45,
    size: 25.5,
    format: 'MP4',
    resolution: '1920x1080'
  },
  {
    id: '2',
    title: 'Tutorial Passo a Passo',
    duration: 120,
    size: 87.2,
    format: 'MP4',
    resolution: '1280x720'
  },
  {
    id: '3',
    title: 'Depoimento Cliente',
    duration: 30,
    size: 18.7,
    format: 'MP4',
    resolution: '1080x1920'
  }
];

export default function VideoReplicationScreen() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [replicationJob, setReplicationJob] = useState<ReplicationJob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Animações
  const progressAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  // Função para alternar seleção de plataforma
  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  // Função para iniciar replicação
  const startReplication = async () => {
    if (!selectedVideo || selectedPlatforms.length === 0) {
      Alert.alert('Erro', 'Selecione um vídeo e pelo menos uma plataforma');
      return;
    }

    setIsProcessing(true);
    
    const job: ReplicationJob = {
      id: Date.now().toString(),
      status: 'processing',
      progress: 0,
      targetPlatforms: selectedPlatforms,
      originalVideo: selectedVideo,
      results: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setReplicationJob(job);

    // Simular processo de replicação
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      Animated.timing(progressAnim, {
        toValue: i / 100,
        duration: 200,
        useNativeDriver: false,
      }).start();

      setReplicationJob(prev => prev ? { ...prev, progress: i } : null);
    }

    // Finalizar processo
    setReplicationJob(prev => prev ? { 
      ...prev, 
      status: 'completed',
      results: selectedPlatforms.map(platformId => ({
        platform: platformId,
        success: true,
        url: `https://exemplo.com/video-${platformId}`,
        optimizations: ['Resolução ajustada', 'Duração otimizada', 'Qualidade melhorada']
      }))
    } : null);

    setIsProcessing(false);
    setShowResults(true);
  };

  // Renderizar card de plataforma
  const renderPlatformCard = ({ item }: { item: PlatformSpecs }) => {
    const isSelected = selectedPlatforms.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[styles.platformCard, isSelected && styles.platformCardSelected]}
        onPress={() => togglePlatform(item.id)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={isSelected ? [item.color, `${item.color}80`] : [ShamahColors.backgroundSecondary, ShamahColors.backgroundSecondary]}
          style={styles.platformGradient}
        >
          <View style={styles.platformIcon}>
            <Ionicons 
              name={item.icon as any} 
              size={32} 
              color={isSelected ? ShamahColors.white : item.color} 
            />
          </View>
          
          <Text style={[styles.platformName, isSelected && styles.platformNameSelected]}>
            {item.name}
          </Text>
          
          <Text style={[styles.platformDescription, isSelected && styles.platformDescriptionSelected]}>
            {item.description}
          </Text>
          
          <View style={styles.platformSpecs}>
            <Text style={[styles.platformSpec, isSelected && styles.platformSpecSelected]}>
              {item.aspectRatio}
            </Text>
            <Text style={[styles.platformSpec, isSelected && styles.platformSpecSelected]}>
              {item.maxDuration}s
            </Text>
          </View>
          
          {isSelected && (
            <View style={styles.selectedBadge}>
              <Ionicons name="checkmark" size={16} color={ShamahColors.white} />
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // Renderizar modal de seleção de vídeo
  const renderVideoModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showVideoModal}
      onRequestClose={() => setShowVideoModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecionar Vídeo</Text>
            <TouchableOpacity onPress={() => setShowVideoModal(false)}>
              <Ionicons name="close" size={24} color={ShamahColors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            {MOCK_VIDEOS.map(video => (
              <TouchableOpacity
                key={video.id}
                style={[styles.videoItem, selectedVideo?.id === video.id && styles.videoItemSelected]}
                onPress={() => {
                  setSelectedVideo(video);
                  setShowVideoModal(false);
                }}
              >
                <View style={styles.videoThumbnail}>
                  <MaterialIcons name="play-circle-filled" size={40} color={ShamahColors.primary} />
                </View>
                
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle}>{video.title}</Text>
                  <Text style={styles.videoDetails}>
                    {video.duration}s • {video.size}MB • {video.resolution}
                  </Text>
                </View>
                
                {selectedVideo?.id === video.id && (
                  <Ionicons name="checkmark-circle" size={24} color={ShamahColors.success} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={styles.modalFooter}>          <TouchableOpacity style={styles.uploadButton}>
            <LinearGradient
              colors={ShamahGradients.primary as any}
              style={styles.uploadButtonGradient}
            >
              <Ionicons name="cloud-upload" size={20} color={ShamahColors.white} />
              <Text style={styles.uploadButtonText}>Fazer Upload</Text>
            </LinearGradient>
          </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Renderizar resultados
  const renderResults = () => {
    if (!replicationJob || !showResults) return null;

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>✨ Replicação Concluída!</Text>
        
        <View style={styles.resultsGrid}>
          {replicationJob.results.map((result, index) => {
            const platform = PLATFORMS.find(p => p.id === result.platform);
            
            return (
              <View key={index} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Ionicons name={platform?.icon as any} size={24} color={platform?.color} />
                  <Text style={styles.resultPlatform}>{platform?.name}</Text>
                  <Ionicons name="checkmark-circle" size={20} color={ShamahColors.success} />
                </View>
                
                <View style={styles.resultOptimizations}>
                  {result.optimizations.map((opt: string, idx: number) => (
                    <Text key={idx} style={styles.resultOptimization}>• {opt}</Text>
                  ))}
                </View>
                
                <TouchableOpacity style={styles.resultButton}>
                  <Text style={styles.resultButtonText}>Ver Resultado</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ShamahColors.primary} />
      
      <LinearGradient
        colors={ShamahGradients.primary as any}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={ShamahColors.white} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Replicação Inteligente</Text>
        
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => {/* Implementar configurações */}}
        >
          <Ionicons name="settings" size={24} color={ShamahColors.white} />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[
          styles.section,
          {
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            }],
            opacity: slideAnim,
          }
        ]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>1. Selecione o Vídeo</Text>
            <Text style={styles.sectionDescription}>
              Escolha o vídeo que deseja replicar para múltiplas plataformas
            </Text>
          </View>

          <TouchableOpacity
            style={styles.videoSelector}
            onPress={() => setShowVideoModal(true)}
          >
            <LinearGradient
              colors={selectedVideo ? ShamahGradients.success as any : ShamahGradients.cosmic as any}
              style={styles.videoSelectorGradient}
            >
              <View style={styles.videoSelectorContent}>
                <MaterialIcons 
                  name={selectedVideo ? "video-library" : "video-call"} 
                  size={40} 
                  color={ShamahColors.white} 
                />
                <Text style={styles.videoSelectorText}>
                  {selectedVideo ? selectedVideo.title : 'Selecionar Vídeo'}
                </Text>
                {selectedVideo && (
                  <Text style={styles.videoSelectorDetails}>
                    {selectedVideo.duration}s • {selectedVideo.size}MB
                  </Text>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[
          styles.section,
          {
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              }),
            }],
            opacity: slideAnim,
          }
        ]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>2. Escolha as Plataformas</Text>
            <Text style={styles.sectionDescription}>
              Selecione onde você quer publicar seu conteúdo
            </Text>
          </View>

          <FlatList
            data={PLATFORMS}
            renderItem={renderPlatformCard}
            numColumns={2}
            keyExtractor={item => item.id}
            columnWrapperStyle={styles.platformRow}
            scrollEnabled={false}
          />
        </Animated.View>

        {selectedVideo && selectedPlatforms.length > 0 && (
          <Animated.View style={[
            styles.section,
            {
              transform: [{
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [150, 0],
                }),
              }],
              opacity: slideAnim,
            }
          ]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>3. Iniciar Replicação</Text>
              <Text style={styles.sectionDescription}>
                Sua IA analisará e otimizará o vídeo para cada plataforma
              </Text>
            </View>

            <TouchableOpacity
              style={styles.startButton}
              onPress={startReplication}
              disabled={isProcessing}
            >
              <LinearGradient
                colors={isProcessing ? [ShamahColors.neutral[400], ShamahColors.neutral[500]] as any : ShamahGradients.primary as any}
                style={styles.startButtonGradient}
              >
                {isProcessing ? (
                  <View style={styles.processingContent}>
                    <MaterialIcons name="auto-fix-high" size={24} color={ShamahColors.white} />
                    <Text style={styles.startButtonText}>Processando...</Text>
                  </View>
                ) : (
                  <View style={styles.startButtonContent}>
                    <MaterialIcons name="smart-toy" size={24} color={ShamahColors.white} />
                    <Text style={styles.startButtonText}>Iniciar com IA</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {replicationJob && isProcessing && (
          <Animated.View style={styles.progressContainer}>
            <Text style={styles.progressTitle}>Processando com IA...</Text>
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
            <Text style={styles.progressText}>{replicationJob.progress}%</Text>
          </Animated.View>
        )}

        {renderResults()}
      </ScrollView>

      {renderVideoModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ShamahColors.backgroundPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: ShamahColors.white,
    textAlign: 'center',
    marginLeft: -40,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ShamahColors.textPrimary,
    marginBottom: 5,
  },
  sectionDescription: {
    fontSize: 14,
    color: ShamahColors.textSecondary,
    lineHeight: 20,
  },
  videoSelector: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: ShamahColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  videoSelectorGradient: {
    padding: 24,
  },
  videoSelectorContent: {
    alignItems: 'center',
  },
  videoSelectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: ShamahColors.white,
    marginTop: 12,
  },
  videoSelectorDetails: {
    fontSize: 12,
    color: ShamahColors.white,
    opacity: 0.8,
    marginTop: 4,
  },
  platformRow: {
    justifyContent: 'space-between',
  },
  platformCard: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: ShamahColors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  platformCardSelected: {
    elevation: 8,
    shadowOpacity: 0.3,
  },
  platformGradient: {
    padding: 16,
    minHeight: 140,
    position: 'relative',
  },
  platformIcon: {
    alignItems: 'center',
    marginBottom: 8,
  },
  platformName: {
    fontSize: 14,
    fontWeight: '600',
    color: ShamahColors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  platformNameSelected: {
    color: ShamahColors.white,
  },
  platformDescription: {
    fontSize: 11,
    color: ShamahColors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  platformDescriptionSelected: {
    color: ShamahColors.white,
    opacity: 0.9,
  },
  platformSpecs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  platformSpec: {
    fontSize: 10,
    color: ShamahColors.textSecondary,
    fontWeight: '500',
  },
  platformSpecSelected: {
    color: ShamahColors.white,
    opacity: 0.8,
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ShamahColors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: ShamahColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startButtonGradient: {
    padding: 18,
  },
  startButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ShamahColors.white,
    marginLeft: 8,
  },
  progressContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: ShamahColors.backgroundSecondary,
    borderRadius: 16,
    elevation: 3,
    shadowColor: ShamahColors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ShamahColors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: ShamahColors.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: ShamahColors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: ShamahColors.textSecondary,
    textAlign: 'center',
  },
  resultsContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: ShamahColors.backgroundSecondary,
    borderRadius: 16,
    elevation: 3,
    shadowColor: ShamahColors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ShamahColors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  resultCard: {
    width: '48%',
    backgroundColor: ShamahColors.backgroundPrimary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: ShamahColors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultPlatform: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: ShamahColors.textPrimary,
    marginLeft: 8,
  },
  resultOptimizations: {
    marginBottom: 12,
  },
  resultOptimization: {
    fontSize: 12,
    color: ShamahColors.textSecondary,
    marginBottom: 2,
  },
  resultButton: {
    backgroundColor: ShamahColors.primary,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  resultButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: ShamahColors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: ShamahColors.overlay.heavy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: ShamahColors.backgroundSecondary,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: ShamahColors.borderLight,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ShamahColors.textPrimary,
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: ShamahColors.borderLight,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: ShamahColors.backgroundPrimary,
  },
  videoItemSelected: {
    backgroundColor: ShamahColors.primary + '20',
    borderWidth: 2,
    borderColor: ShamahColors.primary,
  },
  videoThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: ShamahColors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: ShamahColors.textPrimary,
    marginBottom: 4,
  },
  videoDetails: {
    fontSize: 12,
    color: ShamahColors.textSecondary,
  },
  uploadButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  uploadButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: ShamahColors.white,
    marginLeft: 8,
  },
});
