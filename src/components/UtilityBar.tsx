/* eslint-disable react-native/no-inline-styles */
import { View, Pressable, useWindowDimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  DocumentDownload,
  Home,
  LeftCircleArrow,
  RightCircleArrow,
  Share,
  ThreeDot,
} from 'smooth-icon';
import { useResponsive } from '../hooks/useResponsive';
import Animated, {
  createAnimatedComponent,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import Orientation, { OrientationType } from 'react-native-orientation-locker';
import { useCanvas } from '../context/CanvasContext';

type Props = {
  onBack: () => void;
};

const AnimatedPressable = createAnimatedComponent(Pressable);

export default function UtilityBar({ onBack }: Props) {
  const { rs } = useResponsive();
  const { activeProject } = useCanvas();
  const { width: screenWidth } = useWindowDimensions();
  const [isLandscape, setIsLandscape] = useState<boolean>();
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const projectName = activeProject?.projectName ?? '';
  const OPEN_WIDTH = isLandscape ? rs(400) : screenWidth * 0.9;
  const CLOSED_WIDTH = rs(55);

  const width = useSharedValue(OPEN_WIDTH);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const orientationChange = (orientation: OrientationType) => {
      if (
        orientation === OrientationType['LANDSCAPE-LEFT'] ||
        orientation === OrientationType['LANDSCAPE-RIGHT']
      ) {
        setIsLandscape(true);
      } else {
        setIsLandscape(false);
      }
    };

    Orientation.getOrientation(orientation => {
      orientationChange(orientation);
    });

    Orientation.addOrientationListener(orientationChange);

    return () => Orientation.removeOrientationListener(orientationChange);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      width.value = withSpring(OPEN_WIDTH, { damping: 50 });
    } else {
      width.value = withTiming(CLOSED_WIDTH);
    }
  }, [isLandscape, isMenuOpen, OPEN_WIDTH, width, CLOSED_WIDTH]);

  const handlePress = () => {
    if (isMenuOpen) {
      width.value = withTiming(CLOSED_WIDTH, { duration: 300 });
      opacity.value = withTiming(0, { duration: 200 });
    } else {
      width.value = withSpring(OPEN_WIDTH, { damping: 50 });
      opacity.value = withDelay(100, withTiming(1, { duration: 300 }));
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
    };
  });

  const opacityStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const positionClass = isLandscape ? 'top-0 left-0' : 'top-0 right-0 left-0';

  return (
    <SafeAreaView
      className={`absolute ${positionClass} z-50 pointer-events-box-none`}
    >
      <View className={`flex-row flex-1 justify-start items-center`}>
        <Animated.View
          className={`flex-row bg-pageBg rounded-full py-1 px-2 m-4 items-center overflow-hidden`}
          style={[animatedStyle, { justifyContent: 'space-between' }]}
        >
          <Animated.View
            className="flex-row items-center flex-1 justify-between"
            style={opacityStyle}
          >
            <AnimatedPressable
              onPress={onBack}
              style={{ height: rs(50), width: rs(40) }}
              className="justify-center items-center"
            >
              <Home color={'#1F1F1F'} />
            </AnimatedPressable>
            <Animated.Text
              numberOfLines={1}
              style={{
                fontFamily: 'Nunito-Medium',
                fontSize: 14,
                flex: 1,
                marginLeft: 8,
                marginRight: 8,
              }}
            >
              {projectName}
            </Animated.Text>
            <View className="flex-row">
              <AnimatedPressable
                className={`items-center justify-center w-10`}
                style={{ height: rs(50) }}
              >
                <DocumentDownload color={'#1F1F1F'} />
              </AnimatedPressable>
              <AnimatedPressable
                className={`items-center justify-center w-10`}
                style={{ height: rs(50) }}
              >
                <Share color={'#1F1F1F'} />
              </AnimatedPressable>
              <AnimatedPressable
                className={`items-center justify-center w-10`}
                style={{ height: rs(50) }}
              >
                <ThreeDot color={'#1F1F1F'} />
              </AnimatedPressable>
            </View>
          </Animated.View>
          <Pressable
            className={`items-center justify-center`}
            style={{ height: rs(50), width: rs(40) }}
            onPress={handlePress}
          >
            {isMenuOpen ? (
              <LeftCircleArrow color={'#1F1F1F'} />
            ) : (
              <RightCircleArrow color={'#1F1F1F'} />
            )}
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
