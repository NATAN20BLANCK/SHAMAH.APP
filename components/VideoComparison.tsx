import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, ShamahColors } from '@/constants/Colors';
// Temporarily commented out for error resolution
// import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import ShamahCard from '@/components/ShamahCard';
import { OriginalVideo, AdaptedVideo } from '@/hooks/useVideoReplication';

interface VideoComparisonProps {
  original: OriginalVideo;
  adapted: AdaptedVideo;
  visible: boolean;
  onClose: () => void;
}

export const VideoComparison: React.FC<VideoComparisonProps> = ({
  original,
  adapted,
  visible,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'details' | 'adaptations' | 'quality'>('comparison');
  const [isOriginalPlaying, setIsOriginalPlaying] = useState(false);
  const [isAdaptedPlaying, setIsAdaptedPlaying] = useState(false);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return '🎵';
      case 'instagram_reels':
        return '📷';
      case 'youtube_shorts':
        return '🎬';
      case 'kwai':
        return '🌟';
      case 'facebook_reels':
        return '👥';
      case 'twitter':
        return '🐦';
      default:
        return '📱';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAdaptationColor = (type: string) => {
    switch (type) {
      case 'resized':
        return ShamahColors.primary;
      case 'trimmed':
        return ShamahColors.secondary;
      case 'captioned':
        return ShamahColors.success;
      case 'watermarked':
        return ShamahColors.warning;
      case 'musicAdded':
        return ShamahColors.accent;
      default:
        return ShamahColors.textSecondary;
    }
  };

  const getAdaptationIcon = (type: string) => {
    switch (type) {
      case 'resized':
        return 'resize';
      case 'trimmed':
        return 'cut';
      case 'captioned':
        return 'text';
      case 'watermarked':
        return 'image';
      case 'musicAdded':
        return 'musical-notes';
      case 'aspectRatioChanged':
        return 'crop';
      default:
        return 'checkmark';
    }
  };

  const renderComparisonView = () => (
    <View style={styles.comparisonContainer}>
      <View style={styles.videoRow}>
        {/* Original Video */}
        <View style={styles.videoContainer}>
          <View style={styles.videoHeader}>
            <Text style={styles.videoLabel}>Original</Text>
            <View style={styles.videoSpecs}>
              <Text style={styles.specText}>
                {original.resolution.width}x{original.resolution.height}
              </Text>
              <Text style={styles.specText}>
                {formatDuration(original.duration)}
              </Text>
            </View>
          </View>
          <View style={styles.videoWrapper}>
            {/* Temporarily commented out for error resolution */}
            {/* <Video
              source={{ uri: original.uri }}
              style={styles.video}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={isOriginalPlaying}
              isLooping
              onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
                if (status.isLoaded) {
                  setIsOriginalPlaying(status.isPlaying || false);
                }
              }}
            /> */}
            <View style={[styles.video, { backgroundColor: Colors.light.card, justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ color: Colors.light.textSecondary }}>Video Preview</Text>
            </View>
          </View>
          <View style={styles.videoInfo}>
            <Text style={styles.infoText}>
              {formatFileSize(original.fileSize)}
            </Text>
            <Text style={styles.infoText}>
              {original.format.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Adapted Video */}
        <View style={styles.videoContainer}>
          <View style={styles.videoHeader}>
            <View style={styles.adaptedLabelContainer}>
              <Text style={styles.adaptedLabel}>
                {getPlatformIcon(adapted.platform)} {adapted.platform.replace('_', ' ').toUpperCase()}
              </Text>
              <View style={styles.optimizationBadge}>
                <Text style={styles.optimizationText}>
                  {Math.round(adapted.optimizationScore)}%
                </Text>
              </View>
            </View>
            <View style={styles.videoSpecs}>
              <Text style={styles.specText}>
                {adapted.resolution.width}x{adapted.resolution.height}
              </Text>
              <Text style={styles.specText}>
                {formatDuration(adapted.duration)}
              </Text>
            </View>
          </View>
          <View style={styles.videoWrapper}>
            {/* Temporarily commented out for error resolution */}
            {/* <Video
              source={{ uri: adapted.uri }}
              style={styles.video}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={isAdaptedPlaying}
              isLooping
              onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
                if (status.isLoaded) {
                  setIsAdaptedPlaying(status.isPlaying || false);
                }
              }}
            /> */}
            <View style={[styles.video, { backgroundColor: Colors.light.card, justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ color: Colors.light.textSecondary }}>Adapted Video Preview</Text>
            </View>
          </View>
          <View style={styles.videoInfo}>
            <Text style={styles.infoText}>
              {formatFileSize(adapted.fileSize)}
            </Text>
            <Text style={styles.infoText}>
              {adapted.format.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Sync Play Button */}
      <TouchableOpacity
        style={styles.syncButton}
        onPress={() => {
          setIsOriginalPlaying(!isOriginalPlaying);
          setIsAdaptedPlaying(!isAdaptedPlaying);
        }}
      >
        <LinearGradient
          colors={[ShamahColors.primary, ShamahColors.secondary]}
          style={styles.syncButtonGradient}
        >
          <Ionicons
            name={isOriginalPlaying ? 'pause' : 'play'}
            size={24}
            color={ShamahColors.white}
          />
          <Text style={styles.syncButtonText}>
            {isOriginalPlaying ? 'Pausar Ambos' : 'Reproduzir Ambos'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderDetailsView = () => (
    <ScrollView style={styles.detailsContainer}>
      <View style={styles.detailsGrid}>
        {/* Original Details */}
        <ShamahCard style={styles.detailCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="videocam" size={20} color={ShamahColors.primary} />
            <Text style={styles.cardTitle}>Vídeo Original</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Resolução:</Text>
            <Text style={styles.detailValue}>
              {original.resolution.width}x{original.resolution.height}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duração:</Text>
            <Text style={styles.detailValue}>
              {formatDuration(original.duration)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tamanho:</Text>
            <Text style={styles.detailValue}>
              {formatFileSize(original.fileSize)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Formato:</Text>
            <Text style={styles.detailValue}>
              {original.format.toUpperCase()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>FPS:</Text>
            <Text style={styles.detailValue}>
              {original.metadata.fps}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bitrate:</Text>
            <Text style={styles.detailValue}>
              {Math.round(original.metadata.bitrate / 1000)} kbps
            </Text>
          </View>
        </ShamahCard>

        {/* Adapted Details */}
        <ShamahCard style={styles.detailCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.platformEmoji}>
              {getPlatformIcon(adapted.platform)}
            </Text>
            <Text style={styles.cardTitle}>
              {adapted.platform.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Resolução:</Text>
            <Text style={[styles.detailValue, 
              original.resolution.width !== adapted.resolution.width && styles.changedValue
            ]}>
              {adapted.resolution.width}x{adapted.resolution.height}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duração:</Text>
            <Text style={[styles.detailValue,
              original.duration !== adapted.duration && styles.changedValue
            ]}>
              {formatDuration(adapted.duration)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tamanho:</Text>
            <Text style={[styles.detailValue,
              original.fileSize !== adapted.fileSize && styles.changedValue
            ]}>
              {formatFileSize(adapted.fileSize)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Formato:</Text>
            <Text style={[styles.detailValue,
              original.format !== adapted.format && styles.changedValue
            ]}>
              {adapted.format.toUpperCase()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Processamento:</Text>
            <Text style={styles.detailValue}>
              {adapted.processingTime}s
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Otimização:</Text>
            <Text style={styles.detailValue}>
              {Math.round(adapted.optimizationScore)}%
            </Text>
          </View>
        </ShamahCard>
      </View>

      {/* Comparison Summary */}
      <ShamahCard style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <Ionicons name="analytics" size={20} color={ShamahColors.primary} />
          <Text style={styles.cardTitle}>Resumo da Comparação</Text>
        </View>
        
        <View style={styles.comparisonMetrics}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Redução de Tamanho</Text>
            <Text style={[styles.metricValue, 
              adapted.fileSize < original.fileSize ? styles.positiveMetric : styles.negativeMetric
            ]}>
              {adapted.fileSize < original.fileSize ? '-' : '+'}
              {Math.abs(((adapted.fileSize - original.fileSize) / original.fileSize) * 100).toFixed(1)}%
            </Text>
          </View>
          
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Mudança de Duração</Text>
            <Text style={[styles.metricValue,
              adapted.duration < original.duration ? styles.positiveMetric : styles.neutralMetric
            ]}>
              {adapted.duration < original.duration ? '-' : adapted.duration > original.duration ? '+' : ''}
              {Math.abs(adapted.duration - original.duration).toFixed(1)}s
            </Text>
          </View>
          
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Tempo de Processamento</Text>
            <Text style={styles.metricValue}>
              {adapted.processingTime}s
            </Text>
          </View>
          
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Score de Otimização</Text>
            <Text style={[styles.metricValue, styles.positiveMetric]}>
              {Math.round(adapted.optimizationScore)}%
            </Text>
          </View>
        </View>
      </ShamahCard>
    </ScrollView>
  );

  const renderAdaptationsView = () => (
    <ScrollView style={styles.adaptationsContainer}>
      <View style={styles.adaptationsList}>
        {Object.entries(adapted.adaptations).map(([key, applied]) => (
          <View key={key} style={styles.adaptationItem}>
            <View style={styles.adaptationIcon}>
              <Ionicons
                name={getAdaptationIcon(key)}
                size={20}
                color={applied ? getAdaptationColor(key) : ShamahColors.textSecondary}
              />
            </View>
            <View style={styles.adaptationContent}>
              <Text style={[styles.adaptationTitle, 
                applied && styles.adaptationTitleApplied
              ]}>
                {key === 'resized' && 'Redimensionado'}
                {key === 'trimmed' && 'Cortado'}
                {key === 'captioned' && 'Legendado'}
                {key === 'watermarked' && 'Marca d\'água'}
                {key === 'musicAdded' && 'Música Adicionada'}
                {key === 'aspectRatioChanged' && 'Proporção Alterada'}
              </Text>
              <Text style={styles.adaptationDescription}>
                {applied ? 'Aplicado com sucesso' : 'Não aplicado'}
              </Text>
            </View>
            <View style={styles.adaptationStatus}>
              <Ionicons
                name={applied ? 'checkmark-circle' : 'close-circle'}
                size={24}
                color={applied ? ShamahColors.success : ShamahColors.textSecondary}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Quality Metrics */}
      <ShamahCard style={styles.qualityCard}>
        <View style={styles.cardHeader}>
          <Ionicons name="ribbon" size={20} color={ShamahColors.primary} />
          <Text style={styles.cardTitle}>Métricas de Qualidade</Text>
        </View>
        
        <View style={styles.qualityMetrics}>
          <View style={styles.qualityMetric}>
            <Text style={styles.qualityLabel}>Qualidade de Saída</Text>
            <View style={styles.qualityBar}>
              <View style={styles.qualityBarBackground}>
                <View style={[styles.qualityBarFill, { width: `${adapted.outputQuality}%` }]} />
              </View>
              <Text style={styles.qualityPercentage}>{adapted.outputQuality}%</Text>
            </View>
          </View>
          
          <View style={styles.qualityMetric}>
            <Text style={styles.qualityLabel}>Score de Otimização</Text>
            <View style={styles.qualityBar}>
              <View style={styles.qualityBarBackground}>
                <View style={[styles.qualityBarFill, { width: `${adapted.optimizationScore}%` }]} />
              </View>
              <Text style={styles.qualityPercentage}>{Math.round(adapted.optimizationScore)}%</Text>
            </View>
          </View>
        </View>
      </ShamahCard>
    </ScrollView>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={ShamahColors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.title}>Comparação de Vídeos</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'comparison' && styles.activeTab]}
            onPress={() => setActiveTab('comparison')}
          >
            <Text style={[styles.tabText, activeTab === 'comparison' && styles.activeTabText]}>
              Comparação
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'details' && styles.activeTab]}
            onPress={() => setActiveTab('details')}
          >
            <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>
              Detalhes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'adaptations' && styles.activeTab]}
            onPress={() => setActiveTab('adaptations')}
          >
            <Text style={[styles.tabText, activeTab === 'adaptations' && styles.activeTabText]}>
              Adaptações
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'comparison' && renderComparisonView()}
          {activeTab === 'details' && renderDetailsView()}
          {activeTab === 'adaptations' && renderAdaptationsView()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  headerSpacer: {
    width: 32,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.card,
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: ShamahColors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  activeTabText: {
    color: ShamahColors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  comparisonContainer: {
    flex: 1,
  },
  videoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    overflow: 'hidden',
  },
  videoHeader: {
    padding: 16,
    backgroundColor: Colors.light.card,
  },
  videoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  adaptedLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  adaptedLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  optimizationBadge: {
    backgroundColor: ShamahColors.success,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  optimizationText: {
    fontSize: 12,
    fontWeight: '600',
    color: ShamahColors.white,
  },
  videoSpecs: {
    flexDirection: 'row',
    gap: 16,
  },
  specText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  videoWrapper: {
    height: 200,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoInfo: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  syncButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
  },
  syncButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  syncButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: ShamahColors.white,
    marginLeft: 8,
  },
  detailsContainer: {
    flex: 1,
  },
  detailsGrid: {
    gap: 16,
    marginBottom: 20,
  },
  detailCard: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginLeft: 8,
  },
  platformEmoji: {
    fontSize: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  changedValue: {
    color: ShamahColors.primary,
    fontWeight: '600',
  },
  summaryCard: {
    padding: 16,
  },
  comparisonMetrics: {
    gap: 16,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  positiveMetric: {
    color: ShamahColors.success,
  },
  negativeMetric: {
    color: ShamahColors.error,
  },
  neutralMetric: {
    color: Colors.light.textSecondary,
  },
  adaptationsContainer: {
    flex: 1,
  },
  adaptationsList: {
    gap: 16,
    marginBottom: 20,
  },
  adaptationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
  },
  adaptationIcon: {
    marginRight: 12,
  },
  adaptationContent: {
    flex: 1,
  },
  adaptationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  adaptationTitleApplied: {
    color: Colors.light.text,
    fontWeight: '600',
  },
  adaptationDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  adaptationStatus: {
    marginLeft: 12,
  },
  qualityCard: {
    padding: 16,
  },
  qualityMetrics: {
    gap: 16,
  },
  qualityMetric: {
    gap: 8,
  },
  qualityLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  qualityBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qualityBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.light.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  qualityBarFill: {
    height: '100%',
    backgroundColor: ShamahColors.primary,
    borderRadius: 3,
  },
  qualityPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    minWidth: 40,
  },
});
