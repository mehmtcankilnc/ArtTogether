import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '../screens/HomePage';
import CanvasPage from '../screens/CanvasPage';
import SplashPage from '../screens/SplashPage';
import OnboardingPage from '../screens/OnboardingPage';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashPage} />
      <Stack.Screen name="Onboarding" component={OnboardingPage} />
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="Canvas" component={CanvasPage} />
    </Stack.Navigator>
  );
}
