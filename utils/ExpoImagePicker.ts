// Mock para expo-image-picker
// Compatível com web - usa input file para simulação

export interface ImagePickerOptions {
  mediaTypes?: 'Images' | 'Videos' | 'All';
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
  allowsMultipleSelection?: boolean;
  base64?: boolean;
  exif?: boolean;
}

export interface ImagePickerAsset {
  uri: string;
  width: number;
  height: number;
  type?: 'image' | 'video';
  fileName?: string;
  fileSize?: number;
  base64?: string;
  exif?: any;
}

export interface ImagePickerResult {
  cancelled?: boolean;
  canceled?: boolean;
  assets?: ImagePickerAsset[];
}

export const MediaTypeOptions = {
  All: 'All' as const,
  Videos: 'Videos' as const,
  Images: 'Images' as const,
};

export async function requestMediaLibraryPermissionsAsync(): Promise<{ status: string; granted: boolean }> {
  console.warn('requestMediaLibraryPermissionsAsync não disponível na web');
  return { status: 'granted', granted: true };
}

export async function requestCameraPermissionsAsync(): Promise<{ status: string; granted: boolean }> {
  console.warn('requestCameraPermissionsAsync não disponível na web');
  return { status: 'granted', granted: true };
}

export async function launchImageLibraryAsync(options: ImagePickerOptions = {}): Promise<ImagePickerResult> {
  if (typeof window === 'undefined') {
    console.warn('launchImageLibraryAsync não disponível fora do browser');
    return { canceled: true };
  }

  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = options.mediaTypes === 'Videos' ? 'video/*' : 
                   options.mediaTypes === 'Images' ? 'image/*' : 
                   'image/*,video/*';
    input.multiple = options.allowsMultipleSelection || false;

    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (!files || files.length === 0) {
        resolve({ canceled: true });
        return;
      }

      const assets: ImagePickerAsset[] = [];
      let filesProcessed = 0;

      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const asset: ImagePickerAsset = {
            uri: e.target?.result as string,
            width: 0, // Será determinado quando a imagem carregar
            height: 0,
            type: file.type.startsWith('image/') ? 'image' : 'video',
            fileName: file.name,
            fileSize: file.size,
          };

          if (options.base64 && file.type.startsWith('image/')) {
            asset.base64 = (e.target?.result as string).split(',')[1];
          }

          assets.push(asset);
          filesProcessed++;

          if (filesProcessed === files.length) {
            resolve({ 
              canceled: false, 
              assets: assets.slice(0, options.allowsMultipleSelection ? assets.length : 1)
            });
          }
        };

        reader.readAsDataURL(file);
      });
    };

    input.oncancel = () => {
      resolve({ canceled: true });
    };

    input.click();
  });
}

export async function launchCameraAsync(options: ImagePickerOptions = {}): Promise<ImagePickerResult> {
  if (typeof window === 'undefined' || !navigator.mediaDevices) {
    console.warn('launchCameraAsync não disponível');
    return { canceled: true };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: true, 
      audio: options.mediaTypes === 'Videos' 
    });

    // Simular captura de câmera (implementação básica)
    console.warn('Câmera simulada na web - implementação completa requer mais código');
    
    // Parar o stream
    stream.getTracks().forEach(track => track.stop());
    
    return { canceled: true };
  } catch (error) {
    console.error('Erro ao acessar câmera:', error);
    return { canceled: true };
  }
}

export default {
  MediaTypeOptions,
  requestMediaLibraryPermissionsAsync,
  requestCameraPermissionsAsync,
  launchImageLibraryAsync,
  launchCameraAsync,
};
