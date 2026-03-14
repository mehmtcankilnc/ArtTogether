/* eslint-disable react-native/no-inline-styles */
import './global.css';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RootNavigation from './src/navigation/RootNavigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthProvider from './src/context/AuthContext';
import { StatusBar } from 'react-native';
import Orientation from 'react-native-orientation-locker';

export default function App() {
  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <SafeAreaProvider>
          <SafeAreaView
            style={{ flex: 1, backgroundColor: '#FDFDFD' }}
            edges={['bottom']}
          >
            <StatusBar barStyle="dark-content" />
            <NavigationContainer>
              <RootNavigation />
            </NavigationContainer>
          </SafeAreaView>
        </SafeAreaProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
