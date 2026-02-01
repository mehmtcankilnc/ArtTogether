/* eslint-disable react-native/no-inline-styles */
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AppStack from './src/navigation/AppStack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthProvider from './src/context/AuthContext';
import { StatusBar } from 'react-native';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <SafeAreaProvider>
          <SafeAreaView
            style={{ flex: 1, backgroundColor: '#FDFDFD' }}
            edges={['bottom', 'left', 'right']}
          >
            <StatusBar barStyle="light-content" />
            <NavigationContainer>
              <AppStack />
            </NavigationContainer>
          </SafeAreaView>
        </SafeAreaProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
