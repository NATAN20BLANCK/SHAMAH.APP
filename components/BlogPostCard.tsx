import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ShamahTheme } from '../constants/theme';
import { ShamahColors } from '../constants/Colors';
import { BlogPost } from '../hooks/useBlogManager';

interface BlogPostCardProps {
  post: BlogPost;
  onPress: () => void;
  onSave: () => void;
  onShare: () => void;
  isSaved?: boolean;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post,
  onPress,
  onSave,
  onShare,
  isSaved = false,
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trend':
        return ShamahColors.primary;
      case 'news':
        return ShamahColors.secondary;
      case 'tip':
        return ShamahColors.accent;
      case 'tutorial':
        return ShamahColors.success;
      case 'strategy':
        return ShamahColors.warning;
      default:
        return ShamahColors.primary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trend':
        return 'trending-up';
      case 'news':
        return 'newspaper';
      case 'tip':
        return 'bulb';
      case 'tutorial':
        return 'school';
      case 'strategy':
        return 'analytics';
      default:
        return 'document-text';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return 'logo-instagram';
      case 'facebook':
        return 'logo-facebook';
      case 'tiktok':
        return 'musical-notes';
      case 'twitter':
        return 'logo-twitter';
      case 'linkedin':
        return 'logo-linkedin';
      default:
        return 'globe';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <LinearGradient
        colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.categoryContainer}>
            <LinearGradient
              colors={[getCategoryColor(post.category), 'rgba(0,0,0,0.1)']}
              style={styles.categoryBadge}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons 
                name={getCategoryIcon(post.category) as any} 
                size={14} 
                color="white" 
              />
              <Text style={styles.categoryText}>
                {post.category.toUpperCase()}
              </Text>
            </LinearGradient>
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity onPress={onSave}>
              <Ionicons 
                name={isSaved ? 'bookmark' : 'bookmark-outline'} 
                size={20} 
                color={isSaved ? ShamahColors.accent : 'rgba(255,255,255,0.7)'} 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onShare} style={styles.shareButton}>
              <Ionicons 
                name="share-outline" 
                size={20} 
                color="rgba(255,255,255,0.7)" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {post.title}
          </Text>
          
          <Text style={styles.excerpt} numberOfLines={3}>
            {post.content}
          </Text>

          {/* Tags */}
          <View style={styles.tags}>
            {post.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.platformContainer}>
            <Ionicons 
              name={getPlatformIcon(post.platform) as any} 
              size={16} 
              color="rgba(255,255,255,0.6)" 
            />
            <Text style={styles.platformText}>
              {post.platform === 'general' ? 'Geral' : post.platform}
            </Text>
          </View>
          
          <View style={styles.metadata}>
            <View style={styles.readTime}>
              <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.5)" />
              <Text style={styles.readTimeText}>{post.readTime} min</Text>
            </View>
            
            {post.isPersonalized && (
              <View style={styles.aiLabel}>
                <Ionicons name="sparkles" size={14} color={ShamahColors.accent} />
                <Text style={styles.aiText}>IA</Text>
              </View>
            )}
          </View>
        </View>

        {/* Relevance Score Bar */}
        <View style={styles.relevanceBar}>
          <View 
            style={[
              styles.relevanceFill, 
              { width: `${post.relevanceScore * 100}%` }
            ]} 
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: ShamahTheme.spacing.sm,
    borderRadius: ShamahTheme.borderRadius.lg,
    overflow: 'hidden',
  },
  gradient: {
    padding: ShamahTheme.spacing.md,
    borderRadius: ShamahTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ShamahTheme.spacing.sm,
  },
  categoryContainer: {
    flex: 1,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ShamahTheme.spacing.sm,
    paddingVertical: ShamahTheme.spacing.xs,
    borderRadius: ShamahTheme.borderRadius.md,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: 'white',
    fontSize: ShamahTheme.typography.sizes.xs,
    fontWeight: ShamahTheme.typography.weights.bold,
    marginLeft: ShamahTheme.spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: ShamahTheme.spacing.md,
  },
  shareButton: {
    marginLeft: ShamahTheme.spacing.sm,
  },
  content: {
    marginBottom: ShamahTheme.spacing.md,
  },
  title: {
    color: 'white',
    fontSize: ShamahTheme.typography.sizes.lg,
    fontWeight: ShamahTheme.typography.weights.bold,
    marginBottom: ShamahTheme.spacing.sm,
    lineHeight: 24,
  },
  excerpt: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: ShamahTheme.typography.sizes.md,
    lineHeight: 20,
    marginBottom: ShamahTheme.spacing.md,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ShamahTheme.spacing.xs,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: ShamahTheme.spacing.sm,
    paddingVertical: ShamahTheme.spacing.xs,
    borderRadius: ShamahTheme.borderRadius.sm,
  },
  tagText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: ShamahTheme.typography.sizes.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  platformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platformText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: ShamahTheme.typography.sizes.sm,
    marginLeft: ShamahTheme.spacing.xs,
    textTransform: 'capitalize',
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShamahTheme.spacing.md,
  },
  readTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTimeText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: ShamahTheme.typography.sizes.xs,
    marginLeft: ShamahTheme.spacing.xs,
  },
  aiLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139,92,246,0.2)',
    paddingHorizontal: ShamahTheme.spacing.sm,
    paddingVertical: ShamahTheme.spacing.xs,
    borderRadius: ShamahTheme.borderRadius.sm,
  },
  aiText: {
    color: ShamahColors.accent,
    fontSize: ShamahTheme.typography.sizes.xs,
    fontWeight: ShamahTheme.typography.weights.bold,
    marginLeft: ShamahTheme.spacing.xs,
  },
  relevanceBar: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginTop: ShamahTheme.spacing.sm,
    borderRadius: 1,
  },
  relevanceFill: {
    height: '100%',
    backgroundColor: ShamahColors.accent,
    borderRadius: 1,
  },
});

export default BlogPostCard;
