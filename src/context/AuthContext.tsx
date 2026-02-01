import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Storage } from '../utils/storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { API_BASE_URL, GOOGLE_CLIENT_ID } from '@env';

interface User {
  name: string;
  email: string;
  photo: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginGuest: () => Promise<boolean>;
  loginGoogle: () => Promise<boolean>;
  authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadtoken = () => {
      const storedToken = Storage.getAccessToken();
      if (storedToken) {
        setAccessToken(storedToken);
      }
      setIsLoading(false);
    };

    loadtoken();

    GoogleSignin.configure({
      webClientId: GOOGLE_CLIENT_ID,
      offlineAccess: true,
    });
  }, []);

  useEffect(() => {
    if (accessToken) {
      try {
        setUser(Storage.getUser());
      } catch (error) {
        console.error(error);
        setUser(null);
      }
    }
  }, [accessToken]);

  const loginGuest = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/guest-signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return false;
      } else {
        const tokenData = await response.json();
        Storage.setAccessToken(tokenData.accessToken);
        Storage.setRefreshToken(tokenData.refreshToken);
        Storage.setIsGuest(true);

        return true;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const loginGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) console.error('id token bulunamadı');

      const response = await fetch(`${API_BASE_URL}/api/auth/google-signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        return false;
      } else {
        const tokenData = await response.json();
        Storage.setAccessToken(tokenData.accessToken);
        Storage.setRefreshToken(tokenData.refreshToken);
        Storage.setIsGuest(false);

        const userData: User = {
          name: userInfo.data?.user.givenName || '',
          email: userInfo.data?.user.email || '',
          photo: userInfo.data?.user.photo || null,
        };

        Storage.setUser(userData);
        return true;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const refreshTokenLogic = async (): Promise<string | null> => {
    try {
      const currentAccessToken = Storage.getAccessToken();
      const currentRefreshToken = Storage.getRefreshToken();

      if (!currentAccessToken || !currentRefreshToken) return null;

      const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: currentAccessToken,
          refreshToken: currentRefreshToken,
        }),
      });

      if (!response.ok) throw new Error('Refresh Başarısız Oldu');

      const data: AuthResponse = await response.json();
      Storage.setAccessToken(data.accessToken);
      Storage.setRefreshToken(data.refreshToken);
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch (error) {
      console.error('Token Yenilenemedi, çıkış yapılıyor... ', error); //log out eklicez
      return null;
    }
  };

  const authenticatedFetch = async (
    endpoint: string,
    options: RequestInit = {},
  ) => {
    let currentAccessToken = accessToken;

    let response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${currentAccessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      const newAccessToken = await refreshTokenLogic();

      if (newAccessToken) {
        response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json',
          },
        });
      }
    }

    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        isAuthenticated: !!accessToken,
        isLoading,
        loginGuest,
        loginGoogle,
        authenticatedFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
