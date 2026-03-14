/* eslint-disable react-native/no-inline-styles */
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsive } from '../hooks/useResponsive';
import {
  Brush,
  Clear,
  ColorPalette,
  Eraser,
  Move,
  Redo,
  Undo,
} from 'smooth-icon';
import { useEffect, useState } from 'react';
import Orientation, { OrientationType } from 'react-native-orientation-locker';
import MovableColorPicker from './MovableColorPicker';
import PropertiesModal from './PropertiesModal';
import ConfirmationModal from './ConfirmationModal';

export type GestureMode = 'draw' | 'view' | 'erase';

interface ToolbarProps {
  activeMode: GestureMode;
  onModeChange: (mode: GestureMode) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  brushWidth: number;
  eraserWidth: number;
  onWidthChange: (type: GestureMode, width: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClearCanvas: () => void;
}

export default function Toolbar({
  activeMode,
  onModeChange,
  selectedColor,
  onColorChange,
  brushWidth,
  eraserWidth,
  onWidthChange,
  onUndo,
  onRedo,
  onClearCanvas,
}: ToolbarProps) {
  const { rs } = useResponsive();
  const [isLandscape, setIsLandscape] = useState<boolean>();
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [propertiesModalVisible, setPropertiesModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);

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

  const positionClass = isLandscape
    ? 'top-0 bottom-0 right-0 h-full'
    : 'bottom-0 right-0 left-0';

  const directionClass = isLandscape
    ? 'flex-col h-full rounded-l-2xl'
    : 'flex-row w-full rounded-t-2xl';

  return (
    <>
      <SafeAreaView className={`absolute ${positionClass} z-40`}>
        <View
          className={`${directionClass} flex-1 justify-center items-center`}
        >
          <ScrollView
            horizontal={!isLandscape}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              justifyContent: 'space-between',
              paddingHorizontal: 12,
              paddingVertical: 16,
            }}
            className={`${directionClass} bg-pageBg`}
          >
            <Pressable
              className={`items-center justify-center`}
              style={{ width: rs(50), height: rs(50) }}
              onPress={() => onModeChange('view')}
            >
              <Move
                size={32}
                color={activeMode === 'view' ? '#EFC130' : '#1F1F1F'}
              />
            </Pressable>
            <Pressable
              className={`items-center justify-center`}
              style={{ width: rs(50), height: rs(50) }}
              onPress={() => {
                onModeChange('draw');
                setPropertiesModalVisible(true);
              }}
            >
              <Brush
                size={32}
                color={activeMode === 'draw' ? '#EFC130' : '#1F1F1F'}
              />
            </Pressable>
            <Pressable
              className={`items-center justify-center`}
              style={{ width: rs(50), height: rs(50) }}
              onPress={() => {
                onModeChange('erase');
                setPropertiesModalVisible(true);
              }}
            >
              <Eraser
                size={32}
                color={activeMode === 'erase' ? '#EFC130' : '#1F1F1F'}
              />
            </Pressable>
            <Pressable
              className={`items-center justify-center`}
              style={{ width: rs(50), height: rs(50) }}
              onPress={() => setColorPickerVisible(prev => !prev)}
            >
              <ColorPalette
                size={32}
                color={colorPickerVisible ? '#EFC130' : '#1F1F1F'}
              />
            </Pressable>
            <Pressable
              className={`items-center justify-center`}
              style={{ width: rs(50), height: rs(50) }}
              onPress={onUndo}
            >
              <Undo size={32} color={'#1F1F1F'} />
            </Pressable>
            <Pressable
              className={`items-center justify-center`}
              style={{ width: rs(50), height: rs(50) }}
              onPress={onRedo}
            >
              <Redo size={32} color={'#1F1F1F'} />
            </Pressable>
            <Pressable
              className={`items-center justify-center`}
              style={{ width: rs(50), height: rs(50) }}
              onPress={() => setConfirmationModalVisible(true)}
            >
              <Clear size={32} color={'#1F1F1F'} />
            </Pressable>
          </ScrollView>
        </View>
      </SafeAreaView>
      {colorPickerVisible && (
        <MovableColorPicker
          selectedColor={selectedColor}
          handleColorChange={onColorChange}
        />
      )}
      {propertiesModalVisible && (
        <PropertiesModal
          activeMode={activeMode}
          setPropertiesModalVisible={setPropertiesModalVisible}
          brushWidth={brushWidth}
          eraserWidth={eraserWidth}
          onWidthChange={onWidthChange}
        />
      )}
      {confirmationModalVisible && (
        <ConfirmationModal
          title="Clear the Canvas"
          text="Are you sure you want to clear the whole canvas?"
          onCancel={() => setConfirmationModalVisible(false)}
          onSubmit={onClearCanvas}
          submitBtnText="Clear"
        />
      )}
    </>
  );
}
