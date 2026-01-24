/* eslint-disable react-native/no-inline-styles */
import { View, Text, Image, Pressable } from 'react-native';
import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import Ionicons from '@react-native-vector-icons/ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ProjectCard() {
  const { rs } = useResponsive();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const onPressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 100 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
  };

  return (
    <AnimatedPressable
      onPress={() => {
        onPressIn();
        navigation.navigate('Canvas', { projectId: '123' });
      }}
      onPressOut={onPressOut}
      className="w-full bg-white rounded-lg elevation-md flex-row items-center justify-between"
      style={[{ padding: rs(20), gap: rs(20) }, animatedStyle]}
    >
      <Image
        source={{
          uri: 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
        }}
        style={{ width: 100, height: 100, borderRadius: 4 }}
      />
      <View className="flex-1" style={{ gap: rs(16) }}>
        <Text style={{ fontFamily: 'Nunito-SemiBold', fontSize: rs(20) }}>
          Project Title
        </Text>
        <View style={{ gap: rs(6) }}>
          <View className="flex-row items-center" style={{ gap: rs(6) }}>
            <Ionicons name="time-outline" size={rs(16)} color="#666" />
            <Text
              style={{
                fontFamily: 'Nunito-Regular',
                fontSize: rs(14),
                color: '#666',
              }}
            >
              2 hours ago
            </Text>
          </View>

          <View className="flex-row items-center" style={{ gap: rs(6) }}>
            <Ionicons name="people-outline" size={rs(16)} color="#666" />
            <Text
              style={{
                fontFamily: 'Nunito-Regular',
                fontSize: rs(14),
                color: '#666',
              }}
            >
              3 people
            </Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#ec6426" />
    </AnimatedPressable>
  );
}
