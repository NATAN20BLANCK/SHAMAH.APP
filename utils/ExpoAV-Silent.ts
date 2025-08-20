// Mock SILENCIOSO do expo-av para web - SEM WARNINGS

export interface AVPlaybackStatus {
  isLoaded: boolean;
  uri?: string;
  positionMillis?: number;
  playableDurationMillis?: number;
  shouldPlay?: boolean;
  isPlaying?: boolean;
  isBuffering?: boolean;
  rate?: number;
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

// Mock SILENCIOSO do Video
export const Video = function VideoComponent(props: VideoProps) {
  return null; // Componente vazio sem warnings
};

// Mock SILENCIOSO do Audio
export const Audio = {
  setAudioModeAsync: () => Promise.resolve(),
  createAsync: () => Promise.resolve({
    playAsync: () => Promise.resolve(),
    pauseAsync: () => Promise.resolve(),
    stopAsync: () => Promise.resolve(),
    unloadAsync: () => Promise.resolve(),
    setVolumeAsync: () => Promise.resolve(),
    getStatusAsync: () => Promise.resolve({ isLoaded: false }),
  }),
};

export const ResizeMode = {
  CONTAIN: 'contain',
  COVER: 'cover',
  STRETCH: 'stretch',
};

export const AVPlaybackStatusToSet = {};

export default {
  Video,
  Audio,
  ResizeMode,
  AVPlaybackStatusToSet,
};
