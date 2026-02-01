import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Storage } from '../utils/storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';

export default function SplashPage() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const checkAuth = () => {
      const isGuest = Storage.isGuestUser();
      const accessToken = Storage.getAccessToken();

      if (isGuest) {
        navigation.replace('Home');
      } else if (accessToken) {
        navigation.replace('Home');
      } else {
        console.log('No login');
        navigation.replace('Onboarding');
      }
    };

    checkAuth();
  }, [navigation]);

  return (
    <View>
      <Text>Splash</Text>
    </View>
  );
}
