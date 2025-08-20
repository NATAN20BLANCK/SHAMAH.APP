// Mock para @react-native-async-storage/async-storage
// Compatível com web e mobile

interface AsyncStorageStatic {
  setItem: (key: string, value: string) => Promise<void>;
  getItem: (key: string) => Promise<string | null>;
  removeItem: (key: string) => Promise<void>;
  multiGet: (keys: string[]) => Promise<[string, string | null][]>;
  multiSet: (keyValuePairs: [string, string][]) => Promise<void>;
  multiRemove: (keys: string[]) => Promise<void>;
  getAllKeys: () => Promise<string[]>;
  clear: () => Promise<void>;
}

class AsyncStorageMock implements AsyncStorageStatic {
  private storage: Map<string, string> = new Map();

  async setItem(key: string, value: string): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    } else {
      this.storage.set(key, value);
    }
  }

  async getItem(key: string): Promise<string | null> {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    } else {
      return this.storage.get(key) || null;
    }
  }

  async removeItem(key: string): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    } else {
      this.storage.delete(key);
    }
  }

  async multiGet(keys: string[]): Promise<[string, string | null][]> {
    const result: [string, string | null][] = [];
    for (const key of keys) {
      const value = await this.getItem(key);
      result.push([key, value]);
    }
    return result;
  }

  async multiSet(keyValuePairs: [string, string][]): Promise<void> {
    for (const [key, value] of keyValuePairs) {
      await this.setItem(key, value);
    }
  }

  async multiRemove(keys: string[]): Promise<void> {
    for (const key of keys) {
      await this.removeItem(key);
    }
  }

  async getAllKeys(): Promise<string[]> {
    if (typeof window !== 'undefined' && window.localStorage) {
      return Object.keys(window.localStorage);
    } else {
      return Array.from(this.storage.keys());
    }
  }

  async clear(): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    } else {
      this.storage.clear();
    }
  }
}

const AsyncStorage = new AsyncStorageMock();

export default AsyncStorage;
