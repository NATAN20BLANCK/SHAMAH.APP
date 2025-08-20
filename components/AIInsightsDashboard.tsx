import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ShamahColors } from '../constants/Colors';

const { width } = Dimensions.get('window');

interface AIInsight {
  id: string;
  title: string;
  description: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  category: 'engagement' | 'reach' | 'conversion' | 'content' | 'timing';
  actionable: boolean;
  recommendation?: string;
}

interface AIInsightsDashboardProps {
  userPreferences?: any;
  recentPerformance?: any;
  onInsightTap?: (insight: AIInsight) => void;
}

const AIInsightsDashboard: React.FC<AIInsightsDashboardProps> = ({
  userPreferences,
  recentPerformance,
  onInsightTap
}) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [animationValue] = useState(new Animated.Value(0));

  const categories = [
    { id: 'all', name: 'Todos', icon: 'apps' },
    { id: 'engagement', name: 'Engajamento', icon: 'heart' },
    { id: 'reach', name: 'Alcance', icon: 'trending-up' },
    { id: 'content', name: 'Conteúdo', icon: 'create' },
    { id: 'timing', name: 'Timing', icon: 'time' },
  ];

  useEffect(() => {
    generateAIInsights();
    startAnimation();
  }, [userPreferences, recentPerformance]);

  const startAnimation = () => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const generateAIInsights = () => {
    const now = new Date();
    const hour = now.getHours();
    
    const generatedInsights: AIInsight[] = [
      {
        id: '1',
        title: '🎯 Horário Ideal Detectado',
        description: 'Seus posts entre 15h-17h têm 73% mais engajamento',
        value: '+73%',
        trend: 'up',
        confidence: 94,
        category: 'timing',
        actionable: true,
        recommendation: 'Programe seus posts para 15:30h para máximo alcance'
      },
      {
        id: '2',
        title: '🚀 Hashtags Poderosas',
        description: 'IA detectou 5 hashtags que triplicam seu alcance',
        value: '3x',
        trend: 'up',
        confidence: 88,
        category: 'reach',
        actionable: true,
        recommendation: 'Use #motivationmonday #entrepreneurlife #contentcreator'
      },
      {
        id: '3',
        title: '💡 Tipo de Conteúdo em Alta',
        description: 'Carrosels educativos estão com 156% mais saves',
        value: '+156%',
        trend: 'up',
        confidence: 92,
        category: 'content',
        actionable: true,
        recommendation: 'Crie mais carrosels com dicas práticas e tutoriais'
      },
      {
        id: '4',
        title: '📊 Tendência de Engajamento',
        description: 'Seu engajamento cresceu 34% nas últimas 2 semanas',
        value: '+34%',
        trend: 'up',
        confidence: 96,
        category: 'engagement',
        actionable: false,
        recommendation: 'Continue a estratégia atual, está funcionando!'
      },
      {
        id: '5',
        title: '⚡ Oportunidade Viral',
        description: 'Tendência "IA em Marketing" com potencial de 500k views',
        value: '500k',
        trend: 'up',
        confidence: 85,
        category: 'reach',
        actionable: true,
        recommendation: 'Crie conteúdo sobre IA em marketing nas próximas 24h'
      },
      {
        id: '6',
        title: '🎨 Paleta de Cores Otimizada',
        description: 'Posts com tons azuis e brancos têm 45% mais saves',
        value: '+45%',
        trend: 'up',
        confidence: 78,
        category: 'content',
        actionable: true,
        recommendation: 'Use mais cores azuis (#4A90E2) e branco em seus designs'
      },
      {
        id: '7',
        title: '📱 Formato Preferido da Audiência',
        description: 'Sua audiência prefere vídeos de 15-30 segundos',
        value: '15-30s',
        trend: 'stable',
        confidence: 90,
        category: 'content',
        actionable: true,
        recommendation: 'Mantenha seus Reels entre 15-30 segundos'
      },
      {
        id: '8',
        title: '🎯 Call-to-Action Eficaz',
        description: 'CTAs com "Salve este post" geram 67% mais interação',
        value: '+67%',
        trend: 'up',
        confidence: 82,
        category: 'engagement',
        actionable: true,
        recommendation: 'Use "Salve este post" em conteúdos educativos'
      }
    ];

    setInsights(generatedInsights);
  };

  const getFilteredInsights = () => {
    if (selectedCategory === 'all') {
      return insights;
    }
    return insights.filter(insight => insight.category === selectedCategory);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      default: return 'remove';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return ShamahColors.success;
      case 'down': return ShamahColors.error;
      default: return ShamahColors.textSecondary;
    }
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'engagement': ShamahColors.accent,
      'reach': ShamahColors.primary,
      'conversion': ShamahColors.success,
      'content': ShamahColors.warning,
      'timing': '#8B5CF6'
    };
    return colorMap[category] || ShamahColors.textPrimary;
  };

  const renderInsightCard = (insight: AIInsight, index: number) => {
    const translateY = animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });

    const opacity = animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <Animated.View
        key={insight.id}
        style={[
          styles.insightCard,
          {
            transform: [{ translateY }],
            opacity,
          }
        ]}
      >
        <TouchableOpacity
          onPress={() => onInsightTap?.(insight)}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[
              getCategoryColor(insight.category) + '15',
              getCategoryColor(insight.category) + '08'
            ]}
            style={styles.insightGradient}
          >
            {/* Header */}
            <View style={styles.insightHeader}>
              <View style={styles.insightMeta}>
                <View style={[
                  styles.categoryIndicator,
                  { backgroundColor: getCategoryColor(insight.category) + '20' }
                ]}>
                  <View style={[
                    styles.categoryDot,
                    { backgroundColor: getCategoryColor(insight.category) }
                  ]} />
                </View>
                
                <View style={styles.confidenceContainer}>
                  <Text style={styles.confidenceText}>
                    {insight.confidence}% confiança
                  </Text>
                </View>
              </View>

              <View style={styles.trendContainer}>
                <Ionicons
                  name={getTrendIcon(insight.trend) as any}
                  size={16}
                  color={getTrendColor(insight.trend)}
                />
                <Text style={[styles.trendValue, { color: getTrendColor(insight.trend) }]}>
                  {insight.value}
                </Text>
              </View>
            </View>

            {/* Content */}
            <Text style={styles.insightTitle}>{insight.title}</Text>
            <Text style={styles.insightDescription}>{insight.description}</Text>

            {/* Recommendation */}
            {insight.actionable && insight.recommendation && (
              <View style={styles.recommendationContainer}>
                <View style={styles.recommendationHeader}>
                  <Ionicons name="bulb" size={14} color={ShamahColors.accent} />
                  <Text style={styles.recommendationLabel}>Recomendação da IA</Text>
                </View>
                <Text style={styles.recommendationText}>{insight.recommendation}</Text>
              </View>
            )}

            {/* Action Indicator */}
            {insight.actionable && (
              <View style={styles.actionIndicator}>
                <Ionicons name="arrow-forward" size={16} color={ShamahColors.primary} />
                <Text style={styles.actionText}>Ação recomendada</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="analytics" size={24} color={ShamahColors.primary} />
          <Text style={styles.title}>Insights da IA</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={generateAIInsights}>
          <Ionicons name="refresh" size={20} color={ShamahColors.primary} />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive,
              { width: 120, justifyContent: 'center' }
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons
              name={category.icon as any}
              size={16}
              color={selectedCategory === category.id ? 'white' : ShamahColors.textSecondary}
              style={{ marginRight: 6 }}
            />
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category.id && styles.categoryButtonTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Insights Grid */}
      <View style={{ alignItems: 'center', width: '100%' }}>
        {getFilteredInsights().map((insight, index) => (
          <View key={insight.id} style={{ width: 340, maxWidth: '100%', marginBottom: 18 }}>
            {renderInsightCard(insight, index)}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: ShamahColors.borderLight,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ShamahColors.textPrimary,
    marginLeft: 8,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: ShamahColors.primary + '15',
  },
  categoriesContainer: {
    backgroundColor: ShamahColors.backgroundSecondary,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
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
  insightsContainer: {
    flex: 1,
    padding: 20,
  },
  insightCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  insightGradient: {
    padding: 20,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  confidenceContainer: {
    backgroundColor: ShamahColors.backgroundPrimary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 10,
    color: ShamahColors.textSecondary,
    fontWeight: '600',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ShamahColors.textPrimary,
    marginBottom: 6,
  },
  insightDescription: {
    fontSize: 14,
    color: ShamahColors.textSecondary,
    lineHeight: 20,
    marginBottom: 15,
  },
  recommendationContainer: {
    backgroundColor: ShamahColors.accent + '10',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: ShamahColors.accent,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  recommendationLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: ShamahColors.accent,
    marginLeft: 4,
  },
  recommendationText: {
    fontSize: 13,
    color: ShamahColors.textSecondary,
    lineHeight: 18,
  },
  actionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  actionText: {
    fontSize: 12,
    color: ShamahColors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default AIInsightsDashboard;
