import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '../screens/app/HomePage';
import Notifications from '../screens/app/Notifications';
import CanvasStack from './CanvasStack';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="CanvasStack" component={CanvasStack} />
      <Stack.Screen name="Notifications" component={Notifications} />
    </Stack.Navigator>
  );
}
