// Mock para expo-media-library
// Compatível com web - simula biblioteca de mídia

export interface Asset {
  id: string;
  filename: string;
  uri: string;
  mediaType: 'photo' | 'video' | 'audio' | 'unknown';
  mediaSubtypes?: string[];
  width?: number;
  height?: number;
  creationTime: number;
  modificationTime: number;
  duration?: number;
  albumId?: string;
}

export interface Album {
  id: string;
  title: string;
  assetCount: number;
  type?: 'album' | 'moment' | 'smartAlbum';
}

export interface MediaLibraryPermissionResponse {
  status: 'granted' | 'denied' | 'undetermined';
  granted: boolean;
  canAskAgain?: boolean;
  expires?: 'never' | number;
}

export interface AssetsOptions {
  first?: number;
  after?: string;
  album?: Album | string;
  sortBy?: ('default' | 'creationTime' | 'modificationTime' | 'mediaType' | 'width' | 'height' | 'duration')[];
  mediaType?: 'photo' | 'video' | 'audio' | 'unknown' | ('photo' | 'video' | 'audio' | 'unknown')[];
}

export interface PagedInfo {
  hasNextPage: boolean;
  endCursor: string;
  totalCount: number;
}

export interface AssetsResult {
  assets: Asset[];
  endCursor: string;
  hasNextPage: boolean;
  totalCount: number;
}

export const MediaType = {
  photo: 'photo' as const,
  video: 'video' as const,
  audio: 'audio' as const,
  unknown: 'unknown' as const,
};

export const SortBy = {
  default: 'default' as const,
  creationTime: 'creationTime' as const,
  modificationTime: 'modificationTime' as const,
  mediaType: 'mediaType' as const,
  width: 'width' as const,
  height: 'height' as const,
  duration: 'duration' as const,
};

// Mock data para demonstração
const mockAssets: Asset[] = [
  {
    id: 'mock-1',
    filename: 'sample-image-1.jpg',
    uri: 'https://picsum.photos/800/600?random=1',
    mediaType: 'photo',
    width: 800,
    height: 600,
    creationTime: Date.now() - 86400000, // 1 dia atrás
    modificationTime: Date.now() - 86400000,
  },
  {
    id: 'mock-2',
    filename: 'sample-image-2.jpg',
    uri: 'https://picsum.photos/800/600?random=2',
    mediaType: 'photo',
    width: 800,
    height: 600,
    creationTime: Date.now() - 172800000, // 2 dias atrás
    modificationTime: Date.now() - 172800000,
  },
];

export async function requestPermissionsAsync(): Promise<MediaLibraryPermissionResponse> {
  console.warn('requestPermissionsAsync não disponível na web');
  return {
    status: 'granted',
    granted: true,
    canAskAgain: false,
    expires: 'never',
  };
}

export async function getPermissionsAsync(): Promise<MediaLibraryPermissionResponse> {
  console.warn('getPermissionsAsync não disponível na web');
  return {
    status: 'granted',
    granted: true,
    canAskAgain: false,
    expires: 'never',
  };
}

export async function getAssetsAsync(options: AssetsOptions = {}): Promise<AssetsResult> {
  console.warn('getAssetsAsync usando dados mock na web');
  
  const { first = 20, after = '0' } = options;
  const startIndex = parseInt(after, 10);
  const endIndex = Math.min(startIndex + first, mockAssets.length);
  
  const assets = mockAssets.slice(startIndex, endIndex);
  
  return {
    assets,
    endCursor: endIndex.toString(),
    hasNextPage: endIndex < mockAssets.length,
    totalCount: mockAssets.length,
  };
}

export async function getAssetInfoAsync(asset: Asset | string): Promise<Asset> {
  console.warn('getAssetInfoAsync usando dados mock na web');
  
  const assetId = typeof asset === 'string' ? asset : asset.id;
  const foundAsset = mockAssets.find(a => a.id === assetId);
  
  return foundAsset || mockAssets[0];
}

export async function getAlbumsAsync(): Promise<Album[]> {
  console.warn('getAlbumsAsync usando dados mock na web');
  
  return [
    {
      id: 'mock-album-1',
      title: 'Camera Roll',
      assetCount: mockAssets.length,
      type: 'album',
    },
    {
      id: 'mock-album-2', 
      title: 'Screenshots',
      assetCount: 0,
      type: 'album',
    },
  ];
}

export async function createAssetAsync(uri: string): Promise<Asset> {
  console.warn('createAssetAsync não totalmente funcional na web');
  
  const newAsset: Asset = {
    id: `mock-created-${Date.now()}`,
    filename: `created-${Date.now()}.jpg`,
    uri,
    mediaType: 'photo',
    width: 800,
    height: 600,
    creationTime: Date.now(),
    modificationTime: Date.now(),
  };
  
  mockAssets.unshift(newAsset);
  
  return newAsset;
}

export async function deleteAssetsAsync(assets: (Asset | string)[]): Promise<boolean> {
  console.warn('deleteAssetsAsync não funcional na web');
  return false;
}

export default {
  MediaType,
  SortBy,
  requestPermissionsAsync,
  getPermissionsAsync,
  getAssetsAsync,
  getAssetInfoAsync,
  getAlbumsAsync,
  createAssetAsync,
  deleteAssetsAsync,
};
