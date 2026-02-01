/* eslint-disable react-native/no-inline-styles */
import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';
import { useResponsive } from '../hooks/useResponsive';

export default function UpperTabs() {
  const { rs } = useResponsive();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <View className="w-full" style={{ gap: rs(12) }}>
      <View className="w-full flex-row justify-between">
        <Pressable
          onPress={() => setActiveTabIndex(0)}
          className="flex-1"
          style={{ gap: rs(12) }}
        >
          <Text
            className="text-center"
            style={{
              fontFamily: 'Nunito-Regular',
              fontSize: 14,
              color: '#1F1F1F',
              opacity: activeTabIndex === 0 ? 1 : 0.6,
            }}
          >
            All Projects
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTabIndex(1)}
          className="flex-1"
          style={{ gap: rs(12) }}
        >
          <Text
            className="text-center"
            style={{
              fontFamily: 'Nunito-Regular',
              fontSize: 14,
              color: '#1F1F1F',
              opacity: activeTabIndex === 1 ? 1 : 0.6,
            }}
          >
            Invite Friends
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTabIndex(2)}
          className="flex-1"
          style={{ gap: rs(12) }}
        >
          <Text
            className="text-center"
            style={{
              fontFamily: 'Nunito-Regular',
              fontSize: 14,
              color: '#1F1F1F',
              opacity: activeTabIndex === 2 ? 1 : 0.6,
            }}
          >
            Templates
          </Text>
        </Pressable>
      </View>
      <View className="w-full flex-row">
        <View
          className={`flex-1 border-2 rounded-l-full ${
            activeTabIndex === 0 ? 'border-action' : 'border-[#EBEBEB]'
          }`}
        />
        <View
          className={`flex-1 border-2 ${
            activeTabIndex === 1 ? 'border-action' : 'border-[#EBEBEB]'
          } `}
        />
        <View
          className={`flex-1 border-2 rounded-r-full ${
            activeTabIndex === 2 ? 'border-action' : 'border-[#EBEBEB]'
          }`}
        />
      </View>
    </View>
  );
}
