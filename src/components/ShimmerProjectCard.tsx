/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';

const SkeletonItem = ({
  width,
  height,
  borderRadius = 4,
  opacityAnim,
  style,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  opacityAnim: Animated.Value;
  style?: any;
}) => (
  <Animated.View
    style={[
      {
        width,
        height,
        borderRadius,
        backgroundColor: '#F2EBD4',
        opacity: opacityAnim,
      },
      style,
    ]}
  />
);

export default function ProjectCardShimmer() {
  const { rs } = useResponsive();
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const sharedAnimationConfig = {
      duration: 1000,
      useNativeDriver: true,
    };

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          ...sharedAnimationConfig,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          ...sharedAnimationConfig,
        }),
      ]),
    ).start();
  }, [pulseAnim]);

  return (
    <View
      className="bg-secondaryBg rounded-2xl justify-center"
      style={{
        width: rs(160),
        height: rs(160),
        paddingHorizontal: rs(12),
        gap: rs(6),
      }}
    >
      <View className="flex-row justify-between items-center">
        <SkeletonItem
          width={rs(90)}
          height={14}
          borderRadius={4}
          opacityAnim={pulseAnim}
        />
        <SkeletonItem
          width={18}
          height={18}
          borderRadius={9}
          opacityAnim={pulseAnim}
        />
      </View>
      <View className="w-full items-center py-2">
        <SkeletonItem
          width={48}
          height={48}
          borderRadius={8}
          opacityAnim={pulseAnim}
        />
      </View>
      <View className="flex-row justify-between items-center">
        <View style={{ gap: rs(6) }}>
          <View className="flex-row items-center" style={{ gap: rs(6) }}>
            <SkeletonItem
              width={14}
              height={14}
              borderRadius={7}
              opacityAnim={pulseAnim}
            />
            <SkeletonItem
              width={rs(40)}
              height={10}
              borderRadius={4}
              opacityAnim={pulseAnim}
            />
          </View>
          <View className="flex-row items-center" style={{ gap: rs(6) }}>
            <SkeletonItem
              width={14}
              height={14}
              borderRadius={7}
              opacityAnim={pulseAnim}
            />
            <SkeletonItem
              width={rs(50)}
              height={10}
              borderRadius={4}
              opacityAnim={pulseAnim}
            />
          </View>
        </View>
        <SkeletonItem
          width={24}
          height={24}
          borderRadius={12}
          opacityAnim={pulseAnim}
        />
      </View>
    </View>
  );
}
