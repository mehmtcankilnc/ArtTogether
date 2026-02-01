/* eslint-disable react-native/no-inline-styles */
import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';
import { useResponsive } from '../hooks/useResponsive';
import Ionicons from '@react-native-vector-icons/ionicons';
import Button from './Button';
import Clipboard from '@react-native-clipboard/clipboard';

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
      className="absolute top-0 bottom-0 right-0 left-0 flex-1 bg-black/15 items-center justify-center"
    >
      <Pressable
        className="bg-main rounded-lg border border-[#2ECC71] items-center"
        style={{ width: rs(350), height: rs(400), padding: rs(20) }}
      >
        <View
          className="absolute bg-main border-2 border-[#2ECC71] rounded-full"
          style={{ padding: rs(8), top: -rs(38) }}
        >
          <Ionicons
            name="checkmark-done-outline"
            size={rs(60)}
            color="#2ECC71"
          />
        </View>
        <View style={{ marginTop: rs(38), gap: rs(30) }}>
          <Text
            style={{
              fontFamily: 'Nunito-SemiBold',
              fontSize: rs(26),
              textAlign: 'center',
            }}
          >
            Project Created!
          </Text>
          <View style={{ gap: rs(12) }}>
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
                  fontFamily: 'Nunito-SemiBold',
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
                    fontFamily: 'Nunito-Medium',
                    fontSize: rs(14),
                    color: 'white',
                  }}
                >
                  {isCopied ? 'Copied' : 'Copy'}
                </Text>
              </Pressable>
            </View>
          </View>
          <View className="flex-1 justify-end">
            <Button handleSubmit={handleDismiss} text="Done" />
          </View>
        </View>
      </Pressable>
    </Pressable>
  );
}
