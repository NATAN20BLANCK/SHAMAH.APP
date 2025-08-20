import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';

interface MediaPickerProps {
  visible: boolean;
  onClose: () => void;
  onMediaSelect: (media: any[]) => void;
  multiple?: boolean;
  mediaTypes?: 'images' | 'videos' | 'all';
  maxFiles?: number;
}

export default function MediaPickerSimple({
  visible,
  onClose,
  onMediaSelect,
  multiple = true,
  mediaTypes = 'all',
  maxFiles = 5,
}: MediaPickerProps) {
  const [selectedMedia, setSelectedMedia] = useState<any[]>([]);

  const handleGalleryPick = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Aviso', 'Seleção de galeria não disponível na web. Use a versão mobile.');
      return;
    }

    try {
      // Simular seleção de mídia
      const mockMedia = [
        { uri: 'mock-image-1.jpg', type: 'image', filename: 'image1.jpg' },
        { uri: 'mock-image-2.jpg', type: 'image', filename: 'image2.jpg' },
      ];
      
      onMediaSelect(mockMedia);
      onClose();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao acessar galeria');
    }
  };

  const handleCameraPick = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Aviso', 'Câmera não disponível na web. Use a versão mobile.');
      return;
    }

    try {
      // Simular captura de câmera
      const mockPhoto = { uri: 'mock-camera-photo.jpg', type: 'image', filename: 'camera.jpg' };
      onMediaSelect([mockPhoto]);
      onClose();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao acessar câmera');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Selecionar Mídia</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <TouchableOpacity style={styles.option} onPress={handleGalleryPick}>
              <Text style={styles.optionIcon}>📱</Text>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Galeria</Text>
                <Text style={styles.optionSubtitle}>Escolher da galeria de fotos</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={handleCameraPick}>
              <Text style={styles.optionIcon}>📷</Text>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Câmera</Text>
                <Text style={styles.optionSubtitle}>Tirar uma nova foto</Text>
              </View>
            </TouchableOpacity>

            {Platform.OS === 'web' && (
              <View style={styles.webNotice}>
                <Text style={styles.webNoticeText}>
                  📝 Na versão web, esta é uma demonstração.{'\n'}
                  Use a versão mobile para funcionalidade completa.
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  webNotice: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  webNoticeText: {
    fontSize: 14,
    color: '#92400e',
    textAlign: 'center',
    lineHeight: 20,
  },
});
