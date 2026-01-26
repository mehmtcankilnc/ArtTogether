/* eslint-disable react-native/no-inline-styles */
import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useResponsive } from '../hooks/useResponsive';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type Props = {};

export default function FloatingActionButton({}: Props) {
  const { rs } = useResponsive();

  const width = useSharedValue(rs(50));
  const height = useSharedValue(rs(50));
  const borderRadius = useSharedValue(rs(40));
  const isOpen = useSharedValue(false);
  const progress = useDerivedValue(() =>
    isOpen.value ? withTiming(1) : withTiming(0),
  );

  const handlePress = () => {
    if (!isOpen.value) {
      width.value = withSpring(rs(180));
      height.value = withSpring(rs(180));
      borderRadius.value = withSpring(rs(10));
      isOpen.value = true;
    } else {
      width.value = withTiming(rs(50));
      height.value = withTiming(rs(50));
      borderRadius.value = withTiming(rs(40));
      isOpen.value = false;
    }
  };

  const plusIcon = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progress.value * 45}deg` }],
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: height.value,
      borderRadius: borderRadius.value,
    };
  });

  return (
    <View className="flex-1">
      <Animated.View
        className="absolute bg-action overflow-hidden"
        style={[{ bottom: rs(20), right: rs(20) }, animatedStyle]}
      >
        <Pressable
          onPress={handlePress}
          className="items-center justify-center"
          style={{ width: rs(50), height: rs(50), borderRadius: rs(40) }}
        >
          <Animated.View
            className="items-center justify-center"
            style={[
              { width: rs(50), height: rs(50), borderRadius: rs(40) },
              plusIcon,
            ]}
          >
            <Ionicons name="add-outline" size={rs(40)} color="white" />
          </Animated.View>
        </Pressable>
        <View
          className="flex-row items-center overflow-hidden"
          style={{ paddingHorizontal: rs(8), gap: rs(4) }}
        >
          <View
            className="items-center justify-center"
            style={{ width: rs(50), height: rs(50), borderRadius: rs(40) }}
          >
            <Ionicons name="document-outline" size={rs(40)} color="white" />
          </View>
          <Text
            style={{
              fontFamily: 'Nunito-Medium',
              fontSize: rs(16),
              color: 'white',
            }}
          >
            New Project
          </Text>
        </View>
        <View
          className="flex-row items-center overflow-hidden"
          style={{ paddingHorizontal: rs(8), gap: rs(4) }}
        >
          <View
            className="items-center justify-center"
            style={{ width: rs(50), height: rs(50), borderRadius: rs(40) }}
          >
            <Ionicons name="folder-open-outline" size={rs(40)} color="white" />
          </View>
          <Text
            style={{
              fontFamily: 'Nunito-Medium',
              fontSize: rs(16),
              color: 'white',
            }}
          >
            New Project
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
