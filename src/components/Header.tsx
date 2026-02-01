/* eslint-disable react-native/no-inline-styles */
import { View, Text } from 'react-native';
import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { Storage } from '../utils/storage';
import Ionicons from '@react-native-vector-icons/ionicons';
import SearchBar from './SearchBar';

type Props = {
  searchText: string;
  setSearchText: (text: string) => void;
};

export default function Header({ searchText, setSearchText }: Props) {
  const { rs, iconSize } = useResponsive();
  const isGuest = Storage.isGuestUser();
  const user = Storage.getUser();

  return (
    <View
      className="bg-action"
      style={{
        height: rs(300),
        paddingTop: rs(50),
        paddingHorizontal: rs(30),
        gap: rs(36),
      }}
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
            <Ionicons name="menu-outline" size={iconSize} color="white" />
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
    </View>
  );
}
