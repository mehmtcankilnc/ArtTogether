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
        backgroundColor: '#FDFDFD',
        borderRadius: rs(12),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: rs(12),
      }}
    >
      {rightIcon && (
        <TouchableOpacity
          onPress={onRightIconPress}
          activeOpacity={0.7}
          style={{ marginLeft: rs(8) }}
        >
          {rightIcon}
        </TouchableOpacity>
      )}
      <TextInput
        style={{
          flex: 1,
          height: '100%',
          color: '#1F1F1F',
          fontFamily: 'Nunito-Regular',
        }}
        placeholder={placeholder}
        placeholderTextColor={'#1F1F1F'}
        value={value}
        onChangeText={handleTextChange}
        cursorColor={'#1F1F1F'}
      />
    </View>
  );
}
