import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

export default function PlanosScreen() {
  const [isAnnual, setIsAnnual] = useState(true);
  const params = useLocalSearchParams();
  const highlightPlan = params.highlightPlan as string;
  const alertSource = params.source === 'alert';
  const alertType = params.alertType as string;

  // Mensagem personalizada baseada no tipo de alerta
  const getAlertMessage = () => {
    if (!alertSource) return null;
    
    switch (alertType) {
      case 'posts':
        return '📝 Upgrade para publicações ilimitadas';
      case 'accounts':
        return '🔗 Conecte mais redes sociais';
      case 'storage':
        return '☁️ Mais espaço de armazenamento';
      case 'ai':
        return '🤖 IA avançada e ilimitada';
      case 'premium':
        return '⭐ Desbloqueie recursos premium';
      default:
        return '🚀 Plano recomendado para você';
    }
  };

  const plans = {
    annual: [
      {
        id: 'free',
        name: 'Plano Gratuito',
        subtitle: 'Comece Agora',
        price: 'R$ 0,00',
        period: 'ano',
        color: '#10b981',
        popular: false,
        features: [
          'Até 2 contas sociais conectadas',
          '20 publicações por mês',
          'Marca d\'água do Shamah Publi',
          'Templates básicos',
          'Suporte via email'
        ],
        trial: false
      },
      {
        id: 'creator',
        name: 'Plano Criador',
        subtitle: 'Economize R$ 99,80 por ano',
        price: 'R$ 199,00',
        period: 'ano',
        color: '#3b82f6',
        popular: false,
        features: [
          'Até 5 contas conectadas',
          '100 publicações/mês',
          'Postagens em carrossel',
          'Agendamento de posts',
          'Acesso a métricas básicas',
          'Templates premium',
          'Suporte prioritário'
        ],
        trial: true
      },
      {
        id: 'professional',
        name: 'Plano Profissional',
        subtitle: 'Mais Popular - Economize R$ 219,80 por ano',
        price: 'R$ 499,00',
        period: 'ano',
        color: '#8b5cf6',
        popular: true,
        features: [
          'Até 15 contas conectadas',
          'Publicações ilimitadas',
          'Carrossel + vídeos curtos',
          'Integração com IA avançada',
          'Estúdio de conteúdo completo',
          'Analytics detalhadas',
          'Suporte 24/7'
        ],
        trial: true
      },
      {
        id: 'agency',
        name: 'Plano Agência',
        subtitle: 'Economize R$ 419,80 por ano',
        price: 'R$ 899,00',
        period: 'ano',
        color: '#f59e0b',
        popular: false,
        features: [
          'Contas conectadas ilimitadas',
          'Publicações automáticas para múltiplos perfis',
          'Consultoria de crescimento viral',
          'Gerenciamento de equipe',
          'White-label disponível',
          'API personalizada',
          'Suporte dedicado'
        ],
        trial: true
      }
    ],
    monthly: [
      {
        id: 'free',
        name: 'Plano Gratuito',
        subtitle: 'Comece Agora',
        price: 'R$ 0,00',
        period: 'mês',
        color: '#10b981',
        popular: false,
        features: [
          'Até 2 contas sociais conectadas',
          '20 publicações por mês',
          'Marca d\'água do Shamah Publi',
          'Templates básicos',
          'Suporte via email'
        ],
        trial: false
      },
      {
        id: 'creator',
        name: 'Plano Criador',
        subtitle: 'Ideal para criadores de conteúdo',
        price: 'R$ 24,90',
        period: 'mês',
        color: '#3b82f6',
        popular: false,
        features: [
          'Até 5 contas conectadas',
          '100 publicações/mês',
          'Postagens em carrossel',
          'Agendamento de posts',
          'Acesso a métricas básicas',
          'Templates premium',
          'Suporte prioritário'
        ],
        trial: true
      },
      {
        id: 'professional',
        name: 'Plano Profissional',
        subtitle: 'Mais Popular entre criadores',
        price: 'R$ 59,90',
        period: 'mês',
        color: '#8b5cf6',
        popular: true,
        features: [
          'Até 15 contas conectadas',
          'Publicações ilimitadas',
          'Carrossel + vídeos curtos',
          'Integração com IA avançada',
          'Estúdio de conteúdo completo',
          'Analytics detalhadas',
          'Suporte 24/7'
        ],
        trial: true
      },
      {
        id: 'agency',
        name: 'Plano Agência',
        subtitle: 'Para agências e equipes',
        price: 'R$ 109,90',
        period: 'mês',
        color: '#f59e0b',
        popular: false,
        features: [
          'Contas conectadas ilimitadas',
          'Publicações automáticas para múltiplos perfis',
          'Consultoria de crescimento viral',
          'Gerenciamento de equipe',
          'White-label disponível',
          'API personalizada',
          'Suporte dedicado'
        ],
        trial: true
      }
    ]
  };

  const currentPlans = isAnnual ? plans.annual : plans.monthly;
  const savings = isAnnual ? 'Economize mais pagando por ano!' : 'Flexibilidade mensal, sem compromisso!';

  const handleUpgrade = (planId: string) => {
    // Aqui seria implementada a lógica de upgrade real
    console.log(`Iniciando upgrade para: ${planId}`);
    // Por enquanto, apenas mostra feedback visual
    alert(`Redirecionando para checkout do ${planId}...`);
  };

  return (
    <LinearGradient colors={['#1e3c72', '#2a5298']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>📆 Planos Shamah Publi</Text>
          {alertSource && alertType && (
            <View style={styles.alertBanner}>
              <Text style={styles.alertMessage}>{getAlertMessage()}</Text>
            </View>
          )}
          <Text style={styles.subtitle}>{savings}</Text>
        </View>
      </View>

      {/* Period Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleButton, !isAnnual && styles.activeToggle]}
          onPress={() => setIsAnnual(false)}
        >
          <Text style={[styles.toggleText, !isAnnual && styles.activeToggleText]}>Mensal</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleButton, isAnnual && styles.activeToggle]}
          onPress={() => setIsAnnual(true)}
        >
          <Text style={[styles.toggleText, isAnnual && styles.activeToggleText]}>Anual</Text>
        </TouchableOpacity>
      </View>

      {isAnnual && (
        <Text style={styles.savingsText}>
          💰 Obtenha 2 meses grátis - economize 17% com plano anual
        </Text>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentPlans.map((plan, index) => {
          const isHighlighted = highlightPlan === plan.id && alertSource;
          
          return (
            <View 
              key={plan.id} 
              style={[
                styles.planCard,
                isHighlighted && styles.highlightedCard
              ]}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>MAIS POPULAR</Text>
                </View>
              )}
              
              {isHighlighted && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>⭐ RECOMENDADO PARA VOCÊ</Text>
                </View>
              )}
            
            <View style={[
              styles.planHeader,
              isHighlighted && styles.planHeaderHighlighted
            ]}>
              <Text style={styles.planName}>{plan.name}</Text>
              {plan.subtitle && (
                <Text style={styles.planSubtitle}>{plan.subtitle}</Text>
              )}
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{plan.price}</Text>
                <Text style={styles.period}>/ {plan.period}</Text>
              </View>
            </View>

            <View style={styles.featuresContainer}>
              {plan.features.map((feature, featureIndex) => (
                <View key={featureIndex} style={styles.feature}>
                  <Ionicons name="checkmark-circle" size={20} color={plan.color} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={[
                styles.selectButton, 
                { backgroundColor: plan.color },
                plan.id === 'free' && styles.freeButton
              ]}
              onPress={() => handleUpgrade(plan.id)}
            >
              <Text style={[styles.selectButtonText, plan.id === 'free' && styles.freeButtonText]}>
                {plan.id === 'free' ? 'COMEÇAR GRÁTIS' : 'ESCOLHER PLANO'}
              </Text>
            </TouchableOpacity>

            {plan.trial && (
              <Text style={styles.trialText}>🧪 Teste grátis de 7 dias</Text>
            )}
          </View>
          );
        })}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Quer cancelar seu plano? Clique aqui • Precisa de ajuda ou deseja fazer alterações? 
            Entre em contato conosco em support@shamahpubli.com
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  alertBanner: {
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 4,
    alignSelf: 'center',
  },
  alertMessage: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  activeToggleText: {
    color: '#1f2937',
  },
  savingsText: {
    textAlign: 'center',
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  planCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  highlightedCard: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 3,
    borderColor: '#fbbf24',
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 12,
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    right: 20,
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    paddingVertical: 6,
    alignItems: 'center',
    zIndex: 1,
  },
  recommendedBadge: {
    position: 'absolute',
    top: 12,
    left: 20,
    right: 20,
    backgroundColor: '#fbbf24',
    borderRadius: 12,
    paddingVertical: 6,
    alignItems: 'center',
    zIndex: 1,
  },
  popularText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recommendedText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  planHeaderHighlighted: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  planName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  period: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 4,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 12,
    flex: 1,
  },
  selectButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  freeButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#10b981',
  },
  selectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  freeButtonText: {
    color: '#10b981',
  },
  trialText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 18,
  },
});
