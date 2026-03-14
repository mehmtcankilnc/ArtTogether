import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useResponsive } from '../hooks/useResponsive';
import { runOnJS } from 'react-native-worklets';

type Props = {
  onSelectColor: (color: string) => void;
  onClose: () => void;
  getColorAtPosition: (x: number, y: number) => string;
  onGestureStart?: () => void; // Skia Canvas snapshot'ı almak için
  onGestureEnd?: () => void; // Snapshot'ı temizlemek için
};

export default function ColorPickerOverlay({
  onSelectColor,
  onClose,
  getColorAtPosition,
  onGestureStart,
  onGestureEnd,
}: Props) {
  const { rs } = useResponsive();

  const LOUPE_SIZE = rs(60);
  const OFFSET = rs(40);

  const cursorX = useSharedValue(0);
  const cursorY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const previewColor = useSharedValue('#FFFFFF');

  const [currentColor, setCurrentColor] = useState('#FFFFFF');

  const handleGetColor = (x: number, y: number) => {
    try {
      const color = getColorAtPosition(x, y);
      if (color) {
        previewColor.value = color;
        setCurrentColor(color);
      }
    } catch (error) {
      console.log('Renk okunamadı', error);
    }
  };

  const handleFinalize = () => {
    onSelectColor(currentColor);
    if (onGestureEnd) onGestureEnd();
    onClose();
  };

  const panGesture = Gesture.Pan()
    .minDistance(0)
    .onBegin(e => {
      if (onGestureStart) runOnJS(onGestureStart)();

      cursorX.value = e.x;
      cursorY.value = e.y;
      opacity.value = withTiming(1, { duration: 150 });

      runOnJS(handleGetColor)(e.x, e.y);
    })
    .onUpdate(e => {
      cursorX.value = e.x;
      cursorY.value = e.y;
      runOnJS(handleGetColor)(e.x, e.y);
    })
    .onEnd(() => {
      opacity.value = withTiming(0, { duration: 150 });
      runOnJS(handleFinalize)();
    });

  const loupeStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      width: LOUPE_SIZE,
      height: LOUPE_SIZE,
      borderRadius: LOUPE_SIZE / 2,
      borderWidth: 18,
      borderColor: previewColor.value,
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: opacity.value,
      transform: [
        { translateX: cursorX.value - LOUPE_SIZE / 2 },
        { translateY: cursorY.value - LOUPE_SIZE / 2 - OFFSET },
      ],
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    };
  });

  const crosshairStyle = useAnimatedStyle(() => {
    return {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: previewColor.value,
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={StyleSheet.absoluteFill}>
        <Animated.View style={loupeStyle}>
          <Animated.View style={crosshairStyle} />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
