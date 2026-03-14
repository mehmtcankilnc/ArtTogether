/* eslint-disable react-native/no-inline-styles */
import { View, Text, Pressable, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useResponsive } from '../hooks/useResponsive';
import Button from './Button';
import LinearGradient from 'react-native-linear-gradient';
import CustomColorPicker from './CustomColorPicker';
import { CreateProjectDto } from '../data/types';

type Props = {
  projectType: 'whiteboard' | 'pixelboard';
  handleDismiss: () => void;
  handleCreateWhiteBoard: (projectDto: CreateProjectDto) => void;
  // handleCreatePixelBoard: (projectName: string) => void;
};

export default function CreateModal({
  projectType,
  handleDismiss,
  handleCreateWhiteBoard,
}: Props) {
  const { rs } = useResponsive();

  const [projectName, setProjectName] = useState('');
  const [projectWidth, setProjectWidth] = useState('1920');
  const [projectHeight, setProjectHeight] = useState('1080');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

  const [pickerVisible, setPickerVisible] = useState(false);
  const [error, setError] = useState('');

  const onColorChange = (color: string) => {
    setBackgroundColor(color);
  };

  const isCustomColorSelected = () => {
    return (
      backgroundColor.toUpperCase() !== '#FFFFFF' &&
      backgroundColor !== '#000000' &&
      backgroundColor.startsWith('#')
    );
  };

  const isColorLight = () => {
    if (!backgroundColor || !backgroundColor.startsWith('#')) return true;

    const r = parseInt(backgroundColor.slice(1, 3), 16);
    const g = parseInt(backgroundColor.slice(3, 5), 16);
    const b = parseInt(backgroundColor.slice(5, 7), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128;
  };

  const handleSubmit = () => {
    if (projectName || projectName.length <= 0) {
      setError('Project name is required!');
      return;
    } else {
      if (projectType === 'whiteboard') {
        handleCreateWhiteBoard({
          projectName,
          projectWidth,
          projectHeight,
          backgroundColor,
        });
      } else {
        //handleCreatePixelBoard(projectName);
      }
      handleDismiss();
    }
  };

  return (
    <>
      <Pressable
        onPress={handleDismiss}
        className="absolute top-0 bottom-0 right-0 left-0 flex-1 bg-black/30 items-center justify-center"
      >
        <Pressable
          className="bg-pageBg"
          style={{ width: rs(350), height: rs(450), borderRadius: 16 }}
        >
          {/** Header */}
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
              Create New{' '}
              {projectType === 'whiteboard' ? 'White Board' : 'Pixel Board'}
            </Text>
          </LinearGradient>
          {/** Content */}
          <View style={{ gap: rs(16), padding: rs(12) }}>
            {/** Project Name */}
            <View style={{ gap: rs(6) }}>
              <Text
                style={{
                  fontFamily: 'Nunito-SemiBold',
                  fontSize: 14,
                  color: '#1F1F1F',
                }}
              >
                Project Name*
              </Text>
              <TextInput
                value={projectName}
                onChangeText={setProjectName}
                placeholder="Enter project name..."
                placeholderTextColor="#1F1F1F"
                cursorColor="#1F1F1F"
                className="border border-buttonBg rounded-full color-[#1F1F1F] pl-3"
                style={{ fontFamily: 'Nunito-LightItalic' }}
              />
              {error && (
                <Text
                  style={{
                    fontFamily: 'Nunito-SemiBold',
                    fontSize: 10,
                    color: '#EB4034',
                  }}
                >
                  {error}
                </Text>
              )}
            </View>
            {/** Canvas Size */}
            <View style={{ gap: rs(6) }}>
              <Text
                style={{
                  fontFamily: 'Nunito-SemiBold',
                  fontSize: 14,
                  color: '#1F1F1F',
                }}
              >
                Canvas Size
              </Text>
              {/** Props */}
              <View className="flex-row items-center" style={{ gap: rs(8) }}>
                {/** Width */}
                <View style={{ gap: rs(6) }}>
                  <Text
                    style={{
                      fontFamily: 'Nunito-MediumItalic',
                      fontSize: 12,
                      color: '#1F1F1F',
                    }}
                  >
                    Width
                  </Text>
                  <View
                    className="border border-buttonBg rounded-full items-center justify-center"
                    style={{
                      width: rs(100),
                      height: rs(30),
                    }}
                  >
                    <TextInput
                      value={projectWidth}
                      onChangeText={setProjectWidth}
                      placeholder="Width"
                      placeholderTextColor="#1F1F1F"
                      cursorColor="#1F1F1F"
                      keyboardType="numeric"
                      style={{
                        flex: 1,
                        width: '100%',
                        fontFamily: 'Nunito-LightItalic',
                        fontSize: 14,
                        lineHeight: 21,
                        includeFontPadding: false,
                        paddingVertical: 0,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                      }}
                    />
                  </View>
                </View>
                {/** Height */}
                <View style={{ gap: rs(6) }}>
                  <Text
                    style={{
                      fontFamily: 'Nunito-MediumItalic',
                      fontSize: 12,
                      color: '#1F1F1F',
                    }}
                  >
                    Height
                  </Text>
                  <View
                    className="border border-buttonBg rounded-full items-center justify-center"
                    style={{
                      width: rs(100),
                      height: rs(30),
                    }}
                  >
                    <TextInput
                      value={projectHeight}
                      onChangeText={setProjectHeight}
                      placeholder="Height"
                      placeholderTextColor="#1F1F1F"
                      cursorColor="#1F1F1F"
                      keyboardType="numeric"
                      style={{
                        flex: 1,
                        width: '100%',
                        fontFamily: 'Nunito-LightItalic',
                        fontSize: 14,
                        lineHeight: 21,
                        includeFontPadding: false,
                        paddingVertical: 0,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
            {/** Background Color */}
            <View style={{ gap: rs(6) }}>
              <Text
                style={{
                  fontFamily: 'Nunito-SemiBold',
                  fontSize: 14,
                  color: '#1F1F1F',
                }}
              >
                Background Color
              </Text>
              <View
                className="flex-row flex-wrap items-center"
                style={{ gap: rs(8) }}
              >
                <Pressable
                  onPress={() => setBackgroundColor('#FFFFFF')}
                  className={`border border-buttonBg rounded-full ${
                    backgroundColor.toUpperCase() === '#FFFFFF'
                      ? 'bg-buttonBg'
                      : 'bg-pageBg'
                  }`}
                  style={{ paddingVertical: rs(2), paddingHorizontal: rs(6) }}
                >
                  <Text
                    style={{
                      fontFamily: 'Nunito-SemiBold',
                      fontSize: 12,
                      color:
                        backgroundColor.toUpperCase() === '#FFFFFF'
                          ? '#FDFDFD'
                          : '#1F1F1F',
                    }}
                  >
                    WHITE
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setBackgroundColor('#000000')}
                  className={`border border-buttonBg rounded-full ${
                    backgroundColor === '#000000' ? 'bg-buttonBg' : 'bg-pageBg'
                  }`}
                  style={{ paddingVertical: rs(2), paddingHorizontal: rs(6) }}
                >
                  <Text
                    style={{
                      fontFamily: 'Nunito-SemiBold',
                      fontSize: 12,
                      color:
                        backgroundColor === '#000000' ? '#FDFDFD' : '#1F1F1F',
                    }}
                  >
                    BLACK
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setBackgroundColor('transparent')}
                  className={`border border-buttonBg rounded-full ${
                    backgroundColor === 'transparent'
                      ? 'bg-buttonBg'
                      : 'bg-pageBg'
                  }`}
                  style={{ paddingVertical: rs(2), paddingHorizontal: rs(6) }}
                >
                  <Text
                    style={{
                      fontFamily: 'Nunito-SemiBold',
                      fontSize: 12,
                      color:
                        backgroundColor === 'transparent'
                          ? '#FDFDFD'
                          : '#1F1F1F',
                    }}
                  >
                    TRANSPARENT
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setPickerVisible(true)}
                  className="border border-buttonBg rounded-full"
                  style={{
                    paddingHorizontal: rs(8),
                    paddingVertical: rs(2),
                    backgroundColor: isCustomColorSelected()
                      ? backgroundColor
                      : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Nunito-SemiBold',
                      fontSize: 12,
                      color: isCustomColorSelected()
                        ? isColorLight()
                          ? '#1F1F1F'
                          : '#FFFFFF'
                        : '#1F1F1F',
                    }}
                  >
                    {isCustomColorSelected()
                      ? backgroundColor.toUpperCase()
                      : 'CUSTOM COLOR'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
          {/** Buttons Area */}
          <View className="flex-row justify-center" style={{ gap: rs(12) }}>
            <Button
              type="cancel"
              handleSubmit={() => handleDismiss()}
              text="Cancel"
            />
            <Button type="submit" handleSubmit={handleSubmit} text="Create" />
          </View>
        </Pressable>
      </Pressable>
      {pickerVisible && (
        <CustomColorPicker
          handleDismiss={() => setPickerVisible(false)}
          selectedColor={backgroundColor}
          handleColorChange={onColorChange}
        />
      )}
    </>
  );
}
