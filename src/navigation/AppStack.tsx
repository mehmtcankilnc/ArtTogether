import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '../screens/HomePage';
import CanvasPage from '../screens/CanvasPage';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="Canvas" component={CanvasPage} />
    </Stack.Navigator>
  );
}
