import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShamahTheme } from '../constants/theme';
import { ShamahColors } from '../constants/Colors';
import ShamahBackground from './ShamahBackground';
import ShamahCard from './ShamahCard';
import ShamahButton from './ShamahButton';
import { AnimatedScreen, AnimatedCard } from './ShamahAnimations';
import { BlogPost } from '../hooks/useBlogManager';
import { useLoading } from '../contexts/LoadingContext';

interface BlogPostDetailProps {
  post: BlogPost;
  onBack: () => void;
  onSave: (postId: string) => void;
  onShare: (post: BlogPost) => void;
  onFeedback: (postId: string, helpful: boolean) => void;
  isSaved?: boolean;
}

export default function BlogPostDetail({ 
  post, 
  onBack, 
  onSave, 
  onShare, 
  onFeedback, 
  isSaved = false 
}: BlogPostDetailProps) {
  const [isReading, setIsReading] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const { showSyncLoading, hideLoading } = useLoading();

  const handleShare = async () => {
    try {
      showSyncLoading('Compartilhando...');
      await Share.share({
        message: `${post.title}\n\n${post.content.substring(0, 200)}...`,
        title: post.title,
      });
      onShare(post);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar o post');
    } finally {
      hideLoading();
    }
  };

  const handleSave = () => {
    onSave(post.id);
    Alert.alert(
      'Sucesso', 
      isSaved ? 'Post removido dos salvos' : 'Post salvo com sucesso'
    );
  };

  const handleFeedback = (helpful: boolean) => {
    onFeedback(post.id, helpful);
    setShowFeedback(false);
    Alert.alert(
      'Obrigado!', 
      'Seu feedback nos ajuda a melhorar as recomendações'
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trend': return ShamahColors.trends.primary;
      case 'news': return ShamahColors.news.primary;
      case 'tip': return ShamahColors.tips.primary;
      case 'tutorial': return ShamahColors.tutorials.primary;
      case 'strategy': return ShamahColors.strategies.primary;
      default: return ShamahColors.neutral[400];
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'logo-instagram';
      case 'facebook': return 'logo-facebook';
      case 'tiktok': return 'logo-tiktok';
      case 'twitter': return 'logo-twitter';
      case 'linkedin': return 'logo-linkedin';
      default: return 'globe';
    }
  };

  return (
    <ShamahBackground variant="cosmic" style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
          const progress = contentOffset.y / (contentSize.height - layoutMeasurement.height);
          setReadProgress(Math.min(Math.max(progress, 0), 1));
        }}
        scrollEventThrottle={16}
      >
        <AnimatedScreen>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Post do Blog</Text>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Ionicons 
                name={isSaved ? "bookmark" : "bookmark-outline"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${readProgress * 100}%` }]} />
          </View>

          {/* Post Content */}
          <AnimatedCard index={0}>
            <ShamahCard variant="glass" style={styles.postCard}>
              {/* Post Header */}
              <View style={styles.postHeader}>
                <View style={styles.postMeta}>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(post.category) }]}>
                    <Text style={styles.categoryText}>{post.category.toUpperCase()}</Text>
                  </View>
                  <View style={styles.platformBadge}>
                    <Ionicons name={getPlatformIcon(post.platform)} size={16} color="white" />
                    <Text style={styles.platformText}>{post.platform}</Text>
                  </View>
                </View>
                <Text style={styles.publishDate}>{formatDate(post.publishedAt)}</Text>
              </View>

              {/* Title */}
              <Text style={styles.postTitle}>{post.title}</Text>

              {/* Reading Time */}
              <View style={styles.readingTimeContainer}>
                <Ionicons name="time" size={16} color="rgba(255, 255, 255, 0.7)" />
                <Text style={styles.readingTime}>{post.readTime} min de leitura</Text>
                <View style={styles.relevanceScore}>
                  <Ionicons name="trending-up" size={16} color={ShamahColors.trends.primary} />
                  <Text style={styles.relevanceText}>{Math.round(post.relevanceScore * 100)}% relevante</Text>
                </View>
              </View>

              {/* Content */}
              <Text style={styles.postContent}>{post.content}</Text>

              {/* Tags */}
              <View style={styles.tagsContainer}>
                <Text style={styles.tagsTitle}>Tags:</Text>
                <View style={styles.tagsRow}>
                  {post.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Actions */}
              <View style={styles.actionsContainer}>
                <ShamahButton
                  variant="primary"
                  size="medium"
                  onPress={handleShare}
                  style={styles.shareButton}
                >
                  <Ionicons name="share" size={20} color="white" />
                  <Text style={styles.actionText}>Compartilhar</Text>
                </ShamahButton>

                <ShamahButton
                  variant="secondary"
                  size="medium"
                  onPress={() => setShowFeedback(!showFeedback)}
                  style={styles.feedbackButton}
                >
                  <Ionicons name="thumbs-up" size={20} color="white" />
                  <Text style={styles.actionText}>Feedback</Text>
                </ShamahButton>
              </View>

              {/* Feedback Section */}
              {showFeedback && (
                <View style={styles.feedbackSection}>
                  <Text style={styles.feedbackTitle}>Este post foi útil?</Text>
                  <View style={styles.feedbackButtons}>
                    <TouchableOpacity
                      style={[styles.feedbackButton, styles.helpfulButton]}
                      onPress={() => handleFeedback(true)}
                    >
                      <Ionicons name="thumbs-up" size={20} color="white" />
                      <Text style={styles.feedbackButtonText}>Sim, útil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.feedbackButton, styles.notHelpfulButton]}
                      onPress={() => handleFeedback(false)}
                    >
                      <Ionicons name="thumbs-down" size={20} color="white" />
                      <Text style={styles.feedbackButtonText}>Não útil</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ShamahCard>
          </AnimatedCard>
        </AnimatedScreen>
      </ScrollView>
    </ShamahBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: ShamahTheme.spacing.lg,
    paddingBottom: ShamahTheme.spacing.md,
  },
  backButton: {
    padding: ShamahTheme.spacing.sm,
  },
  headerTitle: {
    fontSize: ShamahTheme.typography.sizes.xl,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
  },
  saveButton: {
    padding: ShamahTheme.spacing.sm,
  },
  progressContainer: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: ShamahTheme.spacing.lg,
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    backgroundColor: ShamahColors.trends.primary,
    borderRadius: 2,
  },
  postCard: {
    marginHorizontal: ShamahTheme.spacing.lg,
    marginVertical: ShamahTheme.spacing.lg,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ShamahTheme.spacing.md,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: ShamahTheme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: ShamahTheme.spacing.sm,
  },
  categoryText: {
    fontSize: ShamahTheme.typography.sizes.xs,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: ShamahTheme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  platformText: {
    fontSize: ShamahTheme.typography.sizes.xs,
    color: 'white',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  publishDate: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  postTitle: {
    fontSize: ShamahTheme.typography.sizes['2xl'],
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
    marginBottom: ShamahTheme.spacing.md,
    lineHeight: 32,
  },
  readingTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ShamahTheme.spacing.lg,
  },
  readingTime: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: 4,
    marginRight: ShamahTheme.spacing.md,
  },
  relevanceScore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  relevanceText: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: ShamahColors.trends.primary,
    marginLeft: 4,
  },
  postContent: {
    fontSize: ShamahTheme.typography.sizes.md,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    marginBottom: ShamahTheme.spacing.lg,
  },
  tagsContainer: {
    marginBottom: ShamahTheme.spacing.lg,
  },
  tagsTitle: {
    fontSize: ShamahTheme.typography.sizes.sm,
    fontWeight: ShamahTheme.typography.weights.semibold,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: ShamahTheme.spacing.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: ShamahTheme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: ShamahTheme.spacing.sm,
    marginBottom: ShamahTheme.spacing.sm,
  },
  tagText: {
    fontSize: ShamahTheme.typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ShamahTheme.spacing.md,
  },
  shareButton: {
    flex: 1,
    marginRight: ShamahTheme.spacing.sm,
  },
  feedbackButton: {
    flex: 1,
    marginLeft: ShamahTheme.spacing.sm,
  },
  actionText: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'white',
    marginLeft: ShamahTheme.spacing.sm,
  },
  feedbackSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: ShamahTheme.spacing.md,
    borderRadius: 12,
    marginTop: ShamahTheme.spacing.md,
  },
  feedbackTitle: {
    fontSize: ShamahTheme.typography.sizes.md,
    fontWeight: ShamahTheme.typography.weights.semibold,
    color: 'white',
    marginBottom: ShamahTheme.spacing.md,
    textAlign: 'center',
  },
  feedbackButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  helpfulButton: {
    backgroundColor: ShamahColors.success.primary,
    flex: 1,
    marginRight: ShamahTheme.spacing.sm,
  },
  notHelpfulButton: {
    backgroundColor: ShamahColors.error.primary,
    flex: 1,
    marginLeft: ShamahTheme.spacing.sm,
  },
  feedbackButtonText: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'white',
    marginLeft: ShamahTheme.spacing.sm,
  },
});
