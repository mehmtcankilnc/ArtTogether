import React, { useState, useCallback } from 'react';
import { View, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsive } from '../hooks/useResponsive';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import Ionicons from '@react-native-vector-icons/ionicons';
import ProjectCard from '../components/ProjectCard';
import { useFocusEffect } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import SystemNavigationBar from 'react-native-system-navigation-bar';

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
    </SafeAreaView>
  );
}
