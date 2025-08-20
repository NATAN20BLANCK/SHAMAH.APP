import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ShamahCard from '../components/ShamahCard';
import ShamahButton from '../components/ShamahButton';
import { AnimatedScreen, AnimatedCard } from '../components/ShamahAnimations';
import { ShamahTheme } from '../constants/theme';
import { ShamahColors } from '../constants/Colors';

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  displayName: string;
  isConnected: boolean;
  followerCount?: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  lastSync?: Date;
}

interface Platform {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  description: string;
}

const availablePlatforms: Platform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'logo-instagram',
    color: '#E4405F',
    description: 'Compartilhe fotos e stories',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'logo-facebook',
    color: '#1877F2',
    description: 'Conecte-se com amigos e páginas',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'musical-notes',
    color: '#FF0050',
    description: 'Vídeos curtos e virais',
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: 'logo-twitter',
    color: '#1DA1F2',
    description: 'Microblog e notícias',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'logo-linkedin',
    color: '#0A66C2',
    description: 'Rede profissional',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'logo-youtube',
    color: '#FF0000',
    description: 'Vídeos e canal',
  },
  {
    id: 'kwai',
    name: 'Kwai',
    icon: 'videocam',
    color: '#FF6B35',
    description: 'Vídeos e entretenimento',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: 'logo-pinterest',
    color: '#BD081C',
    description: 'Inspiração e ideias',
  },
];

export default function ContasScreen() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    {
      id: '1',
      platform: 'Instagram',
      username: '@meuusuario',
      displayName: 'Meu Usuário',
      isConnected: true,
      followerCount: 1250,
      icon: 'logo-instagram',
      color: '#E4405F',
      lastSync: new Date(),
    },
    {
      id: '2',
      platform: 'Facebook',
      username: 'Minha Página',
      displayName: 'Minha Página Empresarial',
      isConnected: true,
      followerCount: 890,
      icon: 'logo-facebook',
      color: '#1877F2',
      lastSync: new Date(),
    },
  ]);

  const [showAddAccount, setShowAddAccount] = useState(false);

  const handleAddAccount = (platform: Platform) => {
    Alert.alert(
      'Conectar Conta',
      `Deseja conectar sua conta do ${platform.name}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Conectar',
          onPress: () => connectAccount(platform)
        }
      ]
    );
  };

  const connectAccount = (platform: Platform) => {
    // Simular conexão
    const newAccount: SocialAccount = {
      id: Date.now().toString(),
      platform: platform.name,
      username: `@usuario${platform.id}`,
      displayName: `Minha Conta ${platform.name}`,
      isConnected: true,
      followerCount: Math.floor(Math.random() * 5000),
      icon: platform.icon,
      color: platform.color,
      lastSync: new Date(),
    };

    setAccounts(prev => [...prev, newAccount]);
    setShowAddAccount(false);
    
    Alert.alert('Sucesso!', `Conta do ${platform.name} conectada com sucesso!`);
  };

  const handleDisconnectAccount = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    
    Alert.alert(
      'Desconectar Conta',
      `Deseja desconectar a conta ${account?.username}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Desconectar',
          style: 'destructive',
          onPress: () => {
            setAccounts(prev => prev.filter(acc => acc.id !== accountId));
          }
        }
      ]
    );
  };

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <View style={styles.container}>
      <AnimatedScreen>
        {/* Header */}
        <View style={styles.header}>
          <AnimatedCard index={0}>
            <ShamahCard variant="glass" style={styles.headerCard}>
              <View style={styles.headerContent}>
                <Text style={styles.title}>Suas Contas</Text>
                <Text style={styles.subtitle}>Gerencie suas redes sociais conectadas</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{accounts.length}</Text>
                    <Text style={styles.statLabel}>Conectadas</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {formatFollowerCount(accounts.reduce((sum, acc) => sum + (acc.followerCount || 0), 0))}
                    </Text>
                    <Text style={styles.statLabel}>Seguidores</Text>
                  </View>
                </View>
              </View>
            </ShamahCard>
          </AnimatedCard>
        </View>

        {/* Contas Conectadas */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <AnimatedCard index={1}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Contas Conectadas</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowAddAccount(!showAddAccount)}
                >
                  <Ionicons name="add" size={24} color={ShamahColors.primary} />
                </TouchableOpacity>
              </View>
            </AnimatedCard>

            {accounts.map((account, index) => (
              <AnimatedCard key={account.id} index={index + 2}>
                <ShamahCard variant="glass" style={styles.accountCard}>
                  <View style={styles.accountHeader}>
                    <View style={styles.accountInfo}>
                      <LinearGradient
                        colors={[account.color, account.color + '80']}
                        style={styles.accountIcon}
                      >
                        <Ionicons name={account.icon} size={24} color="white" />
                      </LinearGradient>
                      <View style={styles.accountDetails}>
                        <Text style={styles.accountPlatform}>{account.platform}</Text>
                        <Text style={styles.accountUsername}>{account.username}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.disconnectButton}
                      onPress={() => handleDisconnectAccount(account.id)}
                    >
                      <Ionicons name="close" size={20} color="rgba(255,255,255,0.7)" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.accountStats}>
                    <View style={styles.accountStat}>
                      <Text style={styles.accountStatValue}>
                        {formatFollowerCount(account.followerCount || 0)}
                      </Text>
                      <Text style={styles.accountStatLabel}>Seguidores</Text>
                    </View>
                    <View style={styles.accountStat}>
                      <View style={styles.statusIndicator}>
                        <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
                        <Text style={styles.statusText}>Conectado</Text>
                      </View>
                    </View>
                  </View>
                </ShamahCard>
              </AnimatedCard>
            ))}
          </View>

          {/* Adicionar Nova Conta */}
          {showAddAccount && (
            <View style={styles.section}>
              <AnimatedCard index={accounts.length + 3}>
                <Text style={styles.sectionTitle}>Adicionar Nova Conta</Text>
              </AnimatedCard>

              {availablePlatforms
                .filter(platform => !accounts.some(acc => acc.platform === platform.name))
                .map((platform, index) => (
                <AnimatedCard key={platform.id} index={accounts.length + 4 + index}>
                  <TouchableOpacity
                    style={styles.platformCard}
                    onPress={() => handleAddAccount(platform)}
                  >
                    <ShamahCard variant="glass" style={styles.platformCardInner}>
                      <View style={styles.platformInfo}>
                        <LinearGradient
                          colors={[platform.color, platform.color + '80']}
                          style={styles.platformIcon}
                        >
                          <Ionicons name={platform.icon} size={28} color="white" />
                        </LinearGradient>
                        <View style={styles.platformDetails}>
                          <Text style={styles.platformName}>{platform.name}</Text>
                          <Text style={styles.platformDescription}>{platform.description}</Text>
                        </View>
                      </View>
                      <Ionicons name="add-circle-outline" size={24} color={ShamahColors.primary} />
                    </ShamahCard>
                  </TouchableOpacity>
                </AnimatedCard>
              ))}
            </View>
          )}

          {accounts.length === 0 && (
            <AnimatedCard index={1}>
              <ShamahCard variant="glass" style={styles.emptyCard}>
                <Ionicons name="link-outline" size={48} color="rgba(255,255,255,0.5)" />
                <Text style={styles.emptyTitle}>Nenhuma conta conectada</Text>
                <Text style={styles.emptyDescription}>
                  Conecte suas redes sociais para começar a gerenciar seus posts
                </Text>
                <ShamahButton
                  title="Adicionar Primeira Conta"
                  onPress={() => setShowAddAccount(true)}
                  style={styles.emptyButton}
                />
              </ShamahCard>
            </AnimatedCard>
          )}
        </ScrollView>
      </AnimatedScreen>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: ShamahTheme.spacing.md,
    paddingBottom: 20,
  },
  headerCard: {
    marginBottom: 0,
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: ShamahTheme.spacing.lg,
  },
  title: {
    fontSize: ShamahTheme.typography.sizes['2xl'],
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
    textAlign: 'center',
    marginBottom: ShamahTheme.spacing.sm,
  },
  subtitle: {
    fontSize: ShamahTheme.typography.sizes.base,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: ShamahTheme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShamahTheme.spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: ShamahTheme.typography.sizes.xl,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    flex: 1,
    paddingHorizontal: ShamahTheme.spacing.md,
  },
  section: {
    marginBottom: ShamahTheme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ShamahTheme.spacing.md,
  },
  sectionTitle: {
    fontSize: ShamahTheme.typography.sizes.lg,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  accountCard: {
    padding: ShamahTheme.spacing.lg,
    marginBottom: ShamahTheme.spacing.md,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ShamahTheme.spacing.md,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: ShamahTheme.spacing.md,
  },
  accountDetails: {
    flex: 1,
  },
  accountPlatform: {
    fontSize: ShamahTheme.typography.sizes.base,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
    marginBottom: 4,
  },
  accountUsername: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  disconnectButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountStat: {
    alignItems: 'center',
  },
  accountStatValue: {
    fontSize: ShamahTheme.typography.sizes.lg,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
    marginBottom: 4,
  },
  accountStatLabel: {
    fontSize: ShamahTheme.typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShamahTheme.spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: ShamahTheme.typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  platformCard: {
    marginBottom: ShamahTheme.spacing.md,
  },
  platformCardInner: {
    padding: ShamahTheme.spacing.lg,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  platformIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: ShamahTheme.spacing.md,
  },
  platformDetails: {
    flex: 1,
  },
  platformName: {
    fontSize: ShamahTheme.typography.sizes.base,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
    marginBottom: 4,
  },
  platformDescription: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  emptyCard: {
    padding: ShamahTheme.spacing.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: ShamahTheme.typography.sizes.lg,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
    textAlign: 'center',
    marginTop: ShamahTheme.spacing.md,
    marginBottom: ShamahTheme.spacing.sm,
  },
  emptyDescription: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: ShamahTheme.spacing.lg,
  },
  emptyButton: {
    paddingHorizontal: ShamahTheme.spacing.xl,
  },
});
