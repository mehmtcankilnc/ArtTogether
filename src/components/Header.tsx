/* eslint-disable react-native/no-inline-styles */
import { View, Text } from 'react-native';
import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

export default function Header() {
  const { rs, iconSize } = useResponsive();

  return (
    <View className="flex-row items-center justify-between">
      <View style={{ gap: rs(4) }}>
        <Text style={{ fontFamily: 'Nunito-Medium', fontSize: rs(26) }}>
          Hello, Mehmetcan
        </Text>
      </View>
      <MaterialDesignIcons name="cog-outline" size={iconSize} color="#666" />
    </View>
  );
}
