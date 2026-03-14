import React from 'react';
import CanvasProvider from '../context/CanvasContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProjectSettings from '../screens/canvas/ProjectSettings';
import CanvasPage from '../screens/canvas/CanvasPage';

const Stack = createNativeStackNavigator();

export default function CanvasStack() {
  return (
    <CanvasProvider>
      <Stack.Navigator
        initialRouteName="Canvas"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_left',
        }}
      >
        <Stack.Screen name="Canvas" component={CanvasPage} />
        <Stack.Screen name="Settings" component={ProjectSettings} />
      </Stack.Navigator>
    </CanvasProvider>
  );
}
