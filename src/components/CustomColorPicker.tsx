/* eslint-disable react-native/no-inline-styles */
import { Pressable, Text, View } from 'react-native';
import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import ColorPicker, {
  HueSlider,
  Panel1,
  Preview,
} from 'reanimated-color-picker';
import { runOnJS } from 'react-native-worklets';
import LinearGradient from 'react-native-linear-gradient';
import Button from './Button';

type Props = {
  handleDismiss: () => void;
  selectedColor: string;
  handleColorChange: (color: string) => void;
};

export default function CustomColorPicker({
  handleDismiss,
  selectedColor,
  handleColorChange,
}: Props) {
  const { rs } = useResponsive();

  return (
    <Pressable
      onPress={handleDismiss}
      className="absolute top-0 bottom-0 right-0 left-0 flex-1 bg-black/40 items-center justify-center"
    >
      <Pressable
        onPress={e => e.stopPropagation()}
        className="bg-pageBg"
        style={{ width: rs(320), borderRadius: 16, overflow: 'hidden' }}
      >
        <LinearGradient
          colors={['#AFB8CB', '#EFC130', '#AFB8CB']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ paddingVertical: rs(15), alignItems: 'center' }}
        >
          <Text
            style={{
              fontFamily: 'Nunito-SemiBold',
              fontSize: 18,
              color: '#FDFDFD',
            }}
          >
            Pick Custom Color
          </Text>
        </LinearGradient>
        <View style={{ padding: rs(20), gap: rs(15) }}>
          <ColorPicker
            value={selectedColor}
            onComplete={color => {
              'worklet';
              runOnJS(handleColorChange)(color.hex);
            }}
            thumbStyle={{ borderWidth: 0 }}
          >
            <Preview
              style={{
                height: rs(40),
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                borderWidth: 1,
                borderColor: '#2D5A7B',
              }}
              textStyle={{ color: '#2D5A7B', fontFamily: 'Nunito-SemiBold' }}
            />
            <Panel1
              style={{
                height: rs(180),
                borderRadius: 8,
                marginVertical: rs(8),
              }}
              thumbShape="circle"
            />
            <HueSlider
              style={{ height: rs(20), borderRadius: 8 }}
              thumbShape="pill"
            />
          </ColorPicker>
          <View className="items-center">
            <Button handleSubmit={handleDismiss} text="Done" type="submit" />
          </View>
        </View>
      </Pressable>
    </Pressable>
  );
}
