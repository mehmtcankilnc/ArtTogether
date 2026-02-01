import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({
  id: 'app-storage',
});

export enum StorageKeys {
  ACCESS_TOKEN = 'auth.accessToken',
  REFRESH_TOKEN = 'auth.refreshToken',
  IS_GUEST = 'auth.isGuest',
  USER_PROFILE = 'user.profile',
}

export type UserProfile = {
  name: string;
  email: string;
  photo: string | null;
};

class StorageService {
  getAccessToken() {
    return storage.getString(StorageKeys.ACCESS_TOKEN);
  }

  setAccessToken(token: string) {
    storage.set(StorageKeys.ACCESS_TOKEN, token);
  }

  getRefreshToken() {
    return storage.getString(StorageKeys.REFRESH_TOKEN);
  }

  setRefreshToken(token: string) {
    storage.set(StorageKeys.REFRESH_TOKEN, token);
  }

  isGuestUser() {
    return storage.getBoolean(StorageKeys.IS_GUEST);
  }

  setIsGuest(value: boolean) {
    storage.set(StorageKeys.IS_GUEST, value);
  }

  setUser(value: UserProfile) {
    storage.set(StorageKeys.USER_PROFILE, JSON.stringify(value));
  }

  getUser(): UserProfile | null {
    const jsonString = storage.getString(StorageKeys.USER_PROFILE);
    if (!jsonString) return null;
    try {
      return JSON.parse(jsonString) as UserProfile;
    } catch (e) {
      console.error('Storage parse error:', e);
      return null;
    }
  }

  removeItem(key: StorageKeys) {
    storage.remove(key);
  }

  clearAll() {
    storage.clearAll();
  }
}

export const Storage = new StorageService();
