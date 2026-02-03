/* eslint-disable react-native/no-inline-styles */
import { View, Text } from 'react-native';
import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { Storage } from '../utils/storage';
import Ionicons from '@react-native-vector-icons/ionicons';
import SearchBar from './SearchBar';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  searchText: string;
  setSearchText: (text: string) => void;
  active: SharedValue<boolean>;
};

export default function Header({ searchText, setSearchText, active }: Props) {
  const { rs, iconSize } = useResponsive();
  const insets = useSafeAreaInsets();
  const isGuest = Storage.isGuestUser();
  const user = Storage.getUser();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderTopRightRadius: active.value ? withTiming(20) : withTiming(0),
    };
  });

  return (
    <Animated.View
      className="bg-action"
      style={[
        {
          height: rs(300),
          paddingTop: insets.top,
          paddingHorizontal: rs(30),
          gap: rs(36),
        },
        animatedStyle,
      ]}
    >
      <View>
        <View className="flex-row justify-between items-center">
          <Text
            style={{
              fontFamily: 'Nunito-Medium',
              fontSize: 16,
              color: '#FDFDFD',
            }}
          >
            Welcome, {isGuest ? 'Guest User' : user?.name}
          </Text>
          <View className="flex-row items-center" style={{ gap: rs(12) }}>
            <Ionicons
              name="notifications-outline"
              size={rs(28)}
              color="white"
            />
            <Ionicons
              onPress={() => {
                active.value = true;
              }}
              name="menu-outline"
              size={iconSize}
              color="white"
            />
          </View>
        </View>
        <Text
          style={{
            fontFamily: 'Nunito-ExtraBold',
            fontSize: 24,
            color: '#FDFDFD',
          }}
        >
          Ready to paint with{'\n'}your friends?
        </Text>
      </View>
      <SearchBar
        placeholder="Search projects"
        value={searchText}
        handleTextChange={setSearchText}
        rightIcon={<Ionicons name="search-outline" size={24} color="#1F1F1F" />}
      />
    </Animated.View>
  );
}
