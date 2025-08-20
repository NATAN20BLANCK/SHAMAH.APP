import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShamahTheme } from '../constants/theme';
import { ShamahColors } from '../constants/Colors';
import ShamahBackground from '../components/ShamahBackground';
import ShamahCard from '../components/ShamahCard';
import ShamahButton from '../components/ShamahButton';
import { AnimatedScreen, AnimatedCard } from '../components/ShamahAnimations';
import { useI18n } from '../hooks/useI18n';
import { useLoading } from '../contexts/LoadingContext';

interface LanguageSettingsProps {
  onBack: () => void;
}

export default function LanguageSettings({ onBack }: LanguageSettingsProps) {
  const { 
    language, 
    setLanguage, 
    t, 
    availableLanguages,
    formatDate,
    formatTime,
    formatDateTime,
    formatRelativeTime,
  } = useI18n();
  
  const { showSyncLoading, hideLoading } = useLoading();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const handleLanguageChange = async (newLanguage: typeof language) => {
    setSelectedLanguage(newLanguage);
  };

  const handleSaveLanguage = async () => {
    if (selectedLanguage === language) {
      Alert.alert(
        t('success'),
        'Idioma já está selecionado'
      );
      return;
    }

    showSyncLoading('Alterando idioma...');
    
    try {
      await setLanguage(selectedLanguage);
      hideLoading();
      
      Alert.alert(
        t('success'),
        'Idioma alterado com sucesso! O app será reiniciado.',
        [
          {
            text: t('ok'),
            onPress: () => {
              // Em produção, pode ser necessário reiniciar o app
              onBack();
            }
          }
        ]
      );
    } catch (error) {
      hideLoading();
      Alert.alert(
        t('error'),
        'Erro ao alterar idioma. Tente novamente.'
      );
    }
  };

  const sampleDate = new Date();
  const sampleOldDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 horas atrás

  return (
    <ShamahBackground variant="cosmic" style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AnimatedScreen>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('language_settings')}</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Current Language */}
          <AnimatedCard index={0}>
            <ShamahCard variant="glass" style={styles.currentLanguageCard}>
              <View style={styles.currentLanguageHeader}>
                <Ionicons name="language" size={24} color={ShamahColors.primary} />
                <Text style={styles.currentLanguageTitle}>
                  {t('current_language')}
                </Text>
              </View>
              <Text style={styles.currentLanguageText}>
                {availableLanguages.find(lang => lang.code === language)?.nativeName}
              </Text>
            </ShamahCard>
          </AnimatedCard>

          {/* Language Options */}
          <AnimatedCard index={1}>
            <ShamahCard variant="glass" style={styles.languageOptionsCard}>
              <Text style={styles.sectionTitle}>{t('available_languages')}</Text>
              
              {availableLanguages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    selectedLanguage === lang.code && styles.languageOptionSelected
                  ]}
                  onPress={() => handleLanguageChange(lang.code)}
                >
                  <View style={styles.languageInfo}>
                    <Text style={styles.languageNativeName}>{lang.nativeName}</Text>
                    <Text style={styles.languageEnglishName}>{lang.name}</Text>
                  </View>
                  <Ionicons 
                    name={selectedLanguage === lang.code ? "radio-button-on" : "radio-button-off"} 
                    size={20} 
                    color={selectedLanguage === lang.code ? ShamahColors.primary : 'rgba(255, 255, 255, 0.5)'} 
                  />
                </TouchableOpacity>
              ))}
            </ShamahCard>
          </AnimatedCard>

          {/* Format Preview */}
          <AnimatedCard index={2}>
            <ShamahCard variant="glass" style={styles.previewCard}>
              <Text style={styles.sectionTitle}>{t('format_preview')}</Text>
              
              <View style={styles.previewSection}>
                <Text style={styles.previewLabel}>{t('date_format')}:</Text>
                <Text style={styles.previewValue}>{formatDate(sampleDate)}</Text>
              </View>
              
              <View style={styles.previewSection}>
                <Text style={styles.previewLabel}>{t('time_format')}:</Text>
                <Text style={styles.previewValue}>{formatTime(sampleDate)}</Text>
              </View>
              
              <View style={styles.previewSection}>
                <Text style={styles.previewLabel}>{t('datetime_format')}:</Text>
                <Text style={styles.previewValue}>{formatDateTime(sampleDate)}</Text>
              </View>
              
              <View style={styles.previewSection}>
                <Text style={styles.previewLabel}>{t('relative_time')}:</Text>
                <Text style={styles.previewValue}>{formatRelativeTime(sampleOldDate)}</Text>
              </View>
            </ShamahCard>
          </AnimatedCard>

          {/* Sample Texts */}
          <AnimatedCard index={3}>
            <ShamahCard variant="glass" style={styles.sampleTextCard}>
              <Text style={styles.sectionTitle}>{t('sample_texts')}</Text>
              
              <View style={styles.sampleItem}>
                <Text style={styles.sampleLabel}>{t('navigation')}:</Text>
                <Text style={styles.sampleValue}>
                  {t('home')} • {t('blog')} • {t('accounts')} • {t('scheduled')}
                </Text>
              </View>
              
              <View style={styles.sampleItem}>
                <Text style={styles.sampleLabel}>{t('actions')}:</Text>
                <Text style={styles.sampleValue}>
                  {t('save')} • {t('share')} • {t('feedback')} • {t('back')}
                </Text>
              </View>
              
              <View style={styles.sampleItem}>
                <Text style={styles.sampleLabel}>{t('categories')}:</Text>
                <Text style={styles.sampleValue}>
                  {t('trends')} • {t('news')} • {t('tips')} • {t('tutorials')}
                </Text>
              </View>
            </ShamahCard>
          </AnimatedCard>

          {/* Save Button */}
          <AnimatedCard index={4}>
            <ShamahCard variant="glass" style={styles.saveCard}>
              <ShamahButton
                variant="primary"
                size="large"
                onPress={handleSaveLanguage}
                style={styles.saveButton}
                disabled={selectedLanguage === language}
              >
                {t('save_language')}
              </ShamahButton>
              
              <Text style={styles.saveNote}>
                {t('language_change_note')}
              </Text>
            </ShamahCard>
          </AnimatedCard>

          {/* App Information */}
          <AnimatedCard index={5}>
            <ShamahCard variant="glass" style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Ionicons name="information-circle" size={20} color={ShamahColors.info.primary} />
                <Text style={styles.infoTitle}>{t('information')}</Text>
              </View>
              
              <Text style={styles.infoText}>
                {t('language_support_info')}
              </Text>
              
              <View style={styles.infoStats}>
                <View style={styles.infoStat}>
                  <Text style={styles.infoStatValue}>{availableLanguages.length}</Text>
                  <Text style={styles.infoStatLabel}>{t('languages_supported')}</Text>
                </View>
                <View style={styles.infoStat}>
                  <Text style={styles.infoStatValue}>100%</Text>
                  <Text style={styles.infoStatLabel}>{t('translation_coverage')}</Text>
                </View>
              </View>
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
  currentLanguageCard: {
    marginHorizontal: ShamahTheme.spacing.lg,
    marginBottom: ShamahTheme.spacing.md,
  },
  currentLanguageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ShamahTheme.spacing.sm,
  },
  currentLanguageTitle: {
    fontSize: ShamahTheme.typography.sizes.lg,
    fontWeight: ShamahTheme.typography.weights.semibold,
    color: 'white',
    marginLeft: ShamahTheme.spacing.sm,
  },
  currentLanguageText: {
    fontSize: ShamahTheme.typography.sizes.md,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  languageOptionsCard: {
    marginHorizontal: ShamahTheme.spacing.lg,
    marginBottom: ShamahTheme.spacing.md,
  },
  sectionTitle: {
    fontSize: ShamahTheme.typography.sizes.lg,
    fontWeight: ShamahTheme.typography.weights.semibold,
    color: 'white',
    marginBottom: ShamahTheme.spacing.md,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ShamahTheme.spacing.md,
    paddingHorizontal: ShamahTheme.spacing.md,
    borderRadius: 12,
    marginBottom: ShamahTheme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  languageOptionSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: ShamahColors.primary,
  },
  languageInfo: {
    flex: 1,
  },
  languageNativeName: {
    fontSize: ShamahTheme.typography.sizes.md,
    fontWeight: ShamahTheme.typography.weights.medium,
    color: 'white',
  },
  languageEnglishName: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  previewCard: {
    marginHorizontal: ShamahTheme.spacing.lg,
    marginBottom: ShamahTheme.spacing.md,
  },
  previewSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ShamahTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  previewLabel: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  previewValue: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'white',
    fontWeight: ShamahTheme.typography.weights.medium,
  },
  sampleTextCard: {
    marginHorizontal: ShamahTheme.spacing.lg,
    marginBottom: ShamahTheme.spacing.md,
  },
  sampleItem: {
    marginBottom: ShamahTheme.spacing.md,
  },
  sampleLabel: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: ShamahTheme.spacing.xs,
  },
  sampleValue: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'white',
    lineHeight: 20,
  },
  saveCard: {
    marginHorizontal: ShamahTheme.spacing.lg,
    marginBottom: ShamahTheme.spacing.md,
  },
  saveButton: {
    marginBottom: ShamahTheme.spacing.md,
  },
  saveNote: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoCard: {
    marginHorizontal: ShamahTheme.spacing.lg,
    marginBottom: ShamahTheme.spacing.xl,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ShamahTheme.spacing.sm,
  },
  infoTitle: {
    fontSize: ShamahTheme.typography.sizes.lg,
    fontWeight: ShamahTheme.typography.weights.semibold,
    color: 'white',
    marginLeft: ShamahTheme.spacing.sm,
  },
  infoText: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: ShamahTheme.spacing.md,
  },
  infoStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoStat: {
    alignItems: 'center',
  },
  infoStatValue: {
    fontSize: ShamahTheme.typography.sizes.xl,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: ShamahColors.primary,
  },
  infoStatLabel: {
    fontSize: ShamahTheme.typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: ShamahTheme.spacing.xs,
  },
});
