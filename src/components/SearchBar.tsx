/* eslint-disable react-native/no-inline-styles */
import { TextInput, View, TouchableOpacity } from 'react-native';
import React, { ReactNode } from 'react';
import { useResponsive } from '../hooks/useResponsive';

type Props = {
  placeholder: string;
  value: string;
  handleTextChange: (input: string) => void;
  rightIcon?: ReactNode;
  onRightIconPress?: () => void;
};

export default function SearchBar({
  placeholder,
  value,
  handleTextChange,
  rightIcon,
  onRightIconPress,
}: Props) {
  const { rs } = useResponsive();

  return (
    <View
      style={{
        width: '100%',
        height: rs(50),
        backgroundColor: '#fcefe6',
        borderRadius: rs(24),
        elevation: 4,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: rs(12),
      }}
    >
      <TextInput
        style={{
          flex: 1,
          height: '100%',
          color: '#ec6426',
          fontFamily: 'Nunito-Medium',
        }}
        placeholder={placeholder}
        placeholderTextColor={'#ec6426'}
        value={value}
        onChangeText={handleTextChange}
        cursorColor={'#ec6426'}
      />

      {rightIcon && (
        <TouchableOpacity
          onPress={onRightIconPress}
          activeOpacity={0.7}
          style={{ marginLeft: rs(8) }}
        >
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  );
}
