import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  FlatList,
  StatusBar,
  Modal,
  Share,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import useBlogManager, { BlogPost } from '../hooks/useBlogManager';
import { useAIAnalysis } from '../hooks/useAIAnalysis';
import { ShamahColors } from '../constants/Colors';
import ShamahLoadingScreen from '../components/ShamahLoadingScreen';
import AIInsightsDashboard from '../components/AIInsightsDashboard';

const { width } = Dimensions.get('window');

interface BlogScreenProps {
  navigation?: any;
}

const BlogScreen: React.FC<BlogScreenProps> = ({ navigation }) => {
  const {
    posts,
    personalizedPosts,
    trendingTopics,
    userPreferences,
    isLoading,
    isRefreshing,
    refreshContent,
    markAsRead,
    savePost
  } = useBlogManager();

  const {
    analysis,
    isAnalyzing,
    getRealTimeRecommendations
  } = useAIAnalysis();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [realTimeRecommendations, setRealTimeRecommendations] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: 'Todos', icon: 'apps' },
    { id: 'personalized', name: 'Para Você', icon: 'star' },
    { id: 'ai-insights', name: 'Insights IA', icon: 'sparkles' },
    { id: 'trend', name: 'Tendências', icon: 'trending-up' },
    { id: 'strategy', name: 'Estratégia', icon: 'rocket' },
    { id: 'tutorial', name: 'Tutoriais', icon: 'school' },
    { id: 'news', name: 'Notícias', icon: 'newspaper' },
  ];

  useEffect(() => {
    if (getRealTimeRecommendations) {
      setRealTimeRecommendations(getRealTimeRecommendations());
    }
  }, [getRealTimeRecommendations]);

  const getFilteredPosts = () => {
    if (selectedCategory === 'all') {
      return [...personalizedPosts, ...posts].sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    }
    if (selectedCategory === 'personalized') {
      return personalizedPosts;
    }
    if (selectedCategory === 'ai-insights') {
      return [];
    }
    return posts.filter((post: BlogPost) => post.category === selectedCategory);
  };

  const openPost = (post: BlogPost) => {
    setSelectedPost(post);
    setIsPostModalVisible(true);
    markAsRead(post.id);
  };

  const handleSavePost = async (postId: string) => {
    try {
      await savePost(postId);
      setSavedPosts(prev => [...prev, postId]);
      Alert.alert('✅ Post Salvo', 'Adicionado aos seus favoritos!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o post.');
    }
  };

  const handleSharePost = async (post: BlogPost) => {
    try {
      await Share.share({
        message: `${post.title}\n\n${post.excerpt || post.content.substring(0, 120)}\n\nVia Shamah Publi`,
        title: post.title,
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      'trend': 'trending-up',
      'news': 'newspaper',
      'tip': 'bulb',
      'tutorial': 'school',
      'strategy': 'rocket',
      'case-study': 'analytics',
      'tool-review': 'construct'
    };
    return iconMap[category] || 'document-text';
  };

  const getPlatformIcon = (platform: string) => {
    const iconMap: { [key: string]: string } = {
      'instagram': 'logo-instagram',
      'facebook': 'logo-facebook',
      'tiktok': 'logo-tiktok',
      'twitter': 'logo-twitter',
      'linkedin': 'logo-linkedin',
      'youtube': 'logo-youtube',
      'general': 'globe'
    };
    return iconMap[platform] || 'globe';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colorMap: { [key: string]: string } = {
      'beginner': ShamahColors.success,
      'intermediate': ShamahColors.warning,
      'advanced': ShamahColors.accent
    };
    return colorMap[difficulty] || ShamahColors.textPrimary;
  };

  const renderRealTimeRecommendations = () => (
    <View style={styles.realTimeSection}>
      <View style={styles.realTimeHeader}>
        <Ionicons name="flash" size={20} color={ShamahColors.accent} />
        <Text style={styles.realTimeTitle}>🤖 IA Ao Vivo</Text>
        <View style={styles.liveBadge}>
          <View style={styles.liveIndicator} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendationsScroll}>
        {realTimeRecommendations.map((recommendation, index) => (
          <TouchableOpacity key={index} style={styles.recommendationCard}>
            <LinearGradient
              colors={[ShamahColors.accent + '20', ShamahColors.accent + '10']}
              style={styles.recommendationGradient}
            >
              <Text style={styles.recommendationText}>{recommendation}</Text>
              <TouchableOpacity style={styles.recommendationAction}>
                <Ionicons name="arrow-forward" size={14} color={ShamahColors.accent} />
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderAIInsightsSection = () => (
    <View style={styles.aiInsightsSection}>
      <AIInsightsDashboard 
        userPreferences={userPreferences}
        recentPerformance={analysis?.performanceMetrics}
        onInsightTap={(insight) => {
          Alert.alert(insight.title, insight.description);
        }}
      />
    </View>
  );

  const renderTrendingTopics = () => (
    <View style={styles.trendingSection}>
      <Text style={styles.sectionTitle}>🔥 Tendências em Alta</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingScroll}>
        {trendingTopics.map((topic: any) => (
          <TouchableOpacity key={topic.id} style={styles.trendingCard}>
            <LinearGradient
              colors={[ShamahColors.accent + '20', ShamahColors.accent + '10']}
              style={styles.trendingGradient}
            >
              <Text style={styles.trendingKeyword}>{topic.keyword}</Text>
              <View style={styles.trendingMeta}>
                <Text style={styles.trendingVolume}>
                  {(topic.volume / 1000).toFixed(0)}k menções
                </Text>
                <View style={[styles.trendingPlatform, { backgroundColor: ShamahColors.primary + '20' }]}>
                  <Ionicons 
                    name={getPlatformIcon(topic.platform) as any} 
                    size={12} 
                    color={ShamahColors.primary} 
                  />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPostCard = ({ item: post }: { item: BlogPost }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => openPost(post)}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={post.isPersonalized 
          ? [ShamahColors.primary + '15', ShamahColors.accent + '10']
          : [ShamahColors.backgroundSecondary, ShamahColors.backgroundSecondary + '80']
        }
        style={styles.postCardGradient}
      >
        {/* Header do Post */}
        <View style={styles.postHeader}>
          <View style={styles.postMeta}>
            <View style={[styles.categoryBadge, { backgroundColor: ShamahColors.primary + '20' }]}>
              <Ionicons 
                name={getCategoryIcon(post.category) as any} 
                size={12} 
                color={ShamahColors.primary} 
              />
              <Text style={styles.categoryText}>{post.category}</Text>
            </View>
            <View style={styles.platformBadge}>
              <Ionicons 
                name={getPlatformIcon(post.platform || 'general') as any} 
                size={12} 
                color={ShamahColors.textSecondary} 
              />
            </View>
          </View>
          
          {post.isPersonalized && (
            <View style={styles.personalizedBadge}>
              <Ionicons name="star" size={12} color={ShamahColors.accent} />
              <Text style={styles.personalizedText}>IA</Text>
            </View>
          )}
        </View>

        {/* Título e Conteúdo */}
        <Text style={styles.postTitle} numberOfLines={2}>
          {post.title}
        </Text>
        
        <Text style={styles.postExcerpt} numberOfLines={3}>
          {post.excerpt || post.content.substring(0, 120) + '...'}
        </Text>

        {/* Score de Relevância */}
        {post.aiInsights && (
          <View style={styles.aiInsights}>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Relevância</Text>
              <View style={styles.scoreBar}>
                <View 
                  style={[
                    styles.scoreProgress, 
                    { width: `${post.relevanceScore || 0}%`, backgroundColor: ShamahColors.accent }
                  ]} 
                />
              </View>
              <Text style={styles.scoreValue}>{post.relevanceScore || 0}%</Text>
            </View>
          </View>
        )}

        {/* Footer do Post */}
        <View style={styles.postFooter}>
          <View style={styles.postStats}>
            <View style={styles.stat}>
              <Ionicons name="time" size={14} color={ShamahColors.textSecondary} />
              <Text style={styles.statText}>{post.readTime}min</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="eye" size={14} color={ShamahColors.textSecondary} />
              <Text style={styles.statText}>{post.engagement?.views || 0}</Text>
            </View>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(post.difficulty) + '20' }]}>
              <Text style={[styles.difficultyText, { color: getDifficultyColor(post.difficulty) }]}>
                {post.difficulty}
              </Text>
            </View>
          </View>

          <View style={styles.postActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleSavePost(post.id)}
            >
              <Ionicons 
                name={savedPosts.includes(post.id) ? "bookmark" : "bookmark-outline"} 
                size={18} 
                color={savedPosts.includes(post.id) ? ShamahColors.accent : ShamahColors.textSecondary} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleSharePost(post)}
            >
              <Ionicons name="share-outline" size={18} color={ShamahColors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <ShamahLoadingScreen 
        visible={true}
        type="ai-processing"
        message="Alimentando seu blog com IA..."
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ShamahColors.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={[ShamahColors.primary, ShamahColors.primary + 'E6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTitle}>
            <Ionicons name="library" size={24} color="white" />
            <Text style={styles.headerText}>Blog Inteligente</Text>
          </View>
          <TouchableOpacity style={styles.aiIndicator}>
            <Ionicons name="sparkles" size={20} color={ShamahColors.accent} />
            <Text style={styles.aiText}>IA</Text>
          </TouchableOpacity>
        </View>

        {/* Estatísticas do Usuário */}
        {userPreferences && (
          <View style={styles.userStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{personalizedPosts.length}</Text>
              <Text style={styles.statLabel}>Personalizados</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userPreferences.learningPath?.completedTopics?.length || 0}</Text>
              <Text style={styles.statLabel}>Concluídos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {personalizedPosts.length > 0 
                  ? Math.round(personalizedPosts.reduce((acc: number, post: BlogPost) => acc + (post.relevanceScore || 0), 0) / personalizedPosts.length)
                  : 0}%
              </Text>
              <Text style={styles.statLabel}>Relevância</Text>
            </View>
          </View>
        )}
      </LinearGradient>

      {/* Tabs superiores */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12 }}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: selectedCategory === category.id ? ShamahColors.primary : 'rgba(255,255,255,0.12)',
              paddingHorizontal: 18,
              paddingVertical: 10,
              borderRadius: 20,
              marginRight: 16,
              borderWidth: selectedCategory === category.id ? 2 : 1,
              borderColor: selectedCategory === category.id ? ShamahColors.primary : ShamahColors.borderLight,
              elevation: selectedCategory === category.id ? 4 : 0,
            }}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons
              name={category.icon as any}
              size={20}
              color={selectedCategory === category.id ? '#fff' : ShamahColors.textSecondary}
              style={{ marginRight: 8 }}
            />
            <Text style={{
              color: selectedCategory === category.id ? '#fff' : ShamahColors.textSecondary,
              fontWeight: 'bold',
              fontSize: 16,
            }}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Categorias */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {/* ...categorias secundárias... */}
        {/* ...existing code... */}
      </ScrollView>

      {/* Conteúdo Principal */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshContent}
            colors={[ShamahColors.primary]}
            tintColor={ShamahColors.primary}
          />
        }
      >
        {/* Recomendações em Tempo Real */}
        {realTimeRecommendations.length > 0 && renderRealTimeRecommendations()}

        {/* Conteúdo baseado na categoria selecionada */}
        {selectedCategory === 'ai-insights' ? (
          renderAIInsightsSection()
        ) : (
          <>
            {/* Tendências (apenas na categoria 'all' ou 'trend') */}
            {(selectedCategory === 'all' || selectedCategory === 'trend') && renderTrendingTopics()}

            {/* Posts */}
            <View style={styles.postsSection}>
              {selectedCategory === 'personalized' && (
                <View style={styles.aiHeader}>
                  <Ionicons name="sparkles" size={20} color={ShamahColors.accent} />
                  <Text style={styles.aiHeaderText}>Conteúdo Personalizado pela IA</Text>
                </View>
              )}
              
              <FlatList
                data={getFilteredPosts()}
                renderItem={renderPostCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
              />
            </View>
          </>
        )}
      </ScrollView>

      {/* Modal do Post */}
      <Modal
        visible={isPostModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsPostModalVisible(false)}
      >
        {selectedPost && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setIsPostModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={ShamahColors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalShareButton}
                onPress={() => selectedPost && handleSharePost(selectedPost)}
              >
                <Ionicons name="share-outline" size={24} color={ShamahColors.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedPost.title}</Text>
              
              {selectedPost.aiInsights && (
                <View style={styles.modalAiInsights}>
                  <Text style={styles.modalAiTitle}>🤖 Insights da IA</Text>
                  {selectedPost.aiInsights.recommendationReason.map((reason, index) => (
                    <Text key={index} style={styles.modalAiReason}>• {reason}</Text>
                  ))}
                </View>
              )}
              
              <Text style={styles.modalText}>{selectedPost.content}</Text>
              
              <View style={styles.modalTags}>
                {selectedPost.tags.map((tag) => (
                  <View key={tag} style={styles.modalTag}>
                    <Text style={styles.modalTagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ShamahColors.backgroundPrimary,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  aiText: {
    color: ShamahColors.accent,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  categoriesContainer: {
    backgroundColor: ShamahColors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: ShamahColors.borderLight,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: ShamahColors.backgroundPrimary,
    borderWidth: 1,
    borderColor: ShamahColors.borderLight,
  },
  categoryButtonActive: {
    backgroundColor: ShamahColors.primary,
    borderColor: ShamahColors.primary,
  },
  categoryButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: ShamahColors.textSecondary,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  realTimeSection: {
    padding: 20,
    backgroundColor: ShamahColors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: ShamahColors.borderLight,
  },
  realTimeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  realTimeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ShamahColors.textPrimary,
    flex: 1,
    marginLeft: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  recommendationsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  recommendationCard: {
    marginRight: 12,
    width: 280,
  },
  recommendationGradient: {
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recommendationText: {
    fontSize: 14,
    color: ShamahColors.textPrimary,
    flex: 1,
    fontWeight: '500',
  },
  recommendationAction: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: ShamahColors.accent + '20',
  },
  aiInsightsSection: {
    flex: 1,
    minHeight: 400,
  },
  trendingSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: ShamahColors.borderLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ShamahColors.textPrimary,
    marginBottom: 15,
  },
  trendingScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  trendingCard: {
    marginRight: 12,
    width: 160,
  },
  trendingGradient: {
    padding: 15,
    borderRadius: 15,
  },
  trendingKeyword: {
    fontSize: 14,
    fontWeight: 'bold',
    color: ShamahColors.textPrimary,
    marginBottom: 8,
  },
  trendingMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendingVolume: {
    fontSize: 12,
    color: ShamahColors.textSecondary,
  },
  trendingPlatform: {
    padding: 4,
    borderRadius: 8,
  },
  postsSection: {
    padding: 20,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: ShamahColors.accent + '10',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: ShamahColors.accent,
  },
  aiHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ShamahColors.accent,
    marginLeft: 8,
  },
  postCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    backgroundColor: 'rgba(255,255,255,0.12)', // efeito glass
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    marginBottom: 24,
  },
  postCardGradient: {
    padding: 20,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: ShamahColors.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
    marginLeft: 4,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  platformBadge: {
    padding: 7,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: ShamahColors.accent,
  },
  personalizedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: ShamahColors.accent,
  },
  personalizedText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 4,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  postTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  postExcerpt: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 22,
    marginBottom: 18,
  },
  aiInsights: {
    marginBottom: 15,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: ShamahColors.textSecondary,
    width: 60,
  },
  scoreBar: {
    flex: 1,
    height: 4,
    backgroundColor: ShamahColors.borderLight,
    borderRadius: 2,
    marginHorizontal: 10,
  },
  scoreProgress: {
    height: '100%',
    borderRadius: 2,
  },
  scoreValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: ShamahColors.accent,
    minWidth: 35,
    textAlign: 'right',
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statText: {
    fontSize: 12,
    color: ShamahColors.textSecondary,
    marginLeft: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: ShamahColors.backgroundPrimary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: ShamahColors.borderLight,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalShareButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ShamahColors.textPrimary,
    marginBottom: 20,
  },
  modalAiInsights: {
    backgroundColor: ShamahColors.accent + '10',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: ShamahColors.accent,
  },
  modalAiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ShamahColors.accent,
    marginBottom: 10,
  },
  modalAiReason: {
    fontSize: 14,
    color: ShamahColors.textSecondary,
    marginBottom: 5,
  },
  modalText: {
    fontSize: 16,
    color: ShamahColors.textPrimary,
    lineHeight: 24,
    marginBottom: 20,
  },
  modalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  modalTag: {
    backgroundColor: ShamahColors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  modalTagText: {
    fontSize: 12,
    color: ShamahColors.primary,
    fontWeight: '600',
  },
});

export default BlogScreen;
