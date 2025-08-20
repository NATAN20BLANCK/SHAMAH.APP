import React, { useState, useEffect, useRef } from 'react';
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
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useBlogManager, { BlogPost } from '../../hooks/useBlogManager';
import AsyncStorage from '../../utils/AsyncStorage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useAIAnalysis } from '../../hooks/useAIAnalysis';
import { ShamahColors } from '../../constants/Colors';
import ShamahLoadingScreen from '../../components/ShamahLoadingScreen';
import AIInsightsDashboard from '../../components/AIInsightsDashboard';
import { AnimatedScreen, AnimatedCard } from '../../components/ShamahAnimations';

const { width } = Dimensions.get('window');

interface ExploreCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  trending: boolean;
}

interface TrendingTopic {
  id: string;
  title: string;
  engagement: number;
  category: string;
  hashtags: string[];
}

// Simulação simples de IA para respostas automáticas
function getAIResponse(message: string): { response: string, escalate: boolean } {
  const lower = message.toLowerCase();
  if (lower.includes('erro') || lower.includes('problema') || lower.includes('não funciona')) {
    return {
      response: 'Parece que você está enfrentando um problema técnico. Deseja falar com um especialista humano?',
      escalate: true
    };
  }
  if (lower.includes('pagamento') || lower.includes('assinatura')) {
    return {
      response: 'Sobre pagamentos e assinaturas: você pode acessar a área de planos no menu principal. Precisa de mais ajuda?',
      escalate: false
    };
  }
  if (lower.includes('nicho') || lower.includes('tendência')) {
    return {
      response: 'Para ver tendências de nichos, acesse a aba "Tendências" no topo da tela.',
      escalate: false
    };
  }
  return {
    response: 'Sou a assistente IA do Shamah! Como posso ajudar você hoje?',
    escalate: false
  };
}

export default function BlogScreen() {
  const [showRateModal, setShowRateModal] = useState(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const [showNichoAlert, setShowNichoAlert] = useState(false);
  const [userNichos, setUserNichos] = useState<string[]>([]);
  const router = useRouter();
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
  const [showModal, setShowModal] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'blog' | 'explore' | 'trends' | 'insights'>('blog');
  // Chat de Ajuda
  const [showHelpChat, setShowHelpChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ from: 'user' | 'ai' | 'specialist', text: string }[]>([
    { from: 'ai', text: 'Olá! Sou a assistente IA do Shamah. Como posso ajudar?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [waitingSpecialist, setWaitingSpecialist] = useState(false);
  // Função para enviar mensagem no chat
  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = { from: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    const ai = getAIResponse(chatInput);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { from: 'ai', text: ai.response }]);
      if (ai.escalate) {
        setTimeout(() => {
          setChatMessages(prev => [...prev, { from: 'ai', text: 'Deseja conversar com um especialista humano? Toque em "Sim" abaixo.' }]);
        }, 800);
      }
    }, 700);
    setChatInput('');
  };

  // Função para simular entrada do especialista
  const handleEscalate = () => {
    setWaitingSpecialist(true);
    setChatMessages(prev => [...prev, { from: 'user', text: 'Sim, quero falar com um especialista.' }]);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { from: 'specialist', text: 'Olá! Sou um especialista humano. Como posso ajudar você?' }]);
      setWaitingSpecialist(false);
    }, 2500);
  };

  // Carregar nichos do usuário ao montar e configurar notificações
  useEffect(() => {
    AsyncStorage.getItem('userNichos').then(data => {
      if (data) {
        try {
          setUserNichos(JSON.parse(data));
        } catch {
          setUserNichos([]);
        }
      }
    });

    if (Platform.OS !== 'web') {
      // Configurar notificações push
      registerForPushNotificationsAsync();

      // Listeners (opcional, para lidar com notificações recebidas)
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        // Pode tratar notificações recebidas aqui
      });
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        // Pode tratar resposta do usuário à notificação
      });
    }
    // Mostrar modal de avaliação após alguns segundos
    const rateTimeout = setTimeout(() => setShowRateModal(true), 8000);
    return () => {
      if (Platform.OS !== 'web') {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      }
      clearTimeout(rateTimeout);
    };
  }, []);
  // Função para abrir a loja de apps
  const handleOpenStore = () => {
    const url = Platform.OS === 'ios'
      ? 'itms-apps://itunes.apple.com/app/idYOUR_APP_ID'
      : 'market://details?id=YOUR_PACKAGE_NAME';
    Linking.openURL(url);
    setShowRateModal(false);
  };

  // Função para registrar permissões e obter token
  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'web') return;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        return;
      }
      // const token = (await Notifications.getExpoPushTokenAsync()).data;
      // Salve o token se quiser enviar push remoto
    }
  }

  const exploreCategories: ExploreCategory[] = [
    { id: 'viral', name: 'Viral', icon: 'trending-up', color: ShamahColors.success, trending: true },
    { id: 'creative', name: 'Criativo', icon: 'color-palette', color: ShamahColors.accent, trending: false },
    { id: 'business', name: 'Negócios', icon: 'briefcase', color: ShamahColors.warning, trending: true },
    { id: 'lifestyle', name: 'Lifestyle', icon: 'heart', color: ShamahColors.error, trending: false },
    { id: 'tech', name: 'Tech', icon: 'phone-portrait', color: ShamahColors.accent, trending: true },
    { id: 'education', name: 'Educação', icon: 'school', color: ShamahColors.primary, trending: false },
  ];

  // Mock de tendências por nicho
  const allTrendingTopicsData: TrendingTopic[] = [
    {
      id: '1',
      title: 'IA para Criadores de Conteúdo',
      engagement: 89,
      category: 'Tech',
      hashtags: ['#IA', '#Content', '#Creator']
    },
    {
      id: '2',
      title: 'Tendências TikTok 2025',
      engagement: 95,
      category: 'Viral',
      hashtags: ['#TikTok', '#Trends', '#2025']
    },
    {
      id: '3',
      title: 'Monetização no Instagram',
      engagement: 87,
      category: 'Business',
      hashtags: ['#Instagram', '#Money', '#Creator']
    },
    {
      id: '4',
      title: 'Louvores em Alta',
      engagement: 92,
      category: 'Gospel',
      hashtags: ['#Gospel', '#Louvor', '#Adoração']
    },
    {
      id: '5',
      title: 'Desafios Engraçados',
      engagement: 90,
      category: 'Humor',
      hashtags: ['#Humor', '#Desafio', '#Risada']
    },
    {
      id: '6',
      title: 'Treinos Rápidos',
      engagement: 88,
      category: 'Fitness',
      hashtags: ['#Fitness', '#Treino', '#Saúde']
    },
    {
      id: '7',
      title: 'Dicas de Negócios',
      engagement: 85,
      category: 'Negócios',
      hashtags: ['#Negócios', '#Empreender', '#Dica']
    },
    {
      id: '8',
      title: 'Aulas Rápidas',
      engagement: 83,
      category: 'Educação',
      hashtags: ['#Educação', '#Aprender', '#Dica']
    },
    {
      id: '9',
      title: 'Tendências Tech',
      engagement: 91,
      category: 'Tech',
      hashtags: ['#Tech', '#Tendência', '#Inovação']
    },
  ];

  // Filtrar tendências conforme nichos do usuário
  const trendingTopicsData = userNichos.length > 0
    ? allTrendingTopicsData.filter(topic => userNichos.some(nicho => topic.category.toLowerCase().includes(nicho.toLowerCase())))
    : allTrendingTopicsData;

  const categories = [
    { id: 'all', name: 'Todos', icon: 'apps' },
    { id: 'personal', name: 'Para Você', icon: 'person' },
    { id: 'trending', name: 'Trending', icon: 'trending-up' },
    { id: 'business', name: 'Negócios', icon: 'briefcase' },
    { id: 'creative', name: 'Criativo', icon: 'color-palette' },
    { id: 'tech', name: 'Tecnologia', icon: 'phone-portrait' },
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category.toLowerCase().includes(selectedCategory);
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePostPress = (post: BlogPost) => {
    setSelectedPost(post);
    setShowModal(true);
    markAsRead(post.id);
  };

  const handleShare = async (post: BlogPost) => {
    try {
      await Share.share({
        message: `${post.title}\n\n${post.excerpt}`,
        title: post.title,
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const handleSave = (post: BlogPost) => {
    savePost(post.id);
    Alert.alert('Sucesso', 'Post salvo com sucesso!');
  };

  if (isLoading) {
    return <ShamahLoadingScreen visible={true} />;
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Blog IA</Text>
      <Text style={styles.subtitle}>Conteúdo personalizado para inspirar</Text>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={ShamahColors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar conteúdo..."
          placeholderTextColor={ShamahColors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
      >
        {[
          { id: 'blog', name: 'Blog IA', icon: 'library' },
          { id: 'explore', name: 'Explorar', icon: 'compass' },
          { id: 'trends', name: 'Tendências', icon: 'trending-up' },
          { id: 'insights', name: 'Insights', icon: 'analytics' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.id as any)}
          >
            <Ionicons 
              name={tab.icon + '-outline'}
              size={24}
              color={activeTab === tab.id ? ShamahColors.accent : 'rgba(255,255,255,0.7)'}
              style={{ textShadowColor: activeTab === tab.id ? ShamahColors.accent : '#222', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}
            />
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderBlogContent = () => (
    <View style={styles.blogContent}>
      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.activeCategoryButton
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons 
              name={category.icon as any} 
              size={16} 
              color={selectedCategory === category.id ? '#fff' : ShamahColors.textSecondary} 
            />
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category.id && styles.activeCategoryButtonText
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Posts */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <AnimatedCard index={index} style={styles.postCard}>
            <TouchableOpacity onPress={() => handlePostPress(item)}>
              <View style={styles.postHeader}>
                <View style={styles.postMeta}>
                  <View style={[styles.categoryBadge, { backgroundColor: ShamahColors.accent + '20' }]}>
                    <Text style={[styles.categoryBadgeText, { color: ShamahColors.accent }]}>
                      {item.category}
                    </Text>
                  </View>
                  <Text style={styles.readTime}>{item.readTime}</Text>
                </View>
                
                <View style={styles.engagementStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="heart" size={14} color={ShamahColors.textSecondary} />
                    <Text style={styles.statText}>234</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="share-social" size={14} color={ShamahColors.textSecondary} />
                    <Text style={styles.statText}>45</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="chatbubble" size={14} color={ShamahColors.textSecondary} />
                    <Text style={styles.statText}>12</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postExcerpt}>{item.excerpt}</Text>

              <View style={styles.postFooter}>
                <View style={styles.authorInfo}>
                  <Text style={styles.authorName}>{item.author}</Text>
                  <Text style={styles.postDate}>{new Date(item.publishedAt).toLocaleDateString()}</Text>
                </View>

                <View style={styles.postActions}>
                  <TouchableOpacity onPress={() => handleSave(item)} style={styles.actionButton}>
                    <Ionicons name="bookmark-outline" size={20} color={ShamahColors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleShare(item)} style={styles.actionButton}>
                    <Ionicons name="share-outline" size={20} color={ShamahColors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </AnimatedCard>
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshContent}
            colors={[ShamahColors.accent]}
            tintColor={ShamahColors.accent}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );

  const renderExploreContent = () => (
    <View style={styles.exploreContent}>
      <Text style={styles.sectionTitle}>Explorar por Categoria</Text>
      <View style={styles.categoriesGrid}>
        {exploreCategories.map((category, index) => (
          <TouchableOpacity
            key={category.id}
            style={styles.exploreCategory}
            onPress={() => setSelectedCategory(category.id)}
          >
            <LinearGradient
              colors={[category.color, category.color + '80']}
              style={styles.exploreCategoryGradient}
            >
              <Ionicons name={category.icon as any} size={32} color="white" />
              <Text style={styles.exploreCategoryName}>{category.name}</Text>
              {category.trending && (
                <View style={styles.trendingBadge}>
                  <Text style={styles.trendingBadgeText}>🔥</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Criadores em Destaque</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {['@criador1', '@criador2', '@criador3', '@criador4'].map((creator, index) => (
          <AnimatedCard key={creator} index={index} style={styles.creatorCard}>
            <View style={styles.creatorAvatar}>
              <Text style={styles.creatorInitial}>{creator[1].toUpperCase()}</Text>
            </View>
            <Text style={styles.creatorName}>{creator}</Text>
            <Text style={styles.creatorFollowers}>10.5K seguidores</Text>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Seguir</Text>
            </TouchableOpacity>
          </AnimatedCard>
        ))}
      </ScrollView>
    </View>
  );

  const renderTrendsContent = () => (
    <View style={styles.trendsContent}>
      <Text style={styles.sectionTitle}>Mapa de Tendências ao Vivo</Text>
      {/* Alerta de nichos em alta */}
      {showNichoAlert && userNichos.length > 0 && (
        <View style={{ backgroundColor: ShamahColors.accent, padding: 12, borderRadius: 12, marginBottom: 16 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>
            🚀 Nichos em alta agora: {userNichos.slice(0, 2).join(', ')}
          </Text>
        </View>
      )}
      {userNichos.length > 0 ? (
        <Text style={{ color: ShamahColors.accent, marginBottom: 12 }}>
          Tendências personalizadas para: {userNichos.join(', ')}
        </Text>
      ) : (
        <Text style={{ color: ShamahColors.textSecondary, marginBottom: 12 }}>
          Veja as tendências mais quentes do momento!
        </Text>
      )}
      {trendingTopicsData.length === 0 ? (
        <Text style={{ color: ShamahColors.textSecondary }}>
          Nenhuma tendência encontrada para seus nichos. Experimente adicionar mais nichos no seu perfil!
        </Text>
      ) : (
        trendingTopicsData.map((topic, index) => (
          <AnimatedCard key={topic.id} index={index} style={styles.trendCard}>
            <View style={styles.trendHeader}>
              <Text style={styles.trendTitle}>{topic.title}</Text>
              <View style={styles.engagementBadge}>
                <Text style={styles.engagementText}>{topic.engagement}%</Text>
              </View>
            </View>
            <Text style={styles.trendCategory}>{topic.category}</Text>
            <View style={styles.hashtagsContainer}>
              {topic.hashtags.map(hashtag => (
                <View key={hashtag} style={styles.hashtag}>
                  <Text style={styles.hashtagText}>{hashtag}</Text>
                </View>
              ))}
            </View>
          </AnimatedCard>
        ))
      )}
    </View>
  );

  const renderInsightsContent = () => (
    <View style={styles.insightsContent}>
      <AIInsightsDashboard />
    </View>
  );

  // Exibir alerta ao abrir a aba de tendências e disparar notificação local
  useEffect(() => {
    if (activeTab === 'trends' && userNichos.length > 0) {
      setShowNichoAlert(true);
      const timer = setTimeout(() => setShowNichoAlert(false), 6000);
      // Notificação local simples (apenas mobile)
      if (Platform.OS !== 'web') {
        Notifications.scheduleNotificationAsync({
          content: {
            title: '🚀 Nichos em alta!',
            body: `Confira: ${userNichos.slice(0, 2).join(', ')} estão bombando agora!`,
          },
          trigger: null, // dispara imediatamente
        });
      }
      return () => clearTimeout(timer);
    }
  }, [activeTab, userNichos]);

  const renderContent = () => {
    switch (activeTab) {
      case 'blog':
        return renderBlogContent();
      case 'explore':
        return renderExploreContent();
      case 'trends':
        return renderTrendsContent();
      case 'insights':
        return renderInsightsContent();
      default:
        return renderBlogContent();
    }
  };

  return (
    <AnimatedScreen>
      <StatusBar barStyle="light-content" backgroundColor={ShamahColors.primary} />
      <LinearGradient
        colors={[ShamahColors.primary, ShamahColors.secondary, ShamahColors.accent]}
        style={styles.container}
      >
        {renderHeader()}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {renderContent()}
        </ScrollView>

        {/* Botão flutuante de ajuda */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 36,
            right: 24,
            backgroundColor: ShamahColors.accent,
            borderRadius: 32,
            padding: 16,
            elevation: 6,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            zIndex: 100
          }}
          onPress={() => setShowHelpChat(true)}
        >
          <Ionicons name="chatbubbles" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Modal do Chat de Ajuda */}
        <Modal
          visible={showHelpChat}
          animationType="slide"
          transparent
          onRequestClose={() => setShowHelpChat(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={{ width: '100%' }}
            >
              <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, minHeight: 420, maxHeight: '80%', padding: 18 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Ionicons name="chatbubbles" size={24} color={ShamahColors.accent} />
                  <Text style={{ fontWeight: 'bold', fontSize: 18, color: ShamahColors.accent, marginLeft: 8 }}>Ajuda ao Usuário</Text>
                  <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => setShowHelpChat(false)}>
                    <Ionicons name="close" size={24} color={ShamahColors.textPrimary} />
                  </TouchableOpacity>
                </View>
                <ScrollView
                  style={{ flex: 1, marginBottom: 12 }}
                  contentContainerStyle={{ paddingBottom: 12 }}
                  showsVerticalScrollIndicator={false}
                >
                  {chatMessages.map((msg, idx) => (
                    <View key={idx} style={{
                      alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
                      backgroundColor: msg.from === 'user' ? ShamahColors.accent : (msg.from === 'specialist' ? ShamahColors.success : ShamahColors.neutral[100]),
                      borderRadius: 16,
                      marginBottom: 8,
                      padding: 10,
                      maxWidth: '80%'
                    }}>
                      <Text style={{ color: msg.from === 'user' ? '#fff' : (msg.from === 'specialist' ? '#fff' : ShamahColors.textPrimary), fontSize: 15 }}>
                        {msg.text}
                      </Text>
                    </View>
                  ))}
                  {waitingSpecialist && (
                    <View style={{ alignSelf: 'flex-start', backgroundColor: ShamahColors.success, borderRadius: 16, marginBottom: 8, padding: 10, maxWidth: '80%' }}>
                      <Text style={{ color: '#fff', fontSize: 15 }}>Aguarde, um especialista está entrando na conversa...</Text>
                    </View>
                  )}
                </ScrollView>
                {/* Input e botões */}
                {!waitingSpecialist && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      style={{ flex: 1, borderWidth: 1, borderColor: ShamahColors.neutral[200], borderRadius: 16, padding: 10, fontSize: 15, marginRight: 8, color: ShamahColors.textPrimary }}
                      placeholder="Digite sua dúvida..."
                      placeholderTextColor={ShamahColors.textSecondary}
                      value={chatInput}
                      onChangeText={setChatInput}
                      onSubmitEditing={handleSendChat}
                      editable={!waitingSpecialist}
                      returnKeyType="send"
                    />
                    <TouchableOpacity onPress={handleSendChat} disabled={!chatInput.trim()}>
                      <Ionicons name="send" size={24} color={chatInput.trim() ? ShamahColors.accent : ShamahColors.neutral[300]} />
                    </TouchableOpacity>
                  </View>
                )}
                {/* Botão para escalar para especialista */}
                {!waitingSpecialist && chatMessages.some(m => m.text.includes('Deseja conversar com um especialista humano?')) && (
                  <TouchableOpacity
                    style={{ marginTop: 12, backgroundColor: ShamahColors.success, borderRadius: 12, padding: 12, alignItems: 'center' }}
                    onPress={handleEscalate}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Sim, quero falar com um especialista</Text>
                  </TouchableOpacity>
                )}
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>

        {/* Modal do Post */}
        <Modal
          visible={showModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowModal(false)}
        >
          {selectedPost && (
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  style={styles.modalCloseButton}
                  onPress={() => setShowModal(false)}
                >
                  <Ionicons name="close" size={24} color={ShamahColors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{selectedPost.title}</Text>
              </View>
              
              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalText}>{selectedPost.excerpt}</Text>
                <Text style={styles.modalText}>
                  Este é um exemplo de conteúdo completo do post. Em uma implementação real, 
                  aqui seria carregado o conteúdo completo do artigo do blog.
                </Text>
              </ScrollView>
            </View>
          )}
        </Modal>

        {/* Modal de avaliação */}
        <Modal
          visible={showRateModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowRateModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 28, alignItems: 'center', width: 320 }}>
              <Ionicons name="star" size={48} color={ShamahColors.accent} style={{ marginBottom: 12 }} />
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: ShamahColors.accent, marginBottom: 8 }}>Avalie o Shamah!</Text>
              <Text style={{ fontSize: 15, color: ShamahColors.textPrimary, textAlign: 'center', marginBottom: 18 }}>
                Sua avaliação é muito importante para que mais pessoas conheçam o app e para continuarmos melhorando!
              </Text>
              <TouchableOpacity
                style={{ backgroundColor: ShamahColors.accent, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 32, marginBottom: 8 }}
                onPress={handleOpenStore}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Avaliar agora</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowRateModal(false)}>
                <Text style={{ color: ShamahColors.textSecondary, fontSize: 15 }}>Agora não</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  tabsContainer: {
    marginBottom: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  activeTab: {
    backgroundColor: ShamahColors.accent,
  },
  tabText: {
    marginLeft: 8,
    color: ShamahColors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  blogContent: {
    padding: 20,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ShamahColors.neutral[100],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  activeCategoryButton: {
    backgroundColor: ShamahColors.accent,
  },
  categoryButtonText: {
    marginLeft: 8,
    color: ShamahColors.textSecondary,
    fontWeight: '500',
  },
  activeCategoryButtonText: {
    color: '#fff',
  },
  listContainer: {
    paddingBottom: 100,
  },
  postCard: {
    marginBottom: 20,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  readTime: {
    fontSize: 12,
    color: ShamahColors.textSecondary,
  },
  engagementStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  statText: {
    fontSize: 12,
    color: ShamahColors.textSecondary,
    marginLeft: 4,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ShamahColors.textPrimary,
    marginBottom: 8,
    lineHeight: 24,
  },
  postExcerpt: {
    fontSize: 14,
    color: ShamahColors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: ShamahColors.textPrimary,
  },
  postDate: {
    fontSize: 12,
    color: ShamahColors.textSecondary,
    marginTop: 2,
  },
  postActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  exploreContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ShamahColors.textPrimary,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  exploreCategory: {
    width: width < 500 ? '100%' : (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  exploreCategoryGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    position: 'relative',
  },
  exploreCategoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  trendingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendingBadgeText: {
    fontSize: 12,
  },
  creatorCard: {
    width: 140,
    padding: 16,
    alignItems: 'center',
    marginRight: 16,
  },
  creatorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: ShamahColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  creatorInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  creatorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: ShamahColors.textPrimary,
    marginBottom: 4,
  },
  creatorFollowers: {
    fontSize: 12,
    color: ShamahColors.textSecondary,
    marginBottom: 12,
  },
  followButton: {
    backgroundColor: ShamahColors.accent,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  followButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  trendsContent: {
    padding: 20,
  },
  trendCard: {
    padding: 20,
    marginBottom: 16,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ShamahColors.textPrimary,
    flex: 1,
  },
  engagementBadge: {
    backgroundColor: ShamahColors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  engagementText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: ShamahColors.success,
  },
  trendCategory: {
    fontSize: 14,
    color: ShamahColors.textSecondary,
    marginBottom: 12,
  },
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hashtag: {
    backgroundColor: ShamahColors.neutral[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  hashtagText: {
    fontSize: 12,
    color: ShamahColors.textSecondary,
  },
  insightsContent: {
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: ShamahColors.neutral[200],
  },
  modalCloseButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ShamahColors.textPrimary,
    marginLeft: 16,
    flex: 1,
  },
  modalBody: {
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    color: ShamahColors.textPrimary,
    lineHeight: 24,
  },
});
