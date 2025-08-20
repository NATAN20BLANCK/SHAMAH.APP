import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Share, Clipboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ShamahBackground from '../../components/ShamahBackground';
import ShamahCard from '../../components/ShamahCard';
import ShamahButton from '../../components/ShamahButton';
import { AnimatedScreen, AnimatedCard } from '../../components/ShamahAnimations';
import { ShamahTheme } from '../../constants/theme';
import { ShamahColors } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { useAffiliateSystem } from '../../hooks/useAffiliateSystem';
import { useLoading } from '../../contexts/LoadingContext';

interface Referral {
  id: string;
  name: string;
  email: string;
  joinDate: Date;
  planType: 'Básico' | 'Premium' | 'Pro';
  commission: number;
  status: 'active' | 'cancelled' | 'pending';
}

interface RankLevel {
  level: number;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  minReferrals: number;
  bonusMultiplier: number;
  badge: string;
}

const rankLevels: RankLevel[] = [
  { level: 1, name: 'Iniciante', icon: 'leaf', color: ShamahColors.success, minReferrals: 0, bonusMultiplier: 1.0, badge: '🌱' },
  { level: 2, name: 'Influencer', icon: 'trending-up', color: ShamahColors.primary, minReferrals: 5, bonusMultiplier: 1.2, badge: '🔥' },
  { level: 3, name: 'Especialista', icon: 'star', color: ShamahColors.warning, minReferrals: 15, bonusMultiplier: 1.5, badge: '⭐' },
  { level: 4, name: 'Embaixador', icon: 'trophy', color: ShamahColors.secondary, minReferrals: 35, bonusMultiplier: 2.0, badge: '🏆' },
  { level: 5, name: 'Mestre', icon: 'diamond', color: '#9C27B0', minReferrals: 75, bonusMultiplier: 2.5, badge: '💎' },
];

const commissionRates = {
  'Básico': 15.00,    // R$ 15 por indicação do plano básico
  'Premium': 30.00,   // R$ 30 por indicação do plano premium
  'Pro': 50.00,       // R$ 50 por indicação do plano pro
};

export default function AfiliadosScreen() {
  const { user } = useAuth();
  const { showSyncLoading, hideLoading } = useLoading();
  const { 
    affiliateData, 
    loading, 
    regenerateCode, 
    getShareMessage, 
    generateAffiliateLink,
    getNextRank, 
    getProgressToNextRank 
  } = useAffiliateSystem();

  const currentPlan = user?.plan || 'Gratuito';
  const isEligibleForAffiliate = true; // Modo demo - acesso liberado para todos

  const shareAffiliateCode = async () => {
    if (!isEligibleForAffiliate) {
      Alert.alert(
        'Funcionalidade Restrita',
        'O sistema de afiliados está disponível apenas para assinantes do plano Básico ou superior.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ver Perfil', onPress: () => console.log('Navegar para perfil') }
        ]
      );
      return;
    }

    try {
      showSyncLoading('Preparando compartilhamento...');
      
      const shareMessage = getShareMessage();
      const affiliateLink = generateAffiliateLink('direct_share');
      
      await Share.share({
        message: shareMessage,
        url: affiliateLink,
        title: 'Shamah Publi - Código de Indicação',
      });
      
      hideLoading();
    } catch (error) {
      hideLoading();
      console.error('Erro ao compartilhar:', error);
    }
  };

  const copyCodeToClipboard = () => {
    Clipboard.setString(affiliateData.userCode);
    Alert.alert('Copiado!', 'Código de afiliado copiado para a área de transferência.');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { text: 'Ativo', color: ShamahColors.success, icon: 'checkmark-circle' };
      case 'pending':
        return { text: 'Pendente', color: ShamahColors.warning, icon: 'time' };
      case 'cancelled':
        return { text: 'Cancelado', color: ShamahColors.danger, icon: 'close-circle' };
      default:
        return { text: 'Desconhecido', color: ShamahColors.neutral[500], icon: 'help-circle' };
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const nextRank = getNextRank();
  const progressToNext = getProgressToNextRank();

  const insights = [
    { icon: 'grid-outline', label: 'Todos' },
    { icon: 'heart-outline', label: 'Engajamento' },
    { icon: 'trending-up-outline', label: 'Alcance' },
    { icon: 'create-outline', label: 'Conteúdo' },
    { icon: 'time-outline', label: 'Timing' },
  ];
  const [selected, setSelected] = useState(1); // Engajamento como padrão

  if (loading) {
    return (
      <ShamahBackground variant="cosmic" style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </ShamahBackground>
    );
  }

  return (
    <ShamahBackground variant="cosmic" style={styles.container}>
      <AnimatedScreen>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.brandSection}>
                <View style={styles.brandIcon}>
                  <View style={styles.brandIconInner} />
                </View>
                <View style={styles.brandText}>
                  <Text style={styles.title}>Programa de Parcerias</Text>
                  <Text style={styles.subtitle}>Maximize seus resultados com nossa rede</Text>
                </View>
              </View>
              
              {/* Métricas Principais */}
              <View style={styles.metricsContainer}>
                <View style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                    <Text style={styles.metricValue}>{formatCurrency(affiliateData.totalEarnings)}</Text>
                    <View style={styles.metricTrend}>
                      <Text style={styles.trendText}>+12%</Text>
                    </View>
                  </View>
                  <Text style={styles.metricLabel}>Receita Total</Text>
                </View>
                
                <View style={styles.metricDivider} />
                
                <View style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                    <Text style={styles.metricValue}>{affiliateData.totalReferrals}</Text>
                    <View style={styles.metricBadge}>
                      <Text style={styles.badgeText}>{affiliateData.currentRank.name}</Text>
                    </View>
                  </View>
                  <Text style={styles.metricLabel}>Parcerias Ativas</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Banner Modo Demo */}
          {currentPlan === 'Gratuito' && (
            <AnimatedCard index={1}>
              <ShamahCard 
                title="🎮 Modo Demonstração"
                subtitle="Teste todas as funcionalidades do sistema de afiliados"
                variant="gradient"
              >
                <View style={styles.demoBanner}>
                  <Text style={styles.demoText}>
                    🎯 Este é o modo demo! Você pode testar todas as funcionalidades.
                  </Text>
                  <Text style={styles.demoSubtext}>
                    💡 Para ganhos reais, assine qualquer plano pago.
                  </Text>
                </View>
              </ShamahCard>
            </AnimatedCard>
          )}

          {/* Verificação de Plano - Desabilitada para modo demo */}
          {false && !isEligibleForAffiliate && (
            <AnimatedCard index={1}>
              <ShamahCard variant="glass" style={styles.restrictedCard}>
                <View style={styles.restrictedContent}>
                  <Ionicons name="lock-closed" size={48} color={ShamahColors.warning} />
                  <Text style={styles.restrictedTitle}>Funcionalidade Restrita</Text>
                  <Text style={styles.restrictedText}>
                    O sistema de afiliados está disponível apenas para assinantes do plano Básico ou superior.
                  </Text>
                  <ShamahButton
                    title="Assinar Plano"
                    variant="warning"
                    icon="diamond"
                    onPress={() => console.log('Assinar plano')}
                    style={styles.upgradeButton}
                    glow={true}
                  />
                </View>
              </ShamahCard>
            </AnimatedCard>
          )}

          {/* Conteúdo Principal - Apenas para assinantes */}
          {isEligibleForAffiliate && (
            <>
              {/* Dashboard de Performance */}
              <AnimatedCard index={1}>
                <View style={styles.performanceCard}>
                  <View style={styles.performanceHeader}>
                    <Text style={styles.performanceTitle}>Dashboard de Performance</Text>
                    <View style={styles.performancePeriod}>
                      <Text style={styles.periodText}>Últimos 30 dias</Text>
                    </View>
                  </View>
                  
                  <View style={styles.performanceGrid}>
                    <View style={styles.performanceMetric}>
                      <Text style={styles.performanceNumber}>{formatCurrency(affiliateData.totalEarnings)}</Text>
                      <Text style={styles.performanceLabel}>Receita Gerada</Text>
                      <View style={styles.performanceBar}>
                        <View style={[styles.performanceFill, { width: '85%', backgroundColor: '#10b981' }]} />
                      </View>
                    </View>
                    
                    <View style={styles.performanceMetric}>
                      <Text style={styles.performanceNumber}>{formatCurrency(affiliateData.pendingEarnings)}</Text>
                      <Text style={styles.performanceLabel}>Aguardando Pagamento</Text>
                      <View style={styles.performanceBar}>
                        <View style={[styles.performanceFill, { width: '60%', backgroundColor: '#f59e0b' }]} />
                      </View>
                    </View>
                    
                    <View style={styles.performanceMetric}>
                      <Text style={styles.performanceNumber}>{affiliateData.activeReferrals}</Text>
                      <Text style={styles.performanceLabel}>Clientes Ativos</Text>
                      <View style={styles.performanceBar}>
                        <View style={[styles.performanceFill, { width: '75%', backgroundColor: '#3b82f6' }]} />
                      </View>
                    </View>
                    
                    <View style={styles.performanceMetric}>
                      <Text style={styles.performanceNumber}>{((affiliateData.currentRank.bonusMultiplier - 1) * 100).toFixed(0)}%</Text>
                      <Text style={styles.performanceLabel}>Multiplicador Bônus</Text>
                      <View style={styles.performanceBar}>
                        <View style={[styles.performanceFill, { width: '90%', backgroundColor: '#8b5cf6' }]} />
                      </View>
                    </View>
                  </View>
                </View>
              </AnimatedCard>

              {/* Ranking */}
              <AnimatedCard index={2}>
                <ShamahCard 
                  title="Seu Ranking"
                  subtitle="Evolua e ganhe mais comissões"
                  variant="glass"
                  style={styles.cardTitle}
                >
                  <View style={styles.rankCard}>
                    <View style={styles.currentRank}>
                      <View style={[styles.rankBadge, {
                        backgroundColor: ShamahColors.warning,
                        shadowColor: ShamahColors.warning,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 6,
                        elevation: 6,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }]}> 
                        <Ionicons name="star" size={32} color="#fff" />
                      </View>
                      <View style={styles.rankInfo}>
                        <Text style={styles.rankName}>Expert</Text>
                        <Text style={styles.rankMultiplier}>
                          Bônus: 10%
                        </Text>
                      </View>
                    </View>

                    {nextRank && (
                      <View style={styles.nextRankSection}>
                        <Text style={styles.nextRankTitle}>
                          Próximo: {nextRank.name} ({nextRank.minReferrals} indicações)
                        </Text>
                        <View style={styles.progressBar}>
                          <View 
                            style={[styles.progressFill, { width: `${Math.min(progressToNext, 100)}%` }]}
                          />
                        </View>
                        <Text style={styles.progressText}>
                          {affiliateData.totalReferrals} de {nextRank.minReferrals} indicações
                        </Text>
                      </View>
                    )}
                  </View>
                </ShamahCard>
              </AnimatedCard>

              {/* Código de Afiliado */}
              <AnimatedCard index={3}>
                <ShamahCard 
                  title="Seu Código de Afiliado"
                  subtitle="Compartilhe e ganhe comissões"
                  variant="glass"
                  style={styles.cardTitle}
                >
                  <View style={styles.codeSection}>
                    <View style={styles.codeDisplay}>
                      <Text style={styles.codeText}>{affiliateData.userCode}</Text>
                      <TouchableOpacity onPress={copyCodeToClipboard} style={styles.copyButton}>
                        <Ionicons name="copy" size={20} color={ShamahColors.primary} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.codeActions}>
                      <ShamahButton
                        title="Compartilhar"
                        variant="primary"
                        icon="share-social"
                        onPress={shareAffiliateCode}
                        style={styles.shareButton}
                      />
                      <ShamahButton
                        title="Gerar Novo Código"
                        variant="outline"
                        icon="refresh"
                        onPress={regenerateCode}
                        style={styles.generateButton}
                      />
                    </View>
                  </View>
                </ShamahCard>
              </AnimatedCard>

              {/* Tabela de Comissões */}
              <AnimatedCard index={4}>
                <ShamahCard 
                  title="Tabela de Comissões"
                  subtitle="Valores por tipo de plano"
                  variant="glass"
                  style={styles.cardTitle}
                >
                  <View style={styles.commissionTable}>
                    {Object.entries(commissionRates).map(([plan, rate]) => (
                      <View key={plan} style={styles.commissionRow}>
                        <Text style={styles.planName}>Plano {plan}</Text>
                        <Text style={styles.commissionValue}>{formatCurrency(rate)}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.commissionNote}>
                    * Valores pagos por cada nova assinatura com seu código
                  </Text>
                </ShamahCard>
              </AnimatedCard>

              {/* Histórico de Indicações */}
              <AnimatedCard index={5}>
                <ShamahCard 
                  title="Histórico de Indicações"
                  subtitle="Pessoas que você indicou"
                  variant="glass"
                  style={styles.cardTitle}
                >
                  <View style={styles.commissionTable}>
                    {affiliateData.referrals.map((referral) => {
                      const statusBadge = getStatusBadge(referral.status);
                      return (
                        <View key={referral.id} style={styles.commissionRow}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.referralName}>{referral.name}</Text>
                            <Text style={styles.referralDate}>
                              {formatDate(referral.joinDate)} • {referral.planType}
                            </Text>
                          </View>
                          <View style={{ alignItems: 'flex-end' }}>
                            <View style={[styles.statusBadge, { backgroundColor: `${statusBadge.color}20`, marginBottom: 4 }]}> 
                              <Ionicons name={statusBadge.icon as any} size={14} color={statusBadge.color} />
                              <Text style={[styles.statusText, { color: statusBadge.color, fontSize: 15, fontWeight: 'bold' }]}>
                                {statusBadge.text}
                              </Text>
                            </View>
                            <Text style={styles.commissionValue}>
                              {formatCurrency(referral.commission)}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </ShamahCard>
              </AnimatedCard>
            </>
          )}

          {/* Insights da IA */}
          {/* Dicas para afiliados */}
          {/* Dicas originais para afiliados */}
          <View style={{ marginTop: 24, marginBottom: 12 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#fff', marginBottom: 8 }}>Dicas para afiliados:</Text>
            {[ 
              { icon: 'chatbubbles', text: 'Ofereça suporte rápido e personalizado para seus indicados.' },
              { icon: 'trending-up', text: 'Seja consistente: compartilhe regularmente e acompanhe seus resultados.' },
              { icon: 'create', text: 'Crie conteúdos relevantes e educativos para atrair mais pessoas.' },
              { icon: 'time', text: 'Compartilhe nos horários de maior engajamento para melhores resultados.' }
            ].map((dica, idx) => (
              <View key={dica.icon} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Ionicons
                  name={dica.icon}
                  size={20}
                  color="rgba(255,255,255,0.7)"
                  style={{ marginRight: 8 }}
                />
                <Text style={{ fontSize: 17, color: '#fff', fontWeight: '600' }}>{dica.text}</Text>
              </View>
            ))}
          </View>
          {/* Renderiza o restante dos insights abaixo do card */}
          {false && (
            <View style={styles.aiInsightsExtraList}>
              <View style={styles.aiInsightItem}>
                <View style={styles.aiIconWrap}>
                  <Ionicons name="chatbubbles" size={20} color={ShamahColors.success} />
                </View>
                <Text style={styles.aiInsightText}>
                  Ofereça suporte rápido e personalizado para seus indicados.
                </Text>
              </View>
              <View style={styles.aiInsightItem}>
                <View style={styles.aiIconWrap}>
                  <Ionicons name="trending-up" size={20} color={ShamahColors.danger} />
                </View>
                <Text style={styles.aiInsightText}>
                  Seja consistente: compartilhe regularmente e acompanhe seus resultados.
                </Text>
              </View>
            </View>
          )}

          <View style={styles.bottomPadding} />
        </ScrollView>
      </AnimatedScreen>
    </ShamahBackground>
  );
}

const styles = StyleSheet.create({
  aiInsightButton: {
    width: 120,
    height: 70,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginHorizontal: 8,
    marginVertical: 0,
    padding: 0,
    flexDirection: 'column',
    boxSizing: 'border-box',
    display: 'flex',
  },
  aiInsightText: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    width: 90,
    padding: 0,
    margin: 0,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: ShamahTheme.typography.sizes.lg,
    color: 'white',
    fontWeight: ShamahTheme.typography.weights.medium,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContent: {
    paddingVertical: 20,
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  brandIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  brandIconInner: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  brandText: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 24,
  },
  metricsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
  },
  metricHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  metricTrend: {
    backgroundColor: 'rgba(16,185,129,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  metricBadge: {
    backgroundColor: 'rgba(139,92,246,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  metricLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    textAlign: 'center',
  },
  metricDivider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 20,
    alignSelf: 'center',
  },
  restrictedCard: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
    marginBottom: ShamahTheme.spacing.lg,
  },
  restrictedContent: {
    alignItems: 'center',
    paddingVertical: ShamahTheme.spacing.xl,
  },
  restrictedTitle: {
    fontSize: ShamahTheme.typography.sizes.xl,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
    marginVertical: ShamahTheme.spacing.md,
  },
  restrictedText: {
    fontSize: ShamahTheme.typography.sizes.base,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: ShamahTheme.spacing.xl,
    lineHeight: 22,
  },
  upgradeButton: {
    minWidth: 200,
  },
  performanceCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  performanceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'left',
  },
  performancePeriod: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  periodText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  performanceGrid: {
    gap: 20,
  },
  performanceMetric: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  performanceNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    textAlign: 'left',
  },
  performanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'left',
  },
  performanceBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  performanceFill: {
    height: '100%',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ShamahTheme.spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: ShamahTheme.borderRadius.lg,
    padding: ShamahTheme.spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: ShamahTheme.typography.sizes.xl,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
    marginBottom: ShamahTheme.spacing.xs,
  },
  statLabel: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  rankCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: ShamahTheme.borderRadius.lg,
    padding: ShamahTheme.spacing.lg,
  },
  currentRank: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ShamahTheme.spacing.lg,
  },
  rankBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ShamahTheme.spacing.md,
  },
  rankEmoji: {
    fontSize: 24,
  },
  rankInfo: {
    flex: 1,
  },
  rankName: {
    fontSize: ShamahTheme.typography.sizes.lg,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
    marginBottom: ShamahTheme.spacing.xs,
  },
  rankMultiplier: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  nextRankSection: {
    marginTop: ShamahTheme.spacing.md,
  },
  nextRankTitle: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: ShamahTheme.spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: ShamahTheme.spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: ShamahColors.warning,
    borderRadius: 4,
  },
  progressText: {
    fontSize: ShamahTheme.typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  codeSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: ShamahTheme.borderRadius.lg,
    padding: ShamahTheme.spacing.lg,
  },
  codeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ShamahTheme.spacing.lg,
  },
  codeText: {
    fontSize: ShamahTheme.typography.sizes['2xl'],
    fontWeight: ShamahTheme.typography.weights.bold,
    color: '#fff',
    letterSpacing: 2,
    marginRight: ShamahTheme.spacing.md,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  copyButton: {
    padding: ShamahTheme.spacing.sm,
  },
  codeActions: {
    flexDirection: 'row',
    gap: ShamahTheme.spacing.md,
  },
  shareButton: {
    flex: 1,
  },
  generateButton: {
    flex: 1,
  },
  commissionTable: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: ShamahTheme.borderRadius.lg,
    padding: ShamahTheme.spacing.md,
    marginBottom: ShamahTheme.spacing.sm,
  },
  commissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ShamahTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  planName: {
    fontSize: ShamahTheme.typography.sizes.base + 2,
    color: '#fff',
    fontWeight: ShamahTheme.typography.weights.medium,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  commissionValue: {
    fontSize: ShamahTheme.typography.sizes.base,
    color: '#34d399', // verde vibrante
    fontWeight: ShamahTheme.typography.weights.bold,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  commissionNote: {
    fontSize: ShamahTheme.typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  referralsList: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: ShamahTheme.borderRadius.lg,
    padding: ShamahTheme.spacing.md,
  },
  referralItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ShamahTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  referralInfo: {
    flex: 1,
  },
  referralName: {
    fontSize: ShamahTheme.typography.sizes.base + 2,
    color: '#fff',
    fontWeight: ShamahTheme.typography.weights.medium,
    marginBottom: ShamahTheme.spacing.xs,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  referralDate: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  referralStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ShamahTheme.spacing.sm,
    paddingVertical: ShamahTheme.spacing.xs,
    borderRadius: ShamahTheme.borderRadius.full,
    marginBottom: ShamahTheme.spacing.xs,
    gap: 4,
  },
  statusText: {
    fontSize: ShamahTheme.typography.sizes.base,
    fontWeight: ShamahTheme.typography.weights.medium,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  commissionEarned: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: '#34d399', // verde vibrante
    fontWeight: ShamahTheme.typography.weights.bold,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  aiInsightsCard: {
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    marginBottom: 24,
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'stretch',
    height: 160, // altura fixa mobile
    overflow: 'hidden',
  },
  aiInsightsList: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    paddingVertical: 8,
  },
  aiInsightsExtraList: {
    marginTop: 8,
    gap: 12,
  },
  aiInsightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: 16,
    padding: 8, // padding menor
    gap: 12,
    marginBottom: 2,
    minHeight: 36, // altura mínima compacta
  },
  aiIconWrap: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 12,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  aiInsightText: {
    fontSize: 17,
    color: '#fff',
    flex: 1,
    lineHeight: 26,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomPadding: {
    height: ShamahTheme.spacing.xl,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  demoBanner: {
    padding: ShamahTheme.spacing.md,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: ShamahTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  demoText: {
    fontSize: ShamahTheme.typography.sizes.base,
    fontWeight: 'bold',
    color: '#fde68a', // amarelo claro
    textAlign: 'center',
    marginBottom: ShamahTheme.spacing.xs,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  demoSubtext: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: ShamahColors.neutral[600],
    textAlign: 'center',
  },
});
