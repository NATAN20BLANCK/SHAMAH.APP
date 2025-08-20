import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShamahTheme } from '../constants/theme';
import { ShamahColors } from '../constants/Colors';
import ShamahBackground from '../components/ShamahBackground';
import ShamahCard from '../components/ShamahCard';
import ShamahButton from '../components/ShamahButton';
import { AnimatedScreen, AnimatedCard } from '../components/ShamahAnimations';
import { useNotificationManager, NotificationPreferences } from '../hooks/useNotificationManager';
import { useLoading } from '../contexts/LoadingContext';

interface NotificationSettingsProps {
  onBack: () => void;
}

export default function NotificationSettings({ onBack }: NotificationSettingsProps) {
  const {
    preferences,
    hasPermission,
    isLoading,
    updatePreferences,
    requestPermission,
    clearNotifications,
    getNotificationHistory,
  } = useNotificationManager();

  const { showSyncLoading, hideLoading } = useLoading();
  const [localPreferences, setLocalPreferences] = useState<NotificationPreferences>(preferences);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handlePermissionRequest = async () => {
    showSyncLoading('Solicitando permissão...');
    const granted = await requestPermission();
    hideLoading();
    
    if (granted) {
      Alert.alert('Sucesso', 'Permissões concedidas! Agora você receberá notificações.');
    }
  };

  const handleSavePreferences = async () => {
    showSyncLoading('Salvando configurações...');
    await updatePreferences(localPreferences);
    hideLoading();
    Alert.alert('Sucesso', 'Configurações salvas com sucesso!');
  };

  const handleClearNotifications = () => {
    Alert.alert(
      'Limpar Notificações',
      'Tem certeza que deseja cancelar todas as notificações agendadas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            showSyncLoading('Limpando notificações...');
            await clearNotifications();
            hideLoading();
            Alert.alert('Sucesso', 'Todas as notificações foram canceladas.');
          },
        },
      ]
    );
  };

  const togglePreference = (key: keyof NotificationPreferences, value: any) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const togglePlatform = (platform: string) => {
    setLocalPreferences(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const timeOptions = [
    { value: '08:00', label: '8:00' },
    { value: '09:00', label: '9:00' },
    { value: '10:00', label: '10:00' },
    { value: '12:00', label: '12:00' },
    { value: '14:00', label: '14:00' },
    { value: '18:00', label: '18:00' },
    { value: '20:00', label: '20:00' },
  ];

  const frequencyOptions = [
    { value: 'instant', label: 'Instantâneo', description: 'Receba notificações imediatamente' },
    { value: 'daily', label: 'Diário', description: 'Uma notificação por dia' },
    { value: 'weekly', label: 'Semanal', description: 'Resumo semanal' },
  ];

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: 'logo-instagram' },
    { id: 'facebook', name: 'Facebook', icon: 'logo-facebook' },
    { id: 'tiktok', name: 'TikTok', icon: 'logo-tiktok' },
    { id: 'twitter', name: 'Twitter', icon: 'logo-twitter' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'logo-linkedin' },
  ];

  if (isLoading) {
    return (
      <ShamahBackground variant="cosmic" style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando configurações...</Text>
        </View>
      </ShamahBackground>
    );
  }

  return (
    <ShamahBackground variant="cosmic" style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AnimatedScreen>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notificações</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Permission Status */}
          <AnimatedCard index={0}>
            <ShamahCard variant="glass" style={styles.permissionCard}>
              <View style={styles.permissionHeader}>
                <Ionicons 
                  name={hasPermission ? "checkmark-circle" : "warning"} 
                  size={24} 
                  color={hasPermission ? ShamahColors.success.primary : ShamahColors.warning.primary} 
                />
                <Text style={styles.permissionTitle}>
                  {hasPermission ? 'Permissões Concedidas' : 'Permissão Necessária'}
                </Text>
              </View>
              <Text style={styles.permissionDescription}>
                {hasPermission 
                  ? 'Você receberá notificações sobre trends, dicas e conteúdo personalizado.'
                  : 'Para receber notificações, é necessário conceder permissão.'
                }
              </Text>
              {!hasPermission && (
                <ShamahButton
                  variant="primary"
                  size="small"
                  onPress={handlePermissionRequest}
                  style={styles.permissionButton}
                >
                  Solicitar Permissão
                </ShamahButton>
              )}
            </ShamahCard>
          </AnimatedCard>

          {/* Notification Types */}
          <AnimatedCard index={1}>
            <ShamahCard variant="glass" style={styles.section}>
              <Text style={styles.sectionTitle}>Tipos de Notificação</Text>
              
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Ionicons name="trending-up" size={20} color={ShamahColors.trends.primary} />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Trends</Text>
                    <Text style={styles.settingDescription}>Novidades e tendências</Text>
                  </View>
                </View>
                <Switch
                  value={localPreferences.trendsEnabled}
                  onValueChange={(value) => togglePreference('trendsEnabled', value)}
                  trackColor={{ false: '#767577', true: ShamahColors.trends.primary }}
                  thumbColor={localPreferences.trendsEnabled ? '#f4f3f4' : '#f4f3f4'}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Ionicons name="newspaper" size={20} color={ShamahColors.news.primary} />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Notícias</Text>
                    <Text style={styles.settingDescription}>Atualizações importantes</Text>
                  </View>
                </View>
                <Switch
                  value={localPreferences.newsEnabled}
                  onValueChange={(value) => togglePreference('newsEnabled', value)}
                  trackColor={{ false: '#767577', true: ShamahColors.news.primary }}
                  thumbColor={localPreferences.newsEnabled ? '#f4f3f4' : '#f4f3f4'}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Ionicons name="bulb" size={20} color={ShamahColors.tips.primary} />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Dicas</Text>
                    <Text style={styles.settingDescription}>Conselhos e estratégias</Text>
                  </View>
                </View>
                <Switch
                  value={localPreferences.tipsEnabled}
                  onValueChange={(value) => togglePreference('tipsEnabled', value)}
                  trackColor={{ false: '#767577', true: ShamahColors.tips.primary }}
                  thumbColor={localPreferences.tipsEnabled ? '#f4f3f4' : '#f4f3f4'}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Ionicons name="person" size={20} color={ShamahColors.personalized.primary} />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Personalizado</Text>
                    <Text style={styles.settingDescription}>Conteúdo baseado em seus hábitos</Text>
                  </View>
                </View>
                <Switch
                  value={localPreferences.personalizedEnabled}
                  onValueChange={(value) => togglePreference('personalizedEnabled', value)}
                  trackColor={{ false: '#767577', true: ShamahColors.personalized.primary }}
                  thumbColor={localPreferences.personalizedEnabled ? '#f4f3f4' : '#f4f3f4'}
                />
              </View>
            </ShamahCard>
          </AnimatedCard>

          {/* Frequency */}
          <AnimatedCard index={2}>
            <ShamahCard variant="glass" style={styles.section}>
              <Text style={styles.sectionTitle}>Frequência</Text>
              
              {frequencyOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.frequencyOption,
                    localPreferences.frequency === option.value && styles.frequencyOptionSelected
                  ]}
                  onPress={() => togglePreference('frequency', option.value)}
                >
                  <View style={styles.frequencyInfo}>
                    <Text style={styles.frequencyLabel}>{option.label}</Text>
                    <Text style={styles.frequencyDescription}>{option.description}</Text>
                  </View>
                  <Ionicons 
                    name={localPreferences.frequency === option.value ? "radio-button-on" : "radio-button-off"} 
                    size={20} 
                    color={localPreferences.frequency === option.value ? ShamahColors.primary : 'rgba(255, 255, 255, 0.5)'} 
                  />
                </TouchableOpacity>
              ))}
            </ShamahCard>
          </AnimatedCard>

          {/* Scheduled Time */}
          {localPreferences.frequency === 'daily' && (
            <AnimatedCard index={3}>
              <ShamahCard variant="glass" style={styles.section}>
                <Text style={styles.sectionTitle}>Horário</Text>
                
                <View style={styles.timeOptions}>
                  {timeOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.timeOption,
                        localPreferences.scheduledTime === option.value && styles.timeOptionSelected
                      ]}
                      onPress={() => togglePreference('scheduledTime', option.value)}
                    >
                      <Text style={[
                        styles.timeLabel,
                        localPreferences.scheduledTime === option.value && styles.timeLabelSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ShamahCard>
            </AnimatedCard>
          )}

          {/* Platforms */}
          <AnimatedCard index={4}>
            <ShamahCard variant="glass" style={styles.section}>
              <Text style={styles.sectionTitle}>Plataformas</Text>
              <Text style={styles.sectionDescription}>
                Escolha as plataformas sobre as quais deseja receber notificações
              </Text>
              
              {platforms.map((platform) => (
                <TouchableOpacity
                  key={platform.id}
                  style={[
                    styles.platformOption,
                    localPreferences.platforms.includes(platform.id) && styles.platformOptionSelected
                  ]}
                  onPress={() => togglePlatform(platform.id)}
                >
                  <View style={styles.platformInfo}>
                    <Ionicons name={platform.icon} size={20} color="white" />
                    <Text style={styles.platformLabel}>{platform.name}</Text>
                  </View>
                  <Ionicons 
                    name={localPreferences.platforms.includes(platform.id) ? "checkmark-circle" : "ellipse-outline"} 
                    size={20} 
                    color={localPreferences.platforms.includes(platform.id) ? ShamahColors.success.primary : 'rgba(255, 255, 255, 0.5)'} 
                  />
                </TouchableOpacity>
              ))}
            </ShamahCard>
          </AnimatedCard>

          {/* Actions */}
          <AnimatedCard index={5}>
            <ShamahCard variant="glass" style={styles.section}>
              <ShamahButton
                variant="primary"
                size="large"
                onPress={handleSavePreferences}
                style={styles.saveButton}
              >
                Salvar Configurações
              </ShamahButton>
              
              <ShamahButton
                variant="secondary"
                size="medium"
                onPress={handleClearNotifications}
                style={styles.clearButton}
              >
                Limpar Notificações Agendadas
              </ShamahButton>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: ShamahTheme.typography.sizes.lg,
    color: 'white',
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
  headerSpacer: {
    width: 40,
  },
  permissionCard: {
    marginHorizontal: ShamahTheme.spacing.lg,
    marginBottom: ShamahTheme.spacing.md,
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ShamahTheme.spacing.sm,
  },
  permissionTitle: {
    fontSize: ShamahTheme.typography.sizes.lg,
    fontWeight: ShamahTheme.typography.weights.semibold,
    color: 'white',
    marginLeft: ShamahTheme.spacing.sm,
  },
  permissionDescription: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: ShamahTheme.spacing.md,
  },
  permissionButton: {
    alignSelf: 'flex-start',
  },
  section: {
    marginHorizontal: ShamahTheme.spacing.lg,
    marginBottom: ShamahTheme.spacing.md,
  },
  sectionTitle: {
    fontSize: ShamahTheme.typography.sizes.lg,
    fontWeight: ShamahTheme.typography.weights.semibold,
    color: 'white',
    marginBottom: ShamahTheme.spacing.md,
  },
  sectionDescription: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: ShamahTheme.spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ShamahTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: ShamahTheme.spacing.sm,
  },
  settingLabel: {
    fontSize: ShamahTheme.typography.sizes.md,
    fontWeight: ShamahTheme.typography.weights.medium,
    color: 'white',
  },
  settingDescription: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  frequencyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ShamahTheme.spacing.md,
    paddingHorizontal: ShamahTheme.spacing.md,
    borderRadius: 12,
    marginBottom: ShamahTheme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  frequencyOptionSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: ShamahColors.primary,
  },
  frequencyInfo: {
    flex: 1,
  },
  frequencyLabel: {
    fontSize: ShamahTheme.typography.sizes.md,
    fontWeight: ShamahTheme.typography.weights.medium,
    color: 'white',
  },
  frequencyDescription: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeOption: {
    paddingVertical: ShamahTheme.spacing.sm,
    paddingHorizontal: ShamahTheme.spacing.md,
    borderRadius: 8,
    marginBottom: ShamahTheme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    minWidth: 80,
    alignItems: 'center',
  },
  timeOptionSelected: {
    backgroundColor: ShamahColors.primary,
  },
  timeLabel: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  timeLabelSelected: {
    color: 'white',
    fontWeight: ShamahTheme.typography.weights.semibold,
  },
  platformOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ShamahTheme.spacing.md,
    paddingHorizontal: ShamahTheme.spacing.md,
    borderRadius: 12,
    marginBottom: ShamahTheme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  platformOptionSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: ShamahColors.success.primary,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platformLabel: {
    fontSize: ShamahTheme.typography.sizes.md,
    color: 'white',
    marginLeft: ShamahTheme.spacing.sm,
  },
  saveButton: {
    marginBottom: ShamahTheme.spacing.md,
  },
  clearButton: {
    opacity: 0.8,
  },
});
