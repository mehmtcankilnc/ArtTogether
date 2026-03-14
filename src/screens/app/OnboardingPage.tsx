import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';

export default function OnboardingPage() {
  const { loginGoogle, loginGuest } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleGoogleSignin = async () => {
    const res = await loginGoogle();
    if (res) {
      navigation.replace('App');
    }
  };

  const handleGuestSignin = async () => {
    const res = await loginGuest();
    if (res) {
      navigation.replace('App');
    }
  };

  return (
    <View className="flex-1 items-center justify-center gap-20">
      <Text>OnboardingPage</Text>
      <View className="flex-row w-full gap-10 justify-center">
        <Pressable
          onPress={handleGoogleSignin}
          className="p-4 bg-action rounded-md"
        >
          <Text className="text-white">Google Signin</Text>
        </Pressable>
        <Pressable
          onPress={handleGuestSignin}
          className="p-4 bg-action rounded-md"
        >
          <Text className="text-white">Guest Signin</Text>
        </Pressable>
      </View>
    </View>
  );
}
