import React, { ReactNode } from 'react';
import { useResponsive } from '../hooks/useResponsive';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  children: ReactNode;
  active: SharedValue<boolean>;
};

export default function Page({ children, active }: Props) {
  const { rs } = useResponsive();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderBottomRightRadius: active.value ? withTiming(20) : withTiming(0),
    };
  });

  return (
    <Animated.View
      className="flex-1 items-center bg-pageBg rounded-t-3xl"
      style={[
        {
          marginTop: -rs(24),
          padding: rs(30),
        },
        animatedStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
}
