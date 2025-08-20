// Mock para expo-av
// Compatível com web - fornece implementações básicas para desenvolvimento

export interface AVPlaybackStatus {
  isLoaded: boolean;
  uri?: string;
  progressUpdateIntervalMillis?: number;
  positionMillis?: number;
  playableDurationMillis?: number;
  shouldPlay?: boolean;
  isPlaying?: boolean;
  isBuffering?: boolean;
  rate?: number;
  shouldCorrectPitch?: boolean;
  volume?: number;
  isMuted?: boolean;
  isLooping?: boolean;
  didJustFinish?: boolean;
}

export interface VideoProps {
  source: { uri: string } | number;
  style?: any;
  useNativeControls?: boolean;
  resizeMode?: 'contain' | 'cover' | 'stretch';
  isLooping?: boolean;
  isMuted?: boolean;
  volume?: number;
  rate?: number;
  shouldPlay?: boolean;
  onPlaybackStatusUpdate?: (status: AVPlaybackStatus) => void;
  onLoad?: (status: AVPlaybackStatus) => void;
  onError?: (error: string) => void;
  onReadyForDisplay?: (event: any) => void;
  onFullscreenUpdate?: (event: any) => void;
}

export class Video {
  static displayName = 'ExpoVideo';
  
  constructor(props: VideoProps) {
    console.warn('Video component não está disponível na web - usando mock');
  }
  
  static render(props: VideoProps) {
    if (typeof window !== 'undefined') {
      // Retorna um elemento de vídeo HTML5 básico para web
      return {
        type: 'video',
        props: {
          src: typeof props.source === 'object' ? props.source.uri : '',
          controls: props.useNativeControls,
          loop: props.isLooping,
          muted: props.isMuted,
          volume: props.volume,
          style: props.style,
          onLoad: props.onLoad,
          onError: props.onError,
        }
      };
    }
    return null;
  }
}

export class Audio {
  static displayName = 'ExpoAudio';
  
  constructor() {
    console.warn('Audio não está disponível na web - usando mock');
  }
  
  static async setAudioModeAsync(mode: any) {
    console.warn('Audio.setAudioModeAsync não disponível na web');
    return Promise.resolve();
  }
  
  static async createAsync(source: any, initialStatus?: any) {
    console.warn('Audio.createAsync não disponível na web');
    return {
      sound: new AudioMock(),
      status: { isLoaded: false }
    };
  }
}

class AudioMock {
  async playAsync() {
    console.warn('Audio.playAsync não disponível na web');
    return { status: { isPlaying: false } };
  }
  
  async pauseAsync() {
    console.warn('Audio.pauseAsync não disponível na web');
    return { status: { isPlaying: false } };
  }
  
  async stopAsync() {
    console.warn('Audio.stopAsync não disponível na web');
    return { status: { isPlaying: false } };
  }
  
  async unloadAsync() {
    console.warn('Audio.unloadAsync não disponível na web');
    return { status: { isLoaded: false } };
  }
  
  async setVolumeAsync(volume: number) {
    console.warn('Audio.setVolumeAsync não disponível na web');
    return { status: { volume } };
  }
  
  async getStatusAsync() {
    return {
      isLoaded: false,
      isPlaying: false,
      volume: 1.0,
      positionMillis: 0,
      durationMillis: 0
    };
  }
}

// Constantes de resize mode
export const ResizeMode = {
  CONTAIN: 'contain' as const,
  COVER: 'cover' as const,
  STRETCH: 'stretch' as const,
};

// Tipos e constantes de status
export const PlaybackStatus = {
  Loaded: 'loaded' as const,
  Loading: 'loading' as const,
  Error: 'error' as const,
};

export default {
  Video,
  Audio,
  ResizeMode,
  PlaybackStatus,
};
