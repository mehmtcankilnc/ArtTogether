/* eslint-disable react-native/no-inline-styles */
import { Pressable, Text, View } from 'react-native';
import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import LinearGradient from 'react-native-linear-gradient';
import Button from './Button';

type Props = {
  title: string;
  text: string;
  onCancel: () => void;
  onSubmit: () => void;
  submitBtnText: string;
};

export default function ConfirmationModal({
  title,
  text,
  onCancel,
  onSubmit,
  submitBtnText,
}: Props) {
  const { rs } = useResponsive();

  return (
    <Pressable
      onPress={onCancel}
      className="absolute top-0 bottom-0 right-0 left-0 flex-1 bg-black/30 items-center justify-center"
      style={{ zIndex: 75 }}
    >
      <Pressable
        className="bg-pageBg"
        style={{ width: rs(250), borderRadius: 16 }}
      >
        <LinearGradient
          colors={['#AFB8CB', '#EFC130', '#AFB8CB']}
          start={{ x: 0, y: 0.5 }}
          locations={[0, 0.5, 1]}
          end={{ x: 1, y: 0.5 }}
          style={{
            width: rs(250),
            height: rs(40),
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
            backgroundColor: '#efc130',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Text
            style={{
              fontFamily: 'Nunito-SemiBold',
              fontSize: 16,
              color: '#FDFDFD',
            }}
          >
            {title}
          </Text>
        </LinearGradient>
        <View style={{ padding: rs(12), gap: rs(12) }}>
          <Text
            style={{
              fontFamily: 'Nunito-Regular',
              fontSize: 12,
              color: '#1F1F1F',
              textAlign: 'center',
            }}
          >
            {text}
          </Text>
          <View className="flex-row justify-center" style={{ gap: rs(12) }}>
            <Button type="cancel" handleSubmit={onCancel} text="Cancel" />
            <Button
              type="submit"
              handleSubmit={() => {
                onSubmit();
                onCancel();
              }}
              text={submitBtnText}
            />
          </View>
        </View>
      </Pressable>
    </Pressable>
  );
}
