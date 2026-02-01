/* eslint-disable react-native/no-inline-styles */
import { View, Text, Pressable, TextInput } from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useResponsive } from '../hooks/useResponsive';
import Button from './Button';

type Props = {
  projectType: 'whiteboard' | 'pixelboard';
  handleDismiss: () => void;
  handleCreateWhiteBoard: (projectName: string) => void;
  // handleCreatePixelBoard: (projectName: string) => void;
};

export default function CreateModal({
  projectType,
  handleDismiss,
  handleCreateWhiteBoard,
}: Props) {
  const { rs } = useResponsive();

  const [projectName, setProjectName] = useState('');

  return (
    <Pressable
      onPress={handleDismiss}
      className="absolute top-0 bottom-0 right-0 left-0 flex-1 bg-black/15 items-center justify-center"
    >
      <Pressable
        className="bg-pageBg rounded-lg items-center"
        style={{ width: rs(350), height: rs(400), padding: rs(20) }}
      >
        <View
          className="absolute bg-pageBg rounded-full"
          style={{ padding: rs(8), top: -rs(38) }}
        >
          <Ionicons
            name={
              projectType === 'whiteboard' ? 'easel-outline' : 'grid-outline'
            }
            size={rs(60)}
            color="#EFC130"
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
            Create New White Board
          </Text>
          <View style={{ gap: rs(12) }}>
            <Text
              style={{
                fontFamily: 'Nunito-Regular',
                fontSize: rs(16),
                textAlign: 'center',
              }}
            >
              Enter a cool name for your project.
            </Text>
            <TextInput
              value={projectName}
              onChangeText={setProjectName}
              className="bg-white rounded-md elevation-md color-action"
              placeholder="Project Name"
              placeholderTextColor="#EC6426"
              cursorColor="#EC6426"
              style={{ paddingLeft: rs(10) }}
            />
          </View>
          <View className="flex-1 justify-end">
            <Button
              handleSubmit={() => {
                if (projectType === 'whiteboard') {
                  handleCreateWhiteBoard(projectName);
                } else {
                  //handleCreatePixelBoard(projectName);
                }
                handleDismiss();
              }}
              text="Create Now"
            />
          </View>
        </View>
      </Pressable>
    </Pressable>
  );
}
