import Ionicons from '@react-native-vector-icons/ionicons';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsive } from '../hooks/useResponsive';

export type GestureMode = 'draw' | 'view';

interface ToolbarProps {
  activeMode: GestureMode;
  onModeChange: (mode: GestureMode) => void;
  onBack: () => void;
}

export default function Toolbar({
  activeMode,
  onModeChange,
  onBack,
}: ToolbarProps) {
  const { rs, iconSize } = useResponsive();

  return (
    <SafeAreaView className="absolute top-0 left-0 right-0 bottom-0 z-50 bg-transparent">
      <View className="flex-row justify-between items-center px-5 py-2">
        <TouchableOpacity
          onPress={onBack}
          style={{ width: rs(35), height: rs(35) }}
          className="rounded-full bg-white justify-center items-center elevation-md"
        >
          <Ionicons name="arrow-back" size={iconSize} color="#333" />
        </TouchableOpacity>
        <View className="flex-row bg-white rounded-3xl p-1 elevation-md">
          <TouchableOpacity
            className={`flex-row items-center py-2 px-4 rounded-2xl ${
              activeMode === 'draw' && 'bg-[#ec6426]'
            }`}
            onPress={() => onModeChange('draw')}
          >
            <Ionicons
              name="pencil"
              size={iconSize}
              color={activeMode === 'draw' ? '#fff' : '#666'}
            />
            <Text
              className={`ml-2 text-base font-semibold color-[#666] ${
                activeMode === 'draw' && 'color-white'
              }`}
            >
              Çiz
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-row items-center py-2 px-4 rounded-2xl ${
              activeMode === 'view' && 'bg-[#ec6426]'
            }`}
            onPress={() => onModeChange('view')}
          >
            <Ionicons
              name="hand-left-outline"
              size={iconSize}
              color={activeMode === 'view' ? '#fff' : '#666'}
            />
            <Text
              className={`ml-2 text-base font-semibold color-[#666] ${
                activeMode === 'view' && 'color-white'
              }`}
            >
              Gez
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
