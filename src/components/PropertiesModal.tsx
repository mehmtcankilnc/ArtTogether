/* eslint-disable react-native/no-inline-styles */
import { View, Pressable, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { GestureMode } from './Toolbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Orientation, { OrientationType } from 'react-native-orientation-locker';
import { useResponsive } from '../hooks/useResponsive';
import CustomSlider from './CustomSlider';

type Props = {
  activeMode: GestureMode;
  setPropertiesModalVisible: (value: boolean) => void;
  brushWidth: number;
  eraserWidth: number;
  onWidthChange: (type: GestureMode, width: number) => void;
};

export default function PropertiesModal({
  activeMode,
  setPropertiesModalVisible,
  brushWidth,
  eraserWidth,
  onWidthChange,
}: Props) {
  const { rs } = useResponsive();
  const [isLandscape, setIsLandscape] = useState<boolean>();
  useEffect(() => {
    const orientationChange = (orientation: OrientationType) => {
      if (
        orientation === OrientationType['LANDSCAPE-LEFT'] ||
        orientation === OrientationType['LANDSCAPE-RIGHT']
      ) {
        setIsLandscape(true);
      } else {
        setIsLandscape(false);
      }
    };

    Orientation.getOrientation(orientation => {
      orientationChange(orientation);
    });

    Orientation.addOrientationListener(orientationChange);

    return () => Orientation.removeOrientationListener(orientationChange);
  }, []);

  return (
    <View
      style={[StyleSheet.absoluteFill, { zIndex: 50 }]}
      pointerEvents="box-none"
    >
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => setPropertiesModalVisible(false)}
      />
      <SafeAreaView
        style={[
          { position: 'absolute' },
          isLandscape
            ? {
                right: rs(80),
                top: 0,
                bottom: 0,
                justifyContent: 'center',
              }
            : { bottom: rs(100), left: 0, right: 0, alignItems: 'center' },
        ]}
        pointerEvents="box-none"
      >
        <Pressable
          className="bg-pageBg"
          style={{
            borderRadius: 8,
            padding: rs(12),
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: isLandscape ? 'column' : 'row',
          }}
        >
          <CustomSlider
            type={activeMode}
            isLandscape={isLandscape}
            brushWidth={brushWidth}
            eraserWidth={eraserWidth}
            onWidthChange={onWidthChange}
          />
        </Pressable>
      </SafeAreaView>
    </View>
  );
}
