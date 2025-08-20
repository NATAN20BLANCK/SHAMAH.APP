import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ShamahBackground from '../components/ShamahBackground';
import ShamahCard from '../components/ShamahCard';
import ShamahButton from '../components/ShamahButton';
import MediaPicker from '../components/MediaPicker';
import MediaPreview from '../components/MediaPreview';
import { AnimatedScreen, AnimatedCard } from '../components/ShamahAnimations';
import { ShamahTheme } from '../constants/theme';
import { ShamahColors } from '../constants/Colors';
import { useLoading } from '../contexts/LoadingContext';
import { useProgressSimulator } from '../hooks/useLoadingManager';

interface MediaItem {
  id: string;
  uri: string;
  type: 'image' | 'video';
  filename?: string;
  width?: number;
  height?: number;
  duration?: number;
}

export default function EditorScreen() {
  // Função simulada para replicação automática
  const replicateVideoForPlatforms = async (media: MediaItem[], platforms: string[]) => {
    // Aqui seria feita a adaptação real (tempo, resolução, formato)
    // Simulação: apenas aguarda 1 segundo por plataforma
    for (const platform of platforms) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return media.map(item => ({ ...item, replicated: true }));
  };
  const [caption, setCaption] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const { showUploadLoading, showProcessingLoading, hideLoading, updateProgress, updateMessage } = useLoading();
  const { simulateProgress } = useProgressSimulator();

  const socialAccounts = [
    { id: 'instagram', name: 'Instagram', icon: 'logo-instagram', color: '#E4405F' },
    { id: 'facebook', name: 'Facebook', icon: 'logo-facebook', color: '#1877F2' },
    { id: 'tiktok', name: 'TikTok', icon: 'musical-notes', color: '#FF0050' },
    { id: 'twitter', name: 'Twitter', icon: 'logo-twitter', color: '#1DA1F2' },
  ];

  const handleMediaSelect = (media: MediaItem[]) => {
    setSelectedMedia(media);
  };

  const handleRemoveMedia = (id: string) => {
    setSelectedMedia(prev => prev.filter(item => item.id !== id));
  };

  const handleEditMedia = (id: string) => {
    // Aqui você pode implementar edição de mídia
    Alert.alert('Editar Mídia', 'Funcionalidade de edição será implementada em breve.');
  };

  const toggleAccount = (accountId: string) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleSchedulePost = () => {
    if (selectedMedia.length === 0) {
      Alert.alert('Aviso', 'Selecione pelo menos uma mídia para continuar.');
      return;
    }

    if (selectedAccounts.length === 0) {
      Alert.alert('Aviso', 'Selecione pelo menos uma conta para publicar.');
      return;
    }

    replicateVideoForPlatforms(selectedMedia, selectedAccounts).then(() => {
      Alert.alert(
        'Post Agendado!',
        `Seu vídeo foi adaptado automaticamente para cada rede e agendado para ${selectedAccounts.length} conta(s).`,
        [
          { 
            text: 'Ver Agendados', 
            onPress: () => router.push('/(tabs)/agendados') 
          },
          { 
            text: 'Criar Novo', 
            onPress: () => {
              setCaption('');
              setSelectedMedia([]);
              setSelectedAccounts([]);
            }
          }
        ]
      );
    });
  };

  const handlePublishNow = async () => {
    if (selectedMedia.length === 0) {
      Alert.alert('Aviso', 'Selecione pelo menos uma mídia para continuar.');
      return;
    }

    if (selectedAccounts.length === 0) {
      Alert.alert('Aviso', 'Selecione pelo menos uma conta para publicar.');
      return;
    }

    Alert.alert(
      'Publicar Agora?',
      `Deseja publicar imediatamente em ${selectedAccounts.length} conta(s)? O vídeo será adaptado automaticamente para cada rede!`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Publicar', 
          onPress: async () => {
            await replicateVideoForPlatforms(selectedMedia, selectedAccounts);
            simulatePublishProcess();
          }
        }
      ]
    );
  };

  const simulatePublishProcess = async () => {
    try {
      // Fase 1: Upload da mídia
      showUploadLoading('Preparando mídia...');
      await simulateUpload();
      
      // Fase 2: Processamento
      showProcessingLoading('Processando conteúdo...');
      await simulateProcessing();
      
      // Fase 3: Publicação
      updateMessage('Publicando nas redes sociais...');
      await simulatePublishing();
      
      hideLoading();
      Alert.alert('Sucesso!', 'Seu post foi publicado com sucesso!');
      router.push('/(tabs)/inicio');
    } catch (error) {
      hideLoading();
      Alert.alert('Erro', 'Falha ao publicar. Tente novamente.');
    }
  };

  const simulateUpload = () => {
    return new Promise<void>((resolve) => {
      simulateProgress(
        (progress) => updateProgress(progress),
        resolve,
        2000
      );
    });
  };

  const simulateProcessing = () => {
    return new Promise<void>((resolve) => {
      simulateProgress(
        (progress) => updateProgress(progress),
        resolve,
        1500
      );
    });
  };

  const simulatePublishing = () => {
    return new Promise<void>((resolve) => {
      simulateProgress(
        (progress) => updateProgress(progress),
        resolve,
        1000
      );
    });
  };

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
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Criar Post</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Seleção de Mídia */}
          <AnimatedCard index={0}>
            <ShamahCard 
              title="📸 Mídia" 
              subtitle="Adicione fotos ou vídeos"
              variant="glass"
            >
              <MediaPreview
                mediaItems={selectedMedia}
                onRemoveItem={handleRemoveMedia}
                onEditItem={handleEditMedia}
                editable={true}
              />
              
              <ShamahButton
                title="Adicionar Mídia"
                variant="primary"
                icon="add"
                onPress={() => setShowMediaPicker(true)}
                style={styles.addMediaButton}
              />
            </ShamahCard>
          </AnimatedCard>

          {/* Legenda */}
          <AnimatedCard index={1}>
            <ShamahCard 
              title="✍️ Legenda" 
              subtitle="Escreva sua mensagem"
              variant="glass"
            >
              <TextInput
                style={styles.captionInput}
                placeholder="Digite sua legenda aqui..."
                placeholderTextColor={ShamahColors.neutral[500]}
                value={caption}
                onChangeText={setCaption}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              
              <View style={styles.captionStats}>
                <Text style={styles.captionCount}>
                  {caption.length}/2200 caracteres
                </Text>
                <TouchableOpacity>
                  <Ionicons name="happy-outline" size={20} color={ShamahColors.primary} />
                </TouchableOpacity>
              </View>
            </ShamahCard>
          </AnimatedCard>

          {/* Selecionar Contas */}
          <AnimatedCard index={2}>
            <ShamahCard 
              title="🔗 Contas" 
              subtitle="Escolha onde publicar"
              variant="glass"
            >
              <View style={styles.accountsGrid}>
                {socialAccounts.map((account) => (
                  <TouchableOpacity
                    key={account.id}
                    style={[
                      styles.accountButton,
                      selectedAccounts.includes(account.id) && styles.accountButtonSelected
                    ]}
                    onPress={() => toggleAccount(account.id)}
                  >
                    <View style={[styles.accountIcon, { backgroundColor: account.color }]}>
                      <Ionicons name={account.icon as any} size={20} color="white" />
                    </View>
                    <Text style={[
                      styles.accountName,
                      selectedAccounts.includes(account.id) && styles.accountNameSelected
                    ]}>
                      {account.name}
                    </Text>
                    {selectedAccounts.includes(account.id) && (
                      <Ionicons name="checkmark-circle" size={16} color={ShamahColors.success} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.accountsSelected}>
                {selectedAccounts.length} conta(s) selecionada(s)
              </Text>
            </ShamahCard>
          </AnimatedCard>

          {/* Automação de Replicação */}
          <AnimatedCard index={3}>
            <ShamahCard variant="glass" title="🔄 Automação de Replicação" subtitle="Poste uma vez e o app adapta o vídeo para cada rede automaticamente.">
              <Text style={{ marginBottom: 12, color: '#06b6d4', fontWeight: 'bold' }}>
                O vídeo enviado será ajustado automaticamente (tempo, resolução, formato).
                Um só envio = várias versões prontas para TikTok, Reels, Shorts, Kwai.
              </Text>
              <View style={styles.actionButtons}>
                <ShamahButton
                  title="Agendar Post"
                  variant="primary"
                  icon="calendar-outline"
                  onPress={handleSchedulePost}
                  style={styles.scheduleButton}
                />
                <ShamahButton
                  title="Publicar Agora"
                  variant="success"
                  icon="send-outline"
                  onPress={handlePublishNow}
                  style={styles.publishButton}
                  glow={true}
                />
              </View>
            </ShamahCard>
          </AnimatedCard>

          {/* Dicas */}
          <AnimatedCard index={4}>
            <ShamahCard 
              title="💡 Dicas"
              subtitle="Maximize seu alcance"
              variant="outlined"
            >
              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <Ionicons name="bulb-outline" size={16} color={ShamahColors.warning} />
                  <Text style={styles.tipText}>
                    Use hashtags relevantes para aumentar o alcance
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="time-outline" size={16} color={ShamahColors.primary} />
                  <Text style={styles.tipText}>
                    Poste nos horários de maior engajamento
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="heart-outline" size={16} color={ShamahColors.danger} />
                  <Text style={styles.tipText}>
                    Interaja com seus seguidores nos comentários
                  </Text>
                </View>
              </View>
            </ShamahCard>
          </AnimatedCard>

          <View style={styles.bottomPadding} />
        </ScrollView>

        {/* Media Picker Modal */}
        <MediaPicker
          visible={showMediaPicker}
          onClose={() => setShowMediaPicker(false)}
          onSelectMedia={handleMediaSelect}
          allowMultiple={true}
          maxSelection={5}
          mediaTypes="all"
        />
      </AnimatedScreen>
    </ShamahBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ShamahTheme.spacing.md,
    paddingTop: ShamahTheme.spacing.xl + 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ShamahTheme.spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ShamahTheme.borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    flex: 1,
    fontSize: ShamahTheme.typography.sizes['2xl'],
    fontWeight: ShamahTheme.typography.weights.bold,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: ShamahTheme.spacing.md,
  },
  headerSpacer: {
    width: 40,
  },
  addMediaButton: {
    marginTop: ShamahTheme.spacing.md,
  },
  captionInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: ShamahTheme.borderRadius.lg,
    padding: ShamahTheme.spacing.md,
    fontSize: ShamahTheme.typography.sizes.base,
    color: 'white',
    minHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  captionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: ShamahTheme.spacing.sm,
  },
  captionCount: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  accountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ShamahTheme.spacing.sm,
  },
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ShamahTheme.spacing.sm,
    borderRadius: ShamahTheme.borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: ShamahTheme.spacing.sm,
    minWidth: 100,
  },
  accountButtonSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: ShamahColors.success,
  },
  accountIcon: {
    width: 24,
    height: 24,
    borderRadius: ShamahTheme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountName: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
  accountNameSelected: {
    color: 'white',
    fontWeight: ShamahTheme.typography.weights.semibold,
  },
  accountsSelected: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: ShamahTheme.spacing.md,
    textAlign: 'center',
  },
  actionButtons: {
    gap: ShamahTheme.spacing.md,
  },
  scheduleButton: {
    marginBottom: ShamahTheme.spacing.sm,
  },
  publishButton: {
    marginBottom: 0,
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
