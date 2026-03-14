import { NavigatorScreenParams } from '@react-navigation/native';

export type CanvasStackParamList = {
  Canvas: { projectId: string };
  Settings: { projectId: string };
};

export type AppStackParamList = {
  Home: undefined;
  CanvasStack: NavigatorScreenParams<CanvasStackParamList>;
  Notifications: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  App: undefined;
};
