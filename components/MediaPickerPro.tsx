import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ShamahButton from './ShamahButton';
import ShamahCard from './ShamahCard';
import { ShamahTheme } from '../constants/theme';
import { ShamahColors } from '../constants/Colors';

// Importações condicionais para evitar problemas na web
let ImagePicker: any = null;
let MediaLibrary: any = null;

if (Platform.OS !== 'web') {
  try {
    ImagePicker = require('expo-image-picker');
    MediaLibrary = require('expo-media-library');
  } catch {
    console.warn('expo-image-picker ou expo-media-library não disponível');
  }
} else {
  // Usar mocks na web
  ImagePicker = require('../utils/ExpoImagePicker').default;
  MediaLibrary = require('../utils/ExpoMediaLibrary').default;
}

interface MediaItem {
  id: string;
  uri: string;
  type: 'image' | 'video';
  filename?: string;
  width?: number;
  height?: number;
  duration?: number;
}

interface MediaPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectMedia: (media: MediaItem[]) => void;
  allowMultiple?: boolean;
  maxSelection?: number;
  mediaTypes?: 'images' | 'videos' | 'all';
}

export default function MediaPicker({ 
  visible, 
  onClose, 
  onSelectMedia, 
  allowMultiple = false, 
  maxSelection = 5,
  mediaTypes = 'all' 
}: MediaPickerProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);

  const requestPermissions = async () => {
    if (Platform.OS === 'web') {
      return true; // Na web, não precisamos de permissões específicas
    }
    
    if (!ImagePicker || !MediaLibrary) {
      Alert.alert('Erro', 'Funcionalidade não disponível nesta plataforma');
      return false;
    }

    try {
      // Solicitar permissão para galeria
      const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();
      
      // Solicitar permissão para câmera
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (mediaLibraryStatus !== 'granted' || cameraStatus !== 'granted') {
        Alert.alert(
          'Permissões Necessárias',
          'Precisamos de acesso à galeria e câmera para selecionar mídia.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Configurações', onPress: () => {
              // Abrir configurações do sistema
              Alert.alert('Configurações', 'Vá para Configurações > Shamah Publi > Permissões para habilitar acesso à galeria e câmera.');
            }}
          ]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      Alert.alert('Erro', 'Não foi possível solicitar permissões.');
      return false;
    }
  };

  const pickFromGallery = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Funcionalidade Limitada',
        'Na versão web, use o botão "Upload" para selecionar arquivos.',
        [{ text: 'OK' }]
      );
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    if (!ImagePicker) {
      Alert.alert('Erro', 'Seletor de imagens não disponível');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaTypes === 'images' ? ImagePicker.MediaTypeOptions.Images :
                   mediaTypes === 'videos' ? ImagePicker.MediaTypeOptions.Videos :
                   ImagePicker.MediaTypeOptions.All,
        allowsEditing: !allowMultiple,
        allowsMultipleSelection: allowMultiple,
        selectionLimit: allowMultiple ? maxSelection : 1,
        quality: 0.8,
        videoMaxDuration: 60, // 60 segundos máximo
      });

      if (!result.canceled && result.assets) {
        const mediaItems: MediaItem[] = result.assets.map((asset: any, index: number) => ({
          id: `gallery_${Date.now()}_${index}`,
          uri: asset.uri,
          type: asset.type === 'video' ? 'video' : 'image',
          filename: asset.fileName || `media_${Date.now()}_${index}`,
          width: asset.width,
          height: asset.height,
          duration: asset.duration
        }));

        if (allowMultiple) {
          setSelectedMedia(prev => [...prev, ...mediaItems].slice(0, maxSelection));
        } else {
          onSelectMedia(mediaItems);
          onClose();
        }
      }
    } catch (error) {
      console.error('Erro ao selecionar da galeria:', error);
      Alert.alert('Erro', 'Não foi possível selecionar mídia da galeria.');
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Funcionalidade Limitada',
        'Câmera não disponível na versão web. Use o botão "Upload" para selecionar arquivos.',
        [{ text: 'OK' }]
      );
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    if (!ImagePicker) {
      Alert.alert('Erro', 'Câmera não disponível');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: mediaTypes === 'videos' ? ImagePicker.MediaTypeOptions.Videos :
                   ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets) {
        const mediaItem: MediaItem = {
          id: `camera_${Date.now()}`,
          uri: result.assets[0].uri,
          type: result.assets[0].type === 'video' ? 'video' : 'image',
          filename: result.assets[0].fileName || `camera_${Date.now()}`,
          width: result.assets[0].width,
          height: result.assets[0].height,
          duration: result.assets[0].duration
        };

        if (allowMultiple) {
          setSelectedMedia(prev => [...prev, mediaItem].slice(0, maxSelection));
        } else {
          onSelectMedia([mediaItem]);
          onClose();
        }
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar foto.');
    }
  };

  const removeSelectedMedia = (id: string) => {
    setSelectedMedia(prev => prev.filter(item => item.id !== id));
  };

  const confirmSelection = () => {
    if (selectedMedia.length === 0) {
      Alert.alert('Aviso', 'Selecione pelo menos uma mídia.');
      return;
    }
    
    onSelectMedia(selectedMedia);
    setSelectedMedia([]);
    onClose();
  };

  const getMediaTypeIcon = (type: 'image' | 'video') => {
    return type === 'video' ? 'videocam' : 'image';
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Selecionar Mídia</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={ShamahColors.neutral[600]} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Escolha fotos ou vídeos para seu post
          </Text>

          {/* Opções de Seleção */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.optionButton} onPress={pickFromGallery}>
              <View style={[styles.optionIcon, { backgroundColor: ShamahColors.primary }]}>
                <Ionicons name="images" size={24} color="white" />
              </View>
              <Text style={styles.optionLabel}>Galeria</Text>
              <Text style={styles.optionDescription}>Selecionar da galeria</Text>
            </TouchableOpacity>

            {mediaTypes !== 'videos' && (
              <TouchableOpacity style={styles.optionButton} onPress={takePhoto}>
                <View style={[styles.optionIcon, { backgroundColor: ShamahColors.success }]}>
                  <Ionicons name="camera" size={24} color="white" />
                </View>
                <Text style={styles.optionLabel}>Câmera</Text>
                <Text style={styles.optionDescription}>Tirar foto</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Mídia Selecionada */}
          {allowMultiple && selectedMedia.length > 0 && (
            <View style={styles.selectedSection}>
              <Text style={styles.sectionTitle}>
                Selecionadas ({selectedMedia.length}/{maxSelection})
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.selectedMedia}>
                  {selectedMedia.map((item) => (
                    <View key={item.id} style={styles.selectedItem}>
                      <View style={styles.mediaPreview}>
                        <Ionicons 
                          name={getMediaTypeIcon(item.type)} 
                          size={20} 
                          color={ShamahColors.primary} 
                        />
                        <Text style={styles.mediaName} numberOfLines={1}>
                          {item.filename}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeSelectedMedia(item.id)}
                      >
                        <Ionicons name="close-circle" size={20} color={ShamahColors.danger} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Informações */}
          <ShamahCard variant="outlined" style={styles.infoCard}>
            <View style={styles.infoContent}>
              <Ionicons name="information-circle-outline" size={20} color={ShamahColors.primary} />
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Formatos Suportados</Text>
                <Text style={styles.infoDescription}>
                  • Imagens: JPG, PNG, GIF{'\n'}
                  • Vídeos: MP4, MOV (máx. 60s){'\n'}
                  • Máximo {maxSelection} arquivos
                </Text>
              </View>
            </View>
          </ShamahCard>

          {/* Botões */}
          <View style={styles.buttonContainer}>
            {allowMultiple && selectedMedia.length > 0 && (
              <ShamahButton
                title={`Confirmar (${selectedMedia.length})`}
                variant="primary"
                onPress={confirmSelection}
                style={styles.confirmButton}
              />
            )}
            <ShamahButton
              title="Cancelar"
              variant="outline"
              onPress={onClose}
              style={styles.cancelButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: ShamahTheme.borderRadius.xl,
    borderTopRightRadius: ShamahTheme.borderRadius.xl,
    paddingHorizontal: ShamahTheme.spacing.lg,
    paddingTop: ShamahTheme.spacing.lg,
    paddingBottom: ShamahTheme.spacing.xl,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ShamahTheme.spacing.sm,
  },
  title: {
    fontSize: ShamahTheme.typography.sizes.xl,
    fontWeight: ShamahTheme.typography.weights.bold,
    color: ShamahColors.neutral[900],
  },
  closeButton: {
    padding: ShamahTheme.spacing.xs,
  },
  subtitle: {
    fontSize: ShamahTheme.typography.sizes.base,
    color: ShamahColors.neutral[600],
    marginBottom: ShamahTheme.spacing.lg,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: ShamahTheme.spacing.md,
    marginBottom: ShamahTheme.spacing.lg,
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    padding: ShamahTheme.spacing.md,
    borderRadius: ShamahTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: ShamahColors.neutral[200],
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: ShamahTheme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ShamahTheme.spacing.sm,
  },
  optionLabel: {
    fontSize: ShamahTheme.typography.sizes.base,
    fontWeight: ShamahTheme.typography.weights.semibold,
    color: ShamahColors.neutral[900],
    marginBottom: ShamahTheme.spacing.xs,
  },
  optionDescription: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: ShamahColors.neutral[600],
    textAlign: 'center',
  },
  selectedSection: {
    marginBottom: ShamahTheme.spacing.lg,
  },
  sectionTitle: {
    fontSize: ShamahTheme.typography.sizes.base,
    fontWeight: ShamahTheme.typography.weights.semibold,
    color: ShamahColors.neutral[900],
    marginBottom: ShamahTheme.spacing.sm,
  },
  selectedMedia: {
    flexDirection: 'row',
    gap: ShamahTheme.spacing.sm,
  },
  selectedItem: {
    width: 120,
    padding: ShamahTheme.spacing.sm,
    borderRadius: ShamahTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: ShamahColors.neutral[200],
    backgroundColor: ShamahColors.neutral[50],
  },
  mediaPreview: {
    alignItems: 'center',
    marginBottom: ShamahTheme.spacing.xs,
  },
  mediaName: {
    fontSize: ShamahTheme.typography.sizes.xs,
    color: ShamahColors.neutral[600],
    marginTop: ShamahTheme.spacing.xs,
  },
  removeButton: {
    alignSelf: 'center',
  },
  infoCard: {
    marginBottom: ShamahTheme.spacing.lg,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ShamahTheme.spacing.sm,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: ShamahTheme.typography.sizes.sm,
    fontWeight: ShamahTheme.typography.weights.semibold,
    color: ShamahColors.neutral[900],
    marginBottom: ShamahTheme.spacing.xs,
  },
  infoDescription: {
    fontSize: ShamahTheme.typography.sizes.xs,
    color: ShamahColors.neutral[600],
    lineHeight: 16,
  },
  buttonContainer: {
    gap: ShamahTheme.spacing.sm,
  },
  confirmButton: {
    marginBottom: ShamahTheme.spacing.sm,
  },
  cancelButton: {
    marginBottom: 0,
  },
});
