import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Share, Clipboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ShamahBackground from '../components/ShamahBackground';
import ShamahCard from '../components/ShamahCard';
import ShamahButton from '../components/ShamahButton';
import { AnimatedScreen, AnimatedCard } from '../components/ShamahAnimations';
import { ShamahTheme } from '../constants/theme';
import { ShamahColors } from '../constants/Colors';
import { useAuth } from '../hooks/useAuth';
import { useAffiliateSystem } from '../hooks/useAffiliateSystem';
import { useLoading } from '../contexts/LoadingContext';

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
    getNextRank, 
    getProgressToNextRank 
  } = useAffiliateSystem();

  const currentPlan = user?.plan || 'Gratuito';
  const isEligibleForAffiliate = currentPlan !== 'Gratuito';

  const shareAffiliateCode = async () => {
    if (!isEligibleForAffiliate) {
      Alert.alert(
        'Funcionalidade Restrita',
        'O sistema de afiliados está disponível apenas para assinantes do plano Básico ou superior.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ver Planos', onPress: () => router.push('/PlanosScreen') }
        ]
      );
      return;
    }

    try {
      showSyncLoading('Preparando compartilhamento...');
      
      const shareMessage = getShareMessage();
      await Share.share({
        message: shareMessage,
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
              <Text style={styles.title}>💎 Sistema de Afiliados</Text>
              <Text style={styles.subtitle}>Transforme suas conexões em renda</Text>
              
              {/* Estatísticas do Header */}
              {isEligibleForAffiliate && (
                <View style={styles.headerStats}>
                  <View style={styles.headerStatCard}>
                    <Text style={styles.headerStatNumber}>{formatCurrency(affiliateData.totalEarnings)}</Text>
                    <Text style={styles.headerStatLabel}>Total Ganho</Text>
                  </View>
                  <View style={styles.headerStatDivider} />
                  <View style={styles.headerStatCard}>
                    <Text style={styles.headerStatNumber}>{affiliateData.totalReferrals}</Text>
                    <Text style={styles.headerStatLabel}>Indicações</Text>
                  </View>
                  <View style={styles.headerStatDivider} />
                  <View style={styles.headerStatCard}>
                    <Text style={styles.headerStatNumber}>{affiliateData.currentRank.badge}</Text>
                    <Text style={styles.headerStatLabel}>{affiliateData.currentRank.name}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Verificação de Plano */}
          {!isEligibleForAffiliate && (
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
                    onPress={() => router.push('/PlanosScreen')}
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
              {/* Card de Ganhos com Visual Melhorado */}
              <AnimatedCard index={1}>
                <View style={styles.earningsCard}>
                  <View style={styles.earningsHeader}>
                    <View style={styles.earningsIcon}>
                      <Text style={styles.earningsEmoji}>💰</Text>
                    </View>
                    <View style={styles.earningsInfo}>
                      <Text style={styles.earningsTitle}>Seus Ganhos</Text>
                      <Text style={styles.earningsSubtitle}>Performance dos últimos 30 dias</Text>
                    </View>
                  </View>
                  
                  <View style={styles.earningsGrid}>
                    <View style={styles.earningsStat}>
                      <Text style={styles.earningsNumber}>{formatCurrency(affiliateData.totalEarnings)}</Text>
                      <Text style={styles.earningsLabel}>💎 Total Ganho</Text>
                    </View>
                    <View style={styles.earningsStat}>
                      <Text style={styles.earningsNumber}>{formatCurrency(affiliateData.pendingEarnings)}</Text>
                      <Text style={styles.earningsLabel}>⏳ Pendente</Text>
                    </View>
                    <View style={styles.earningsStat}>
                      <Text style={styles.earningsNumber}>{affiliateData.activeReferrals}</Text>
                      <Text style={styles.earningsLabel}>🔥 Ativos</Text>
                    </View>
                    <View style={styles.earningsStat}>
                      <Text style={styles.earningsNumber}>{((affiliateData.currentRank.bonusMultiplier - 1) * 100).toFixed(0)}%</Text>
                      <Text style={styles.earningsLabel}>⚡ Bônus</Text>
                    </View>
                  </View>
                </View>
              </AnimatedCard>

              {/* Ranking */}
              <AnimatedCard index={2}>
                <ShamahCard 
                  title="🏆 Seu Ranking"
                  subtitle="Evolua e ganhe mais comissões"
                  variant="glass"
                >
                  <View style={styles.rankCard}>
                    <View style={styles.currentRank}>
                      <View style={[styles.rankBadge, { backgroundColor: affiliateData.currentRank.color }]}>
                        <Text style={styles.rankEmoji}>{affiliateData.currentRank.badge}</Text>
                      </View>
                      <View style={styles.rankInfo}>
                        <Text style={styles.rankName}>{affiliateData.currentRank.name}</Text>
                        <Text style={styles.rankMultiplier}>
                          Bônus: {((affiliateData.currentRank.bonusMultiplier - 1) * 100).toFixed(0)}%
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
                  title="🔗 Seu Código"
                  subtitle="Compartilhe e ganhe comissões"
                  variant="glass"
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
                        title="Gerar Novo"
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
                  title="💸 Tabela de Comissões"
                  subtitle="Valores por tipo de plano"
                  variant="glass"
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
                  title="📋 Histórico de Indicações"
                  subtitle="Pessoas que você indicou"
                  variant="glass"
                >
                  <View style={styles.referralsList}>
                    {affiliateData.referrals.map((referral) => {
                      const statusBadge = getStatusBadge(referral.status);
                      return (
                        <View key={referral.id} style={styles.referralItem}>
                          <View style={styles.referralInfo}>
                            <Text style={styles.referralName}>{referral.name}</Text>
                            <Text style={styles.referralDate}>
                              {formatDate(referral.joinDate)} • {referral.planType}
                            </Text>
                          </View>
                          <View style={styles.referralStatus}>
                            <View style={[styles.statusBadge, { backgroundColor: `${statusBadge.color}20` }]}>
                              <Ionicons name={statusBadge.icon as any} size={12} color={statusBadge.color} />
                              <Text style={[styles.statusText, { color: statusBadge.color }]}>
                                {statusBadge.text}
                              </Text>
                            </View>
                            <Text style={styles.commissionEarned}>
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

          {/* Dicas para Melhorar */}
          <AnimatedCard index={6}>
            <ShamahCard 
              title="💡 Dicas para Aumentar Ganhos"
              subtitle="Maximize suas indicações"
              variant="outlined"
            >
              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <Ionicons name="people" size={16} color={ShamahColors.primary} />
                  <Text style={styles.tipText}>
                    Compartilhe em grupos de WhatsApp e redes sociais
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="megaphone" size={16} color={ShamahColors.warning} />
                  <Text style={styles.tipText}>
                    Crie conteúdo mostrando como o app te ajuda
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="star" size={16} color={ShamahColors.success} />
                  <Text style={styles.tipText}>
                    Ofereça suporte aos seus indicados
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="time" size={16} color={ShamahColors.danger} />
                  <Text style={styles.tipText}>
                    Seja consistente - compartilhe regularmente
                  </Text>
                </View>
              </View>
            </ShamahCard>
          </AnimatedCard>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </AnimatedScreen>
    </ShamahBackground>
  );
}

const styles = StyleSheet.create({
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
    paddingBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 24,
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
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  headerStatCard: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  headerStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
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
  earningsCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  earningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  earningsIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,193,7,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  earningsEmoji: {
    fontSize: 28,
  },
  earningsInfo: {
    flex: 1,
  },
  earningsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  earningsSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  earningsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  earningsStat: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  earningsNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  earningsLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
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
    color: 'white',
    letterSpacing: 2,
    marginRight: ShamahTheme.spacing.md,
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
    fontSize: ShamahTheme.typography.sizes.base,
    color: 'white',
    fontWeight: ShamahTheme.typography.weights.medium,
  },
  commissionValue: {
    fontSize: ShamahTheme.typography.sizes.base,
    color: ShamahColors.success,
    fontWeight: ShamahTheme.typography.weights.bold,
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
    fontSize: ShamahTheme.typography.sizes.base,
    color: 'white',
    fontWeight: ShamahTheme.typography.weights.medium,
    marginBottom: ShamahTheme.spacing.xs,
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
    fontSize: ShamahTheme.typography.sizes.xs,
    fontWeight: ShamahTheme.typography.weights.medium,
  },
  commissionEarned: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: ShamahColors.success,
    fontWeight: ShamahTheme.typography.weights.bold,
  },
  tipsList: {
    gap: ShamahTheme.spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShamahTheme.spacing.sm,
  },
  tipText: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: ShamahColors.neutral[700],
    flex: 1,
    lineHeight: 20,
  },
  bottomPadding: {
    height: ShamahTheme.spacing.xl,
  },
});
