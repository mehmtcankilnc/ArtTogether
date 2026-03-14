/* eslint-disable react-native/no-inline-styles */
import { useWindowDimensions, View, StyleSheet, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import ColorPicker, {
  HueSlider,
  OpacitySlider,
  Panel1,
} from 'reanimated-color-picker';
import { runOnJS } from 'react-native-worklets';
import { useResponsive } from '../hooks/useResponsive';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Plus } from 'smooth-icon';
import { useCanvas } from '../context/CanvasContext';
import { UpdateProjectDto } from '../data/types';
import LinearGradient from 'react-native-linear-gradient';
import ConfirmationModal from './ConfirmationModal';

type Props = {
  selectedColor: string;
  handleColorChange: (color: string) => void;
};

export default function MovableColorPicker({
  selectedColor,
  handleColorChange,
}: Props) {
  const { rs } = useResponsive();
  const { activeProject, handleUpdateProject } = useCanvas();
  const { width, height } = useWindowDimensions();
  const isDragging = useSharedValue(0);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [deletedSwatchIndex, setDeletedSwatchIndex] = useState<number>();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacityThumbColor = useSharedValue(selectedColor);

  const swatches = activeProject?.swatches ?? [];

  useEffect(() => {
    opacityThumbColor.value = selectedColor;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor]);

  const context = useSharedValue({ x: 0, y: 0 });

  const pan = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = 1;
    })
    .onStart(() => {
      context.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate(e => {
      translateX.value = e.translationX + context.value.x;
      translateY.value = e.translationY + context.value.y;
    })
    .onFinalize(() => {
      isDragging.value = 0;
    });

  const animatedStyle = useAnimatedStyle(() => {
    const scale = withTiming(interpolate(isDragging.value, [0, 1], [1, 1.05]), {
      duration: 150,
    });

    const shadowOpacity = interpolate(isDragging.value, [0, 1], [0, 0.25]);

    const elevation = interpolate(isDragging.value, [0, 1], [0, 8]);

    return {
      transform: [
        { scale },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
      shadowColor: '#000',
      shadowOpacity,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation,
    };
  });

  const opacityThumbAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: opacityThumbColor.value,
  }));

  const handleSaveSwatches = (index: number) => {
    if (!activeProject) return;

    const updatedSwatches = [...(activeProject.swatches ?? [])];
    updatedSwatches[index] = selectedColor;

    const dto: UpdateProjectDto = {
      swatches: updatedSwatches,
    };

    handleUpdateProject(dto, activeProject.projectId);
  };

  const handleDeleteSwatch = () => {
    if (!activeProject || !deletedSwatchIndex) return;

    const updatedSwatches = [...(activeProject.swatches ?? [])];
    updatedSwatches[deletedSwatchIndex] = '';

    const dto: UpdateProjectDto = {
      swatches: updatedSwatches,
    };

    handleUpdateProject(dto, activeProject.projectId);
  };

  return (
    <>
      <Animated.View
        className="bg-pageBg items-center absolute"
        style={[
          styles.container,
          {
            top: (height - rs(300)) / 2,
            right: (width - rs(300)) / 2,
          },
          animatedStyle,
        ]}
      >
        <GestureDetector gesture={pan}>
          <Animated.View className="flex-row items-center justify-center">
            <LinearGradient
              colors={['#AFB8CB', '#EFC130', '#AFB8CB']}
              start={{ x: 0, y: 0.5 }}
              locations={[0, 0.5, 1]}
              end={{ x: 1, y: 0.5 }}
              style={{
                width: rs(50),
                height: rs(6),
                marginTop: rs(10),
                borderRadius: 9999,
                backgroundColor: '#efc130',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            />
          </Animated.View>
        </GestureDetector>
        <ColorPicker
          value={selectedColor}
          onChange={color => {
            'worklet';
            opacityThumbColor.value = color.rgba;
          }}
          onComplete={color => {
            'worklet';
            runOnJS(handleColorChange)(color.hex);
          }}
          style={{
            gap: rs(16),
            marginTop: rs(10),
            marginHorizontal: rs(5),
            width: rs(280),
            paddingHorizontal: rs(10),
            paddingBottom: rs(10),
          }}
          thumbShape="circle"
          thumbSize={20}
          thumbStyle={{
            borderWidth: 0,
            shadowColor: 'transparent',
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
          }}
          thumbInnerStyle={{
            borderWidth: 0,
            backgroundColor: 'transparent',
          }}
        >
          <Panel1 style={{ borderRadius: 12, height: rs(160) }} />
          <HueSlider sliderThickness={12} />
          <OpacitySlider
            sliderThickness={12}
            thumbStyle={[
              {
                borderWidth: 1,
                borderRadius: 999,
              },
              opacityThumbAnimatedStyle,
            ]}
            thumbInnerStyle={{ display: 'none' }}
          />
          <View className="flex-row justify-between">
            {swatches.map((color, index) =>
              color ? (
                <CustomSwatch
                  key={index}
                  color={color}
                  onSelect={() => handleColorChange(color)}
                  onDelete={() => {
                    setDeletedSwatchIndex(index);
                    setConfirmationModalVisible(true);
                  }}
                />
              ) : (
                <CustomSwatch
                  key={index}
                  onSave={() => handleSaveSwatches(index)}
                />
              ),
            )}
          </View>
          <View className="flex-1 border-b-2 border-[#D5D5D5] mx-2" />
          <Text
            style={{
              fontFamily: 'Nunito-SemiBold',
              fontSize: 14,
              color: '#1F1F1F',
              textTransform: 'uppercase',
              alignSelf: 'center',
            }}
          >
            {selectedColor}
          </Text>
        </ColorPicker>
      </Animated.View>
      {confirmationModalVisible && (
        <ConfirmationModal
          title="Delete Color"
          text="Are you sure you want to delete this color?"
          onCancel={() => setConfirmationModalVisible(false)}
          onSubmit={handleDeleteSwatch}
          submitBtnText="Delete"
        />
      )}
    </>
  );
}

const CustomSwatch = React.memo(
  ({
    color,
    onSave,
    onSelect,
    onDelete,
  }: {
    color?: string;
    onSave?: () => void;
    onSelect?: () => void;
    onDelete?: () => void;
  }) => {
    const tap = Gesture.Tap()
      .maxDuration(250)
      .onEnd(() => {
        if (color) {
          onSelect && runOnJS(onSelect)();
        } else {
          onSave && runOnJS(onSave)();
        }
      });

    const longPress = Gesture.LongPress()
      .minDuration(400)
      .onStart(() => {
        onDelete && runOnJS(onDelete)();
      });

    const composed = Gesture.Exclusive(longPress, tap);

    return (
      <GestureDetector gesture={composed}>
        <Animated.View
          style={{
            width: 24,
            height: 24,
            borderRadius: 8,
            backgroundColor: color ?? 'transparent',
            borderWidth: 1,
            borderColor: '#1F1F1F',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {!color && <Plus color="#1F1F1F" pointerEvents="none" />}
        </Animated.View>
      </GestureDetector>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    zIndex: 60,
  },
});
