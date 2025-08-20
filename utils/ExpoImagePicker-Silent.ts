// Mock SILENCIOSO do expo-image-picker - SEM WARNINGS

export interface ImagePickerOptions {
  mediaTypes?: 'Images' | 'Videos' | 'All';
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
  allowsMultipleSelection?: boolean;
  selectionLimit?: number;
  videoMaxDuration?: number;
}

export interface ImagePickerResult {
  canceled: boolean;
  assets?: {
    uri: string;
    width: number;
    height: number;
    type?: 'image' | 'video';
    fileSize?: number;
    duration?: number;
  }[];
}

export interface PermissionResponse {
  granted: boolean;
  canAskAgain: boolean;
  expires: string;
  status: 'granted' | 'denied' | 'undetermined';
}

// Funções SILENCIOSAS
export const requestMediaLibraryPermissionsAsync = (): Promise<PermissionResponse> => {
  return Promise.resolve({
    granted: true,
    canAskAgain: true,
    expires: 'never',
    status: 'granted'
  });
};

export const requestCameraPermissionsAsync = (): Promise<PermissionResponse> => {
  return Promise.resolve({
    granted: true,
    canAskAgain: true,
    expires: 'never',
    status: 'granted'
  });
};

export const launchImageLibraryAsync = (options?: ImagePickerOptions): Promise<ImagePickerResult> => {
  // Simular seleção de imagem na web sem warnings
  if (typeof window !== 'undefined') {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = options?.allowsMultipleSelection || false;
      
      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          const file = files[0];
          const url = URL.createObjectURL(file);
          resolve({
            canceled: false,
            assets: [{
              uri: url,
              width: 1920,
              height: 1080,
              type: 'image',
              fileSize: file.size,
            }]
          });
        } else {
          resolve({ canceled: true });
        }
      };
      
      input.click();
    });
  }
  
  return Promise.resolve({ canceled: true });
};

export const launchCameraAsync = (options?: ImagePickerOptions): Promise<ImagePickerResult> => {
  // Mock silencioso para câmera
  return Promise.resolve({ canceled: true });
};

export const MediaTypeOptions = {
  All: 'All' as const,
  Videos: 'Videos' as const,
  Images: 'Images' as const,
};

export default {
  requestMediaLibraryPermissionsAsync,
  requestCameraPermissionsAsync,
  launchImageLibraryAsync,
  launchCameraAsync,
  MediaTypeOptions,
};
