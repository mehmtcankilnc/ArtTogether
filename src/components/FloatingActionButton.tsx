/* eslint-disable react-native/no-inline-styles */
import { View, Pressable, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  withDelay,
  interpolate,
  Extrapolation,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  createNewWhiteBoard: () => void;
  createNewPixelBoard: () => void;
};

export default function FloatingActionButton({
  createNewWhiteBoard,
  createNewPixelBoard,
}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const ICON_SIZE = 64;

  // const firstValue = useSharedValue(32);
  const secondValue = useSharedValue(32);
  const thirdValue = useSharedValue(32);

  // const firstWidth = useSharedValue(ICON_SIZE);
  const secondWidth = useSharedValue(ICON_SIZE);
  const thirdWidth = useSharedValue(ICON_SIZE);

  const isOpen = useSharedValue(false);
  const opacity = useSharedValue(0);

  const progress = useDerivedValue(() =>
    isOpen.value ? withTiming(1) : withTiming(0),
  );

  const handlePress = () => {
    const config = {
      easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
      duration: 500,
    };

    setIsMenuOpen(!isOpen.value);

    if (isOpen.value) {
      // firstWidth.value = withTiming(ICON_SIZE, { duration: 100 }, finish => {
      //   if (finish) firstValue.value = withTiming(32, config);
      // });
      secondWidth.value = withTiming(ICON_SIZE, { duration: 100 }, finish => {
        if (finish) secondValue.value = withDelay(50, withTiming(32, config));
      });
      thirdWidth.value = withTiming(ICON_SIZE, { duration: 100 }, finish => {
        if (finish) thirdValue.value = withDelay(100, withTiming(32, config));
      });
      opacity.value = withTiming(0, { duration: 100 });
    } else {
      // firstValue.value = withDelay(200, withSpring(130));
      secondValue.value = withDelay(100, withSpring(130)); // 210
      thirdValue.value = withSpring(210); // 290

      // firstWidth.value = withDelay(600, withSpring(200));
      secondWidth.value = withDelay(550, withSpring(200));
      thirdWidth.value = withDelay(500, withSpring(200));

      opacity.value = withDelay(600, withSpring(1));
    }

    isOpen.value = !isOpen.value;
  };

  const handleBackdropPress = () => {
    if (isMenuOpen) {
      handlePress();
    }
  };

  const onMenuItemPress = (action?: () => void) => {
    handlePress();
    if (action) {
      setTimeout(() => action(), 100);
    }
  };

  const opacityText = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  // const firstWidthStyle = useAnimatedStyle(() => {
  //   return { width: firstWidth.value };
  // });

  const secondWidthStyle = useAnimatedStyle(() => {
    return { width: secondWidth.value };
  });

  const thirdWidthStyle = useAnimatedStyle(() => {
    return { width: thirdWidth.value };
  });

  // const firstIcon = useAnimatedStyle(() => {
  //   const scale = interpolate(
  //     firstValue.value,
  //     [32, 130],
  //     [0, 1],
  //     Extrapolation.CLAMP,
  //   );
  //   return { bottom: firstValue.value, transform: [{ scale: scale }] };
  // });

  const secondIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      secondValue.value,
      [32, 130], //210
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { bottom: secondValue.value, transform: [{ scale: scale }] };
  });

  const thirdIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      thirdValue.value,
      [32, 210], //290
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { bottom: thirdValue.value, transform: [{ scale: scale }] };
  });

  const plusIcon = useAnimatedStyle(() => {
    return { transform: [{ rotate: `${progress.value * 45}deg` }] };
  });

  const itemClassName =
    'bg-action absolute bottom-8 right-8 rounded-2xl flex-row items-center overflow-hidden h-16 items-center';

  return (
    <>
      {isMenuOpen && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(0,0,0,0.2)', zIndex: 1 },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleBackdropPress}
          />
        </Animated.View>
      )}
      <AnimatedPressable
        onPress={() => onMenuItemPress(createNewWhiteBoard)}
        className={itemClassName}
        style={[thirdIcon, thirdWidthStyle, { zIndex: 2 }]}
      >
        <View className="w-16 h-16 justify-center items-center">
          <Ionicons name="easel-outline" size={30} color="#1F1F1F" />
        </View>
        <Animated.Text
          style={[
            { fontFamily: 'Nunito-Medium', fontSize: 16, color: '#1F1F1F' },
            opacityText,
          ]}
          numberOfLines={1}
        >
          New White Board
        </Animated.Text>
      </AnimatedPressable>
      <AnimatedPressable
        onPress={() => onMenuItemPress(createNewPixelBoard)}
        className={itemClassName}
        style={[secondIcon, secondWidthStyle, { zIndex: 2 }]}
      >
        <View className="w-16 h-16 justify-center items-center">
          <Ionicons name="grid-outline" size={30} color="#1F1F1F" />
        </View>
        <Animated.Text
          style={[
            { fontFamily: 'Nunito-Medium', fontSize: 16, color: '#1F1F1F' },
            opacityText,
          ]}
          numberOfLines={1}
        >
          New Pixel Board
        </Animated.Text>
      </AnimatedPressable>
      {/* <Animated.View
        className={itemClassName}
        style={[firstIcon, firstWidthStyle, { zIndex: 2 }]}
      >
        <View className="w-16 h-16 justify-center items-center">
          <Ionicons name="folder-open-outline" size={30} color="white" />
        </View>
        <Animated.Text
          className="text-white text-lg"
          style={opacityText}
          numberOfLines={1}
        >
          New Project
        </Animated.Text>
      </Animated.View> */}
      <AnimatedPressable
        onPress={handlePress}
        className="bg-action absolute bottom-8 right-8 rounded-2xl h-16 w-16 justify-center items-center"
        style={[{ zIndex: 2 }, plusIcon]}
      >
        <Ionicons name="add-outline" size={30} color="#1F1F1F" />
      </AnimatedPressable>
    </>
  );
}
