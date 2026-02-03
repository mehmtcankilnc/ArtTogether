/* eslint-disable react-native/no-inline-styles */
import { Text, Pressable } from 'react-native';
import React from 'react';
import { useResponsive } from '../hooks/useResponsive';

type Props = {
  handleSubmit: () => void;
  text: string;
  type: 'submit' | 'cancel';
};

export default function Button({ handleSubmit, text, type }: Props) {
  const { rs } = useResponsive();

  return (
    <Pressable
      onPress={handleSubmit}
      className={`${
        type === 'submit'
          ? 'bg-buttonBg border-none'
          : 'bg-pageBg border border-[#D0D5DD]'
      } rounded-md items-center`}
      style={{ paddingVertical: rs(10), width: rs(100) }}
    >
      <Text
        style={{
          fontFamily: 'Nunito-Medium',
          fontSize: rs(18),
          color: type === 'submit' ? '#FDFDFD' : '#A3A3A3',
        }}
      >
        {text}
      </Text>
    </Pressable>
  );
}
