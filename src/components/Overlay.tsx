import { StyleSheet, Pressable } from 'react-native';
import React from 'react';
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

type Props = {
  active: SharedValue<boolean>;
};

export default function Overlay({ active }: Props) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      display: active.value ? 'flex' : 'none',
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable
        onPress={() => {
          active.value = false;
        }}
        style={styles.container}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 3,
  },
});
