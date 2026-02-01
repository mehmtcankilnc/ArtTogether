/* eslint-disable react-native/no-inline-styles */
import { Text, Pressable } from 'react-native';
import React from 'react';
import { useResponsive } from '../hooks/useResponsive';

type Props = {
  handleSubmit: () => void;
  text: string;
};

export default function Button({ handleSubmit, text }: Props) {
  const { rs } = useResponsive();

  return (
    <Pressable
      onPress={handleSubmit}
      className="w-full bg-action rounded-md items-center"
      style={{ padding: rs(10) }}
    >
      <Text
        style={{
          fontFamily: 'Nunito-Medium',
          fontSize: rs(18),
          color: 'white',
        }}
      >
        {text}
      </Text>
    </Pressable>
  );
}
