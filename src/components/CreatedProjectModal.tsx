/* eslint-disable react-native/no-inline-styles */
import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';
import { useResponsive } from '../hooks/useResponsive';
import Button from './Button';
import Clipboard from '@react-native-clipboard/clipboard';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  handleDismiss: () => void;
  projectName: string;
  invitationLink: string;
};

export default function CreatedProjectModal({
  handleDismiss,
  projectName,
  invitationLink,
}: Props) {
  const { rs } = useResponsive();

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    Clipboard.setString(invitationLink);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Pressable
      onPress={() => {
        setIsCopied(false);
        handleDismiss();
      }}
      className="absolute top-0 bottom-0 right-0 left-0 flex-1 bg-black/30 items-center justify-center"
    >
      <Pressable
        className="bg-pageBg"
        style={{ width: rs(350), borderRadius: 16 }}
      >
        <LinearGradient
          colors={['#AFB8CB', '#EFC130', '#AFB8CB']}
          start={{ x: 0, y: 0.5 }}
          locations={[0, 0.5, 1]}
          end={{ x: 1, y: 0.5 }}
          className="w-full items-center justify-center"
          style={{
            paddingVertical: rs(20),
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        >
          <Text
            style={{
              fontFamily: 'Nunito-SemiBold',
              fontSize: 18,
              color: '#FDFDFD',
            }}
          >
            Project Created!
          </Text>
        </LinearGradient>
        <View style={{ padding: rs(12), gap: rs(30) }}>
          <View style={{ gap: rs(30) }}>
            <Text
              style={{
                fontFamily: 'Nunito-Regular',
                fontSize: rs(16),
                textAlign: 'center',
              }}
            >
              Your project{' '}
              <Text
                style={{
                  fontFamily: 'Nunito-ExtraBold',
                  textDecorationLine: 'underline',
                }}
              >
                "{projectName}"
              </Text>{' '}
              created successfully! You can share the invitation link below with
              your friends to collaborate.
            </Text>
            <View
              className="flex-row justify-between bg-white elevation-md rounded-md items-center"
              style={{
                width: rs(320),
                alignSelf: 'center',
                overflow: 'hidden',
              }}
            >
              <Text
                style={{
                  margin: rs(12),
                  fontFamily: 'Nunito-Medium',
                  fontSize: rs(14),
                  color: 'gray',
                  flex: 1,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {invitationLink}
              </Text>
              <Pressable
                onPress={handleCopy}
                className="bg-action"
                style={{
                  padding: rs(12),
                  width: rs(100),
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Nunito-SemiBold',
                    fontSize: 14,
                    color: '#FDFDFD',
                  }}
                >
                  {isCopied ? 'Copied' : 'Copy'}
                </Text>
              </Pressable>
            </View>
          </View>
          <View className="items-center">
            <Button handleSubmit={handleDismiss} text="Done" type="submit" />
          </View>
        </View>
      </Pressable>
    </Pressable>
  );
}
