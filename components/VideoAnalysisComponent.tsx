import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { ShamahCard } from './ShamahCard';
import { ShamahButton } from './ShamahButton';
import { ShamahMiniLoading } from './ShamahMiniLoadings';
import { useVideoReplication } from '../hooks/useVideoReplication';
import { VideoAnalysis, PlatformRecommendation } from '../services/AIAnalysisService';

interface VideoAnalysisComponentProps {
  videoUri: string;
  visible: boolean;
  onClose: () => void;
  onPlatformSelect: (platforms: string[]) => void;
}

export const VideoAnalysisComponent: React.FC<VideoAnalysisComponentProps> = ({
  videoUri,
  visible,
  onClose,
  onPlatformSelect,
}) => {
  const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<PlatformRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'analysis' | 'platforms' | 'trends'>('analysis');
  const [trends, setTrends] = useState<any>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const { 
    analyzeVideoWithAI, 
    getPlatformRecommendations, 
    analyzeTrends
  } = useVideoReplication();

  const analyzeVideo = useCallback(async () => {
    setLoading(true);
    try {
      const [videoAnalysis, platformRecs, trendsData] = await Promise.all([
        analyzeVideoWithAI(videoUri),
        getPlatformRecommendations(videoUri),
        analyzeTrends('general'),
      ]);

      setAnalysis(videoAnalysis);
      setRecommendations(platformRecs);
      setTrends(trendsData);
    } catch (err) {
      console.error('Erro ao analisar vídeo:', err);
      Alert.alert('Erro', 'Não foi possível analisar o vídeo');
    } finally {
      setLoading(false);
    }
  }, [videoUri, analyzeVideoWithAI, getPlatformRecommendations, analyzeTrends]);

  useEffect(() => {
    if (visible && videoUri) {
      analyzeVideo();
    }
  }, [visible, videoUri, analyzeVideo]);

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleConfirmSelection = () => {
    onPlatformSelect(selectedPlatforms);
    onClose();
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return Colors.success;
    if (score >= 0.6) return Colors.warning;
    return Colors.error;
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'ultra': return 'star';
      case 'high': return 'star-half';
      case 'medium': return 'star-outline';
      default: return 'remove';
    }
  };

  const renderAnalysisTab = () => {
    if (!analysis) return null;

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {/* Análise de Conteúdo */}
        <ShamahCard variant="glass" style={styles.analysisCard}>
          <Text style={styles.sectionTitle}>📊 Análise de Conteúdo</Text>
          <View style={styles.contentAnalysis}>
            <View style={styles.analysisRow}>
              <Text style={styles.analysisLabel}>Tipo:</Text>
              <Text style={styles.analysisValue}>{analysis.content.type}</Text>
            </View>
            <View style={styles.analysisRow}>
              <Text style={styles.analysisLabel}>Confiança:</Text>
              <Text style={[styles.analysisValue, { color: getScoreColor(analysis.content.confidence) }]}>
                {Math.round(analysis.content.confidence * 100)}%
              </Text>
            </View>
            <View style={styles.analysisRow}>
              <Text style={styles.analysisLabel}>Descrição:</Text>
              <Text style={styles.analysisDescription}>{analysis.content.description}</Text>
            </View>
          </View>
          
          <View style={styles.tagsContainer}>
            {analysis.content.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </ShamahCard>

        {/* Qualidade Técnica */}
        <ShamahCard variant="glass" style={styles.analysisCard}>
          <Text style={styles.sectionTitle}>🎥 Qualidade Técnica</Text>
          <View style={styles.technicalGrid}>
            <View style={styles.technicalItem}>
              <Ionicons 
                name={getQualityIcon(analysis.technical.quality)} 
                size={24} 
                color={Colors.primary} 
              />
              <Text style={styles.technicalLabel}>Qualidade</Text>
              <Text style={styles.technicalValue}>{analysis.technical.quality}</Text>
            </View>
            <View style={styles.technicalItem}>
              <MaterialIcons name="stability" size={24} color={Colors.primary} />
              <Text style={styles.technicalLabel}>Estabilidade</Text>
              <Text style={styles.technicalValue}>{Math.round(analysis.technical.stability * 100)}%</Text>
            </View>
            <View style={styles.technicalItem}>
              <Ionicons name="sunny" size={24} color={Colors.primary} />
              <Text style={styles.technicalLabel}>Iluminação</Text>
              <Text style={styles.technicalValue}>{analysis.technical.lighting}</Text>
            </View>
            <View style={styles.technicalItem}>
              <Ionicons name="volume-high" size={24} color={Colors.primary} />
              <Text style={styles.technicalLabel}>Áudio</Text>
              <Text style={styles.technicalValue}>{analysis.technical.audio}</Text>
            </View>
          </View>
        </ShamahCard>

        {/* Potencial de Engajamento */}
        <ShamahCard variant="glass" style={styles.analysisCard}>
          <Text style={styles.sectionTitle}>🔥 Potencial de Engajamento</Text>
          <View style={styles.engagementMetrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Hook</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${analysis.engagement.hookStrength * 100}%`,
                      backgroundColor: getScoreColor(analysis.engagement.hookStrength)
                    }
                  ]} 
                />
              </View>
              <Text style={styles.metricValue}>{Math.round(analysis.engagement.hookStrength * 100)}%</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Apelo Visual</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${analysis.engagement.visualAppeal * 100}%`,
                      backgroundColor: getScoreColor(analysis.engagement.visualAppeal)
                    }
                  ]} 
                />
              </View>
              <Text style={styles.metricValue}>{Math.round(analysis.engagement.visualAppeal * 100)}%</Text>
            </View>
            <View style={styles.analysisRow}>
              <Text style={styles.analysisLabel}>Ritmo:</Text>
              <Text style={styles.analysisValue}>{analysis.engagement.pacing}</Text>
            </View>
            <View style={styles.analysisRow}>
              <Text style={styles.analysisLabel}>Tendência:</Text>
              <Text style={[
                styles.analysisValue,
                { color: analysis.engagement.trend === 'rising' ? Colors.success : Colors.warning }
              ]}>
                {analysis.engagement.trend}
              </Text>
            </View>
          </View>
        </ShamahCard>

        {/* Recomendações */}
        <ShamahCard variant="glass" style={styles.analysisCard}>
          <Text style={styles.sectionTitle}>💡 Recomendações</Text>
          <View style={styles.recommendations}>
            {analysis.recommendations.improvements.map((improvement, index) => (
              <View key={index} style={styles.recommendationItem}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                <Text style={styles.recommendationText}>{improvement}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.hashtagsContainer}>
            <Text style={styles.hashtagsTitle}>Hashtags Recomendadas:</Text>
            <View style={styles.hashtagsGrid}>
              {analysis.recommendations.hashtags.map((hashtag, index) => (
                <TouchableOpacity key={index} style={styles.hashtag}>
                  <Text style={styles.hashtagText}>{hashtag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ShamahCard>
      </ScrollView>
    );
  };

  const renderPlatformsTab = () => {
    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {recommendations.map((rec, index) => (
          <ShamahCard key={index} variant="glass" style={styles.platformCard}>
            <TouchableOpacity
              style={[
                styles.platformContent,
                selectedPlatforms.includes(rec.platform) && styles.selectedPlatform
              ]}
              onPress={() => handlePlatformToggle(rec.platform)}
            >
              <View style={styles.platformHeader}>
                <Text style={styles.platformName}>{rec.platform}</Text>
                <View style={styles.scoreContainer}>
                  <Text style={[styles.score, { color: getScoreColor(rec.score) }]}>
                    {Math.round(rec.score * 100)}%
                  </Text>
                  {selectedPlatforms.includes(rec.platform) && (
                    <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                  )}
                </View>
              </View>
              
              <View style={styles.reasonsList}>
                {rec.reasons.map((reason, i) => (
                  <Text key={i} style={styles.reasonText}>• {reason}</Text>
                ))}
              </View>
              
              <View style={styles.performanceProjection}>
                <Text style={styles.projectionTitle}>Projeção de Performance:</Text>
                <View style={styles.projectionGrid}>
                  <View style={styles.projectionItem}>
                    <Text style={styles.projectionLabel}>Views</Text>
                    <Text style={styles.projectionValue}>{rec.expectedPerformance.views.toLocaleString()}</Text>
                  </View>
                  <View style={styles.projectionItem}>
                    <Text style={styles.projectionLabel}>Engajamento</Text>
                    <Text style={styles.projectionValue}>{rec.expectedPerformance.engagement.toLocaleString()}</Text>
                  </View>
                  <View style={styles.projectionItem}>
                    <Text style={styles.projectionLabel}>Alcance</Text>
                    <Text style={styles.projectionValue}>{rec.expectedPerformance.reach.toLocaleString()}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </ShamahCard>
        ))}
      </ScrollView>
    );
  };

  const renderTrendsTab = () => {
    if (!trends) return null;

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        <ShamahCard variant="glass" style={styles.analysisCard}>
          <Text style={styles.sectionTitle}>📈 Tendências Atuais</Text>
          <View style={styles.trendsContainer}>
            {trends.trending.map((trend: string, index: number) => (
              <View key={index} style={styles.trendItem}>
                <Ionicons name="trending-up" size={16} color={Colors.primary} />
                <Text style={styles.trendText}>{trend}</Text>
              </View>
            ))}
          </View>
        </ShamahCard>

        <ShamahCard variant="glass" style={styles.analysisCard}>
          <Text style={styles.sectionTitle}>🎵 Sons Virais</Text>
          <View style={styles.soundsContainer}>
            {trends.sounds.map((sound: string, index: number) => (
              <TouchableOpacity key={index} style={styles.soundItem}>
                <Ionicons name="musical-note" size={16} color={Colors.secondary} />
                <Text style={styles.soundText}>{sound}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ShamahCard>

        <ShamahCard variant="glass" style={styles.analysisCard}>
          <Text style={styles.sectionTitle}>🎯 Oportunidades</Text>
          <View style={styles.opportunitiesContainer}>
            {trends.challengesOpportunities.map((opportunity: string, index: number) => (
              <View key={index} style={styles.opportunityItem}>
                <Ionicons name="bulb" size={16} color={Colors.warning} />
                <Text style={styles.opportunityText}>{opportunity}</Text>
              </View>
            ))}
          </View>
        </ShamahCard>
      </ScrollView>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.primary, Colors.secondary]}
          style={styles.header}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Análise Inteligente</Text>
          <View style={styles.placeholder} />
        </LinearGradient>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ShamahMiniLoading size="large" />
            <Text style={styles.loadingText}>Analisando vídeo com IA...</Text>
          </View>
        ) : (
          <>
            {/* Tabs */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, selectedTab === 'analysis' && styles.activeTab]}
                onPress={() => setSelectedTab('analysis')}
              >
                <Text style={[styles.tabText, selectedTab === 'analysis' && styles.activeTabText]}>
                  Análise
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, selectedTab === 'platforms' && styles.activeTab]}
                onPress={() => setSelectedTab('platforms')}
              >
                <Text style={[styles.tabText, selectedTab === 'platforms' && styles.activeTabText]}>
                  Plataformas
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, selectedTab === 'trends' && styles.activeTab]}
                onPress={() => setSelectedTab('trends')}
              >
                <Text style={[styles.tabText, selectedTab === 'trends' && styles.activeTabText]}>
                  Tendências
                </Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            {selectedTab === 'analysis' && renderAnalysisTab()}
            {selectedTab === 'platforms' && renderPlatformsTab()}
            {selectedTab === 'trends' && renderTrendsTab()}

            {/* Footer */}
            {selectedTab === 'platforms' && selectedPlatforms.length > 0 && (
              <View style={styles.footer}>
                <ShamahButton
                  title={`Processar para ${selectedPlatforms.length} plataforma${selectedPlatforms.length > 1 ? 's' : ''}`}
                  onPress={handleConfirmSelection}
                  variant="primary"
                />
              </View>
            )}
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: Colors.text,
    fontSize: 16,
    marginTop: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 10,
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  tabContent: {
    flex: 1,
    padding: 10,
  },
  analysisCard: {
    marginBottom: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  contentAnalysis: {
    marginBottom: 15,
  },
  analysisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  analysisLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  analysisValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  analysisDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    flex: 1,
    marginLeft: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
  },
  technicalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  technicalItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
  },
  technicalLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 5,
  },
  technicalValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  engagementMetrics: {
    marginTop: 10,
  },
  metricItem: {
    marginBottom: 15,
  },
  metricLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  metricValue: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
  recommendations: {
    marginTop: 10,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  hashtagsContainer: {
    marginTop: 20,
  },
  hashtagsTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 10,
  },
  hashtagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hashtag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  hashtagText: {
    color: 'white',
    fontSize: 12,
  },
  platformCard: {
    marginBottom: 15,
  },
  platformContent: {
    padding: 20,
  },
  selectedPlatform: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  platformHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  platformName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  reasonsList: {
    marginBottom: 15,
  },
  reasonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 5,
  },
  performanceProjection: {
    marginTop: 10,
  },
  projectionTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 8,
  },
  projectionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  projectionItem: {
    alignItems: 'center',
    flex: 1,
  },
  projectionLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
  },
  projectionValue: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  trendsContainer: {
    marginTop: 10,
  },
  trendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginLeft: 10,
  },
  soundsContainer: {
    marginTop: 10,
  },
  soundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  soundText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginLeft: 10,
  },
  opportunitiesContainer: {
    marginTop: 10,
  },
  opportunityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  opportunityText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  footer: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});
