/* eslint-disable react-native/no-inline-styles */
import { View, Text, StyleSheet, Pressable, BackHandler } from 'react-native';
import React, { useEffect } from 'react';
import { useResponsive } from '../hooks/useResponsive';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SharedValue } from 'react-native-reanimated';

type Props = {
  active: SharedValue<boolean>;
};

export default function Drawer({ active }: Props) {
  const { rs } = useResponsive();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const backAction = () => {
      if (active.value) {
        active.value = false;
        return true;
      } else {
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [active, active.value]);

  return (
    <View
      style={StyleSheet.absoluteFill}
      className="flex-row bg-secondaryBg -z-50"
    >
      <View className="flex-1" />
      <View
        className="flex-1 justify-center"
        style={{ paddingHorizontal: rs(12), gap: rs(8) }}
      >
        <View className="flex-row items-center" style={{ gap: rs(8) }}>
          <View style={{ gap: rs(4) }}>
            <Text
              style={{
                fontFamily: 'Nunito-Medium',
                fontSize: 14,
                color: '#1F1F1F',
              }}
            >
              Username
            </Text>
            <Text
              style={{
                fontFamily: 'Nunito-Medium',
                fontSize: 14,
                color: '#1F1F1F',
              }}
            >
              User ID: 5646
            </Text>
          </View>
          <Ionicons name="person-circle-outline" size={64} color="#1F1F1F" />
        </View>
        <View className="w-full border-2 rounded-full border-action" />
        {/** Account Area */}
        <View style={{ gap: rs(12) }}>
          <Text
            style={{
              fontFamily: 'Nunito-SemiBold',
              fontSize: 16,
              color: '#EFC130',
            }}
          >
            Account
          </Text>
          <View style={{ gap: rs(4), paddingLeft: rs(8) }}>
            <View className="flex-row items-center" style={{ gap: rs(12) }}>
              <Ionicons name="create-outline" size={24} color="#1F1F1F" />
              <Text
                style={{
                  fontFamily: 'Nunito-Regular',
                  fontSize: 12,
                  color: '#1F1F1F',
                }}
              >
                Edit Profile
              </Text>
            </View>
            <View className="flex-row items-center" style={{ gap: rs(12) }}>
              <Ionicons name="settings-outline" size={24} color="#1F1F1F" />
              <Text
                style={{
                  fontFamily: 'Nunito-Regular',
                  fontSize: 12,
                  color: '#1F1F1F',
                }}
              >
                Settings
              </Text>
            </View>
            <Pressable
              onPress={() => {
                active.value = false;
                navigation.navigate('Notifications');
              }}
              className="flex-row items-center"
              style={{ gap: rs(12) }}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#1F1F1F"
              />
              <Text
                style={{
                  fontFamily: 'Nunito-Regular',
                  fontSize: 12,
                  color: '#1F1F1F',
                }}
              >
                Notifications
              </Text>
            </Pressable>
          </View>
        </View>
        {/** Support & About Area*/}
        <View style={{ gap: rs(12) }}>
          <Text
            style={{
              fontFamily: 'Nunito-SemiBold',
              fontSize: 16,
              color: '#EFC130',
            }}
          >
            Support & About
          </Text>
          <View style={{ gap: rs(4), paddingLeft: rs(8) }}>
            <View className="flex-row items-center" style={{ gap: rs(12) }}>
              <Ionicons name="help-circle-outline" size={24} color="#1F1F1F" />
              <Text
                style={{
                  fontFamily: 'Nunito-Regular',
                  fontSize: 12,
                  color: '#1F1F1F',
                }}
              >
                Help & Support
              </Text>
            </View>
            <View className="flex-row items-center" style={{ gap: rs(12) }}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="#1F1F1F"
              />
              <Text
                style={{
                  fontFamily: 'Nunito-Regular',
                  fontSize: 12,
                  color: '#1F1F1F',
                }}
              >
                Terms & Conditions
              </Text>
            </View>
          </View>
        </View>
        {/** Actions Area */}
        <View style={{ gap: rs(12) }}>
          <Text
            style={{
              fontFamily: 'Nunito-SemiBold',
              fontSize: 16,
              color: '#EFC130',
            }}
          >
            Actions
          </Text>
          <View style={{ gap: rs(4), paddingLeft: rs(8) }}>
            <View className="flex-row items-center" style={{ gap: rs(12) }}>
              <Ionicons name="share-social-outline" size={24} color="#1F1F1F" />
              <Text
                style={{
                  fontFamily: 'Nunito-Regular',
                  fontSize: 12,
                  color: '#1F1F1F',
                }}
              >
                Share with Friends
              </Text>
            </View>
            <View className="flex-row items-center" style={{ gap: rs(12) }}>
              <Ionicons name="flag-outline" size={24} color="#1F1F1F" />
              <Text
                style={{
                  fontFamily: 'Nunito-Regular',
                  fontSize: 12,
                  color: '#1F1F1F',
                }}
              >
                Report a Problem
              </Text>
            </View>
            <View className="flex-row items-center" style={{ gap: rs(12) }}>
              <Ionicons name="mail-outline" size={24} color="#1F1F1F" />
              <Text
                style={{
                  fontFamily: 'Nunito-Regular',
                  fontSize: 12,
                  color: '#1F1F1F',
                }}
              >
                Feature Request
              </Text>
            </View>
            <View className="flex-row items-center" style={{ gap: rs(12) }}>
              <Ionicons name="power-outline" size={24} color="#1F1F1F" />
              <Text
                style={{
                  fontFamily: 'Nunito-Regular',
                  fontSize: 12,
                  color: '#1F1F1F',
                }}
              >
                Logout
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
