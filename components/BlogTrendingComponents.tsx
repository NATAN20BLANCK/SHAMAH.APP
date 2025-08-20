import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ShamahTheme } from '../constants/theme';
import { ShamahColors } from '../constants/Colors';
import { TrendingTopic } from '../hooks/useBlogManager';

interface TrendingTopicsProps {
  topics: TrendingTopic[];
  onTopicPress: (topic: TrendingTopic) => void;
}

export const TrendingTopics: React.FC<TrendingTopicsProps> = ({
  topics,
  onTopicPress,
}) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return ShamahColors.success;
      case 'negative':
        return ShamahColors.error;
      case 'neutral':
        return ShamahColors.warning;
      default:
        return ShamahColors.primary;
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'trending-up';
      case 'negative':
        return 'trending-down';
      case 'neutral':
        return 'remove';
      default:
        return 'trending-up';
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flash" size={20} color={ShamahColors.accent} />
        <Text style={styles.headerTitle}>Trending Agora</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            style={styles.topicCard}
            onPress={() => onTopicPress(topic)}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Header */}
              <View style={styles.topicHeader}>
                <View style={styles.platformBadge}>
                  <Text style={styles.platformText}>
                    {topic.platform.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.sentimentContainer}>
                  <Ionicons
                    name={getSentimentIcon(topic.sentiment) as any}
                    size={16}
                    color={getSentimentColor(topic.sentiment)}
                  />
                </View>
              </View>

              {/* Keyword */}
              <Text style={styles.keyword} numberOfLines={2}>
                {topic.keyword}
              </Text>

              {/* Volume */}
              <View style={styles.volumeContainer}>
                <Text style={styles.volumeLabel}>Volume:</Text>
                <Text style={styles.volumeValue}>
                  {formatVolume(topic.volume)}
                </Text>
              </View>

              {/* Relevance Score */}
              <View style={styles.relevanceContainer}>
                <Text style={styles.relevanceLabel}>Relevância:</Text>
                <View style={styles.relevanceBar}>
                  <View 
                    style={[
                      styles.relevanceFill, 
                      { width: `${topic.relevanceToUser * 100}%` }
                    ]} 
                  />
                </View>
              </View>

              {/* Related Content */}
              <View style={styles.relatedContent}>
                {topic.relatedContent.slice(0, 2).map((content, index) => (
                  <View key={index} style={styles.relatedTag}>
                    <Text style={styles.relatedText}>#{content}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

interface AIRecommendationsProps {
  recommendations: string[];
  onRecommendationPress: (recommendation: string) => void;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  recommendations,
  onRecommendationPress,
}) => {
  return (
    <View style={styles.recommendationsContainer}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={20} color={ShamahColors.accent} />
        <Text style={styles.headerTitle}>IA Recomenda</Text>
      </View>

      <View style={styles.recommendationsList}>
        {recommendations.map((recommendation, index) => (
          <TouchableOpacity
            key={index}
            style={styles.recommendationCard}
            onPress={() => onRecommendationPress(recommendation)}
          >
            <LinearGradient
              colors={['rgba(139,92,246,0.2)', 'rgba(139,92,246,0.1)']}
              style={styles.recommendationGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.recommendationContent}>
                <Ionicons 
                  name="bulb" 
                  size={16} 
                  color={ShamahColors.accent} 
                />
                <Text style={styles.recommendationText}>
                  {recommendation}
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={16} 
                color="rgba(255,255,255,0.5)" 
              />
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: ShamahTheme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ShamahTheme.spacing.md,
    paddingHorizontal: ShamahTheme.spacing.md,
  },
  headerTitle: {
    color: 'white',
    fontSize: ShamahTheme.typography.sizes.lg,
    fontWeight: ShamahTheme.typography.weights.bold,
    marginLeft: ShamahTheme.spacing.sm,
  },
  scrollContainer: {
    paddingHorizontal: ShamahTheme.spacing.md,
  },
  topicCard: {
    width: 200,
    marginRight: ShamahTheme.spacing.md,
    borderRadius: ShamahTheme.borderRadius.lg,
    overflow: 'hidden',
  },
  gradient: {
    padding: ShamahTheme.spacing.md,
    borderRadius: ShamahTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ShamahTheme.spacing.sm,
  },
  platformBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: ShamahTheme.spacing.sm,
    paddingVertical: ShamahTheme.spacing.xs,
    borderRadius: ShamahTheme.borderRadius.sm,
  },
  platformText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: ShamahTheme.typography.sizes.xs,
    fontWeight: ShamahTheme.typography.weights.bold,
  },
  sentimentContainer: {
    // Container para o ícone de sentimento
  },
  keyword: {
    color: 'white',
    fontSize: ShamahTheme.typography.sizes.md,
    fontWeight: ShamahTheme.typography.weights.bold,
    marginBottom: ShamahTheme.spacing.md,
    lineHeight: 20,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ShamahTheme.spacing.sm,
  },
  volumeLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: ShamahTheme.typography.sizes.sm,
    marginRight: ShamahTheme.spacing.sm,
  },
  volumeValue: {
    color: 'white',
    fontSize: ShamahTheme.typography.sizes.sm,
    fontWeight: ShamahTheme.typography.weights.bold,
  },
  relevanceContainer: {
    marginBottom: ShamahTheme.spacing.md,
  },
  relevanceLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: ShamahTheme.typography.sizes.xs,
    marginBottom: ShamahTheme.spacing.xs,
  },
  relevanceBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
  },
  relevanceFill: {
    height: '100%',
    backgroundColor: ShamahColors.accent,
    borderRadius: 2,
  },
  relatedContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ShamahTheme.spacing.xs,
  },
  relatedTag: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: ShamahTheme.spacing.sm,
    paddingVertical: ShamahTheme.spacing.xs,
    borderRadius: ShamahTheme.borderRadius.sm,
  },
  relatedText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: ShamahTheme.typography.sizes.xs,
  },
  recommendationsContainer: {
    marginVertical: ShamahTheme.spacing.md,
  },
  recommendationsList: {
    paddingHorizontal: ShamahTheme.spacing.md,
  },
  recommendationCard: {
    marginBottom: ShamahTheme.spacing.sm,
    borderRadius: ShamahTheme.borderRadius.lg,
    overflow: 'hidden',
  },
  recommendationGradient: {
    padding: ShamahTheme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: ShamahTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
  },
  recommendationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recommendationText: {
    color: 'white',
    fontSize: ShamahTheme.typography.sizes.md,
    marginLeft: ShamahTheme.spacing.sm,
    flex: 1,
  },
});

export default {
  TrendingTopics,
  AIRecommendations,
};
