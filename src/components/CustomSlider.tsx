/* eslint-disable react-native/no-inline-styles */
import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { GestureMode } from './Toolbar';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useResponsive } from '../hooks/useResponsive';
import { runOnJS } from 'react-native-worklets';

type Props = {
  type: GestureMode;
  isLandscape: boolean | undefined;
  brushWidth: number;
  eraserWidth: number;
  onWidthChange: (type: GestureMode, width: number) => void;
};

export default function CustomSlider({
  type,
  isLandscape,
  brushWidth,
  eraserWidth,
  onWidthChange,
}: Props) {
  const { rs } = useResponsive();

  const MAX_WIDTH = type === 'draw' ? 50 : 100;
  const TRACK_LENGTH = rs(200);
  const THUMB_SIZE = rs(24);

  const activeWidth = type === 'draw' ? brushWidth : eraserWidth;

  const progress = useSharedValue(
    Math.max(1 / MAX_WIDTH, Math.min(activeWidth / MAX_WIDTH, 1)),
  );
  const context = useSharedValue(0);

  const lastReportedWidth = useSharedValue(activeWidth);

  useEffect(() => {
    const currentSliderWidth = Math.round(progress.value * MAX_WIDTH);

    if (currentSliderWidth !== activeWidth) {
      progress.value = Math.max(
        1 / MAX_WIDTH,
        Math.min(activeWidth / MAX_WIDTH, 1),
      );
      lastReportedWidth.value = activeWidth;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MAX_WIDTH, activeWidth]);

  const updateParent = (newWidth: number) => {
    if (onWidthChange) {
      onWidthChange(type, newWidth);
    }
  };

  const handleProgressChange = (newProgress: number) => {
    'worklet';
    progress.value = newProgress;

    const newWidth = Math.round(newProgress * MAX_WIDTH);
    if (newWidth !== lastReportedWidth.value) {
      lastReportedWidth.value = newWidth;
      runOnJS(updateParent)(newWidth);
    }
  };

  const dragGesture = Gesture.Pan()
    .onBegin(e => {
      let tapProgress = isLandscape
        ? (TRACK_LENGTH - e.y) / TRACK_LENGTH
        : e.x / TRACK_LENGTH;

      tapProgress = Math.max(1 / MAX_WIDTH, Math.min(tapProgress, 1));

      context.value = tapProgress;
      handleProgressChange(tapProgress);
    })
    .onUpdate(e => {
      const delta = isLandscape ? -e.translationY : e.translationX;
      const deltaProgress = delta / TRACK_LENGTH;

      let newProgress = context.value + deltaProgress;
      newProgress = Math.max(1 / MAX_WIDTH, Math.min(newProgress, 1));

      handleProgressChange(newProgress);
    })
    .hitSlop({ top: 15, bottom: 15, left: 15, right: 15 });

  const thumbStyle = useAnimatedStyle(() => {
    const currentPixel = progress.value * TRACK_LENGTH;
    return {
      position: 'absolute',
      width: THUMB_SIZE,
      height: THUMB_SIZE,
      borderRadius: THUMB_SIZE / 2,
      backgroundColor: '#EFC130',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      transform: [
        {
          translateX: isLandscape
            ? -THUMB_SIZE / 4
            : currentPixel - THUMB_SIZE / 2,
        },
        {
          translateY: isLandscape
            ? TRACK_LENGTH - currentPixel - THUMB_SIZE / 2
            : -THUMB_SIZE / 4,
        },
      ],
    };
  });

  const fillStyle = useAnimatedStyle(() => {
    const fillLength = progress.value * TRACK_LENGTH;
    return {
      position: 'absolute',
      backgroundColor: '#EFC130',
      borderRadius: 999,
      width: isLandscape ? '100%' : fillLength,
      height: isLandscape ? fillLength : '100%',
      bottom: isLandscape ? 0 : undefined,
      left: 0,
    };
  });

  return (
    <View
      className={`${isLandscape ? 'flex-col' : 'flex-row'} items-center`}
      style={{ gap: rs(16) }}
    >
      <Text
        className="text-center"
        style={{ fontFamily: 'Nunito-Medium', fontSize: 12 }}
      >
        {type === 'draw' ? 'Brush\nWidth' : 'Eraser\nWidth'}
      </Text>
      <GestureDetector gesture={dragGesture}>
        <View
          className="bg-gray-300 rounded-full"
          style={{
            height: isLandscape ? TRACK_LENGTH : rs(10),
            width: isLandscape ? rs(10) : TRACK_LENGTH,
            position: 'relative',
          }}
        >
          <Animated.View style={fillStyle} />
          <Animated.View style={thumbStyle} />
        </View>
      </GestureDetector>
      <Text
        style={{
          width: rs(35),
          textAlign: 'center',
          fontFamily: 'Nunito-Medium',
          fontSize: 16,
        }}
      >
        {activeWidth}
      </Text>
    </View>
  );
}
