import { View } from 'react-native';
import React, { ReactNode } from 'react';
import { useResponsive } from '../hooks/useResponsive';

type Props = {
  children: ReactNode;
};

export default function Page({ children }: Props) {
  const { rs } = useResponsive();

  return (
    <View
      className="flex-1 items-center bg-pageBg rounded-t-3xl"
      style={{
        marginTop: -rs(24),
        padding: rs(30),
      }}
    >
      {children}
    </View>
  );
}
