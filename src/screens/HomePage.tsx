import React, { useState, useCallback, useEffect } from 'react';
import { View, StatusBar, Platform, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsive } from '../hooks/useResponsive';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import Ionicons from '@react-native-vector-icons/ionicons';
import ProjectCard from '../components/ProjectCard';
import { useFocusEffect } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import FloatingActionButton from '../components/FloatingActionButton';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_CLIENT_ID } from '@env';

export default function HomePage() {
  const { rs } = useResponsive();
  const [searchText, setSearchText] = useState('');

  useFocusEffect(
    useCallback(() => {
      Orientation.lockToPortrait();

      StatusBar.setHidden(false);

      if (Platform.OS === 'android') {
        SystemNavigationBar.navigationShow();
        SystemNavigationBar.setNavigationColor('transparent');
      }
    }, []),
  );

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_CLIENT_ID,
      offlineAccess: true,
    });
  }, []);

  const handleGoogleSignin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) console.error('id token bulunamadı');

      const response = await fetch(
        'http://localhost:5091/api/auth/google-signin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        },
      );

      if (!response.ok) {
        return false;
      } else {
        console.log('google sign in başarılı');
        const tokenData = response.json();
        console.log(tokenData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-main"
      style={{ padding: rs(20), gap: rs(20) }}
      edges={['top', 'bottom']}
    >
      <Header />
      <View style={{ gap: rs(20) }}>
        <SearchBar
          placeholder="Search projects..."
          value={searchText}
          handleTextChange={(text: string) => setSearchText(text)}
          rightIcon={<Ionicons name="search" size={24} color="#ec6426" />}
        />
        {Array.from([1, 2], index => (
          <ProjectCard key={index} />
        ))}
      </View>
      <Pressable onPress={handleGoogleSignin}>
        <Text>Google Sign In</Text>
      </Pressable>
      <FloatingActionButton />
    </SafeAreaView>
  );
}
