import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShamahTheme } from '../constants/theme';
import { ShamahColors } from '../constants/Colors';

const { width } = Dimensions.get('window');

interface MediaItem {
  id: string;
  uri: string;
  type: 'image' | 'video';
  filename?: string;
  width?: number;
  height?: number;
  duration?: number;
}

interface MediaPreviewProps {
  mediaItems: MediaItem[];
  onRemoveItem?: (id: string) => void;
  onEditItem?: (id: string) => void;
  editable?: boolean;
  style?: any;
}

export default function MediaPreview({ 
  mediaItems, 
  onRemoveItem, 
  onEditItem, 
  editable = false,
  style 
}: MediaPreviewProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMediaItem = (item: MediaItem, index: number) => {
    const isVideo = item.type === 'video';
    const itemWidth = mediaItems.length === 1 ? width - 32 : (width - 48) / 2;
    
    return (
      <View key={item.id} style={[styles.mediaItem, { width: itemWidth }]}>
        {/* Preview da Mídia */}
        <View style={styles.mediaContainer}>
          <Image
            source={{ uri: item.uri }}
            style={styles.mediaImage}
            resizeMode="cover"
          />
          
          {/* Overlay para vídeos */}
          {isVideo && (
            <View style={styles.videoOverlay}>
              <View style={styles.videoIcon}>
                <Ionicons name="play" size={20} color="white" />
              </View>
              {item.duration && (
                <Text style={styles.videoDuration}>
                  {formatDuration(item.duration)}
                </Text>
              )}
            </View>
          )}
          
          {/* Botões de Ação */}
          {editable && (
            <View style={styles.actionButtons}>
              {onRemoveItem && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.removeButton]}
                  onPress={() => onRemoveItem(item.id)}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              )}
              {onEditItem && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => onEditItem(item.id)}
                >
                  <Ionicons name="create" size={16} color="white" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        
        {/* Informações da Mídia */}
        <View style={styles.mediaInfo}>
          <View style={styles.mediaDetails}>
            <Ionicons 
              name={isVideo ? 'videocam' : 'image'} 
              size={14} 
              color={ShamahColors.neutral[600]} 
            />
            <Text style={styles.mediaName} numberOfLines={1}>
              {item.filename || 'Mídia'}
            </Text>
          </View>
          
          {item.width && item.height && (
            <Text style={styles.mediaDimensions}>
              {item.width}x{item.height}
            </Text>
          )}
        </View>
      </View>
    );
  };

  if (mediaItems.length === 0) {
    return (
      <View style={[styles.emptyState, style]}>
        <Ionicons name="images-outline" size={48} color={ShamahColors.neutral[400]} />
        <Text style={styles.emptyText}>Nenhuma mídia selecionada</Text>
        <Text style={styles.emptySubtext}>Toque em &quot;Adicionar Mídia&quot; para começar</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Mídia Selecionada ({mediaItems.length})
        </Text>
        {editable && (
          <Text style={styles.subtitle}>
            Toque nos ícones para editar ou remover
          </Text>
        )}
      </View>
      
      <View style={styles.mediaGrid}>
        {mediaItems.map((item, index) => renderMediaItem(item, index))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: ShamahTheme.spacing.md,
  },
  header: {
    marginBottom: ShamahTheme.spacing.md,
  },
  title: {
    fontSize: ShamahTheme.typography.sizes.lg,
    fontWeight: ShamahTheme.typography.weights.semibold,
    color: ShamahColors.neutral[900],
    marginBottom: ShamahTheme.spacing.xs,
  },
  subtitle: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: ShamahColors.neutral[600],
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ShamahTheme.spacing.md,
  },
  mediaItem: {
    backgroundColor: ShamahColors.neutral[50],
    borderRadius: ShamahTheme.borderRadius.lg,
    overflow: 'hidden',
  },
  mediaContainer: {
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: 150,
    backgroundColor: ShamahColors.neutral[200],
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ShamahTheme.spacing.sm,
  },
  videoDuration: {
    position: 'absolute',
    bottom: ShamahTheme.spacing.xs,
    right: ShamahTheme.spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    fontSize: ShamahTheme.typography.sizes.xs,
    paddingHorizontal: ShamahTheme.spacing.xs,
    paddingVertical: 2,
    borderRadius: ShamahTheme.borderRadius.sm,
  },
  actionButtons: {
    position: 'absolute',
    top: ShamahTheme.spacing.xs,
    right: ShamahTheme.spacing.xs,
    flexDirection: 'row',
    gap: ShamahTheme.spacing.xs,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: ShamahColors.danger,
  },
  editButton: {
    backgroundColor: ShamahColors.primary,
  },
  mediaInfo: {
    padding: ShamahTheme.spacing.sm,
  },
  mediaDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShamahTheme.spacing.xs,
    marginBottom: ShamahTheme.spacing.xs,
  },
  mediaName: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: ShamahColors.neutral[900],
    flex: 1,
  },
  mediaDimensions: {
    fontSize: ShamahTheme.typography.sizes.xs,
    color: ShamahColors.neutral[600],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ShamahTheme.spacing.xl * 2,
    backgroundColor: ShamahColors.neutral[50],
    borderRadius: ShamahTheme.borderRadius.lg,
    borderWidth: 2,
    borderColor: ShamahColors.neutral[200],
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: ShamahTheme.typography.sizes.base,
    fontWeight: ShamahTheme.typography.weights.semibold,
    color: ShamahColors.neutral[600],
    marginTop: ShamahTheme.spacing.md,
  },
  emptySubtext: {
    fontSize: ShamahTheme.typography.sizes.sm,
    color: ShamahColors.neutral[500],
    marginTop: ShamahTheme.spacing.xs,
    textAlign: 'center',
  },
});
