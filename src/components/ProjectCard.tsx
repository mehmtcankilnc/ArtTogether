/* eslint-disable react-native/no-inline-styles */
import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/types';
import { Project } from '../data/types';
import {
  Clock,
  Information,
  MultipleImages,
  People,
  RightCircleArrow,
} from 'smooth-icon';

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
  const { rs } = useResponsive();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  console.log(project);

  const formatLastUpdatedTime = (): string => {
    const now = new Date();
    const updatedAt = new Date(project?.updatedAt);

    const seconds = Math.floor((now.getTime() - updatedAt.getTime()) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    for (const [unit, value] of Object.entries(intervals)) {
      const count = Math.floor(seconds / value);
      if (count >= 1) {
        return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
      }
    }

    return 'just now';
  };

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('CanvasStack', {
          screen: 'Canvas',
          params: { projectId: project.projectId },
        })
      }
      className="bg-secondaryBg rounded-2xl justify-center"
      style={{
        width: rs(160),
        height: rs(160),
        paddingHorizontal: rs(12),
        gap: rs(6),
      }}
    >
      <View className="flex-row justify-between items-center">
        <Text
          style={{
            fontFamily: 'Nunito-SemiBold',
            fontSize: 14,
            color: '#1F1F1F',
            maxWidth: rs(100),
          }}
          numberOfLines={1}
        >
          {project.projectName ?? 'Project Title'}
        </Text>
        <Information size={18} color={'#1F1F1F'} />
      </View>
      <View className="w-full items-center">
        <MultipleImages size={48} color="#1F1F1F" />
      </View>
      <View className="flex-row justify-between items-center">
        <View>
          <View className="flex-row items-center" style={{ gap: rs(6) }}>
            <People size={18} color={'#1F1F1F'} />
            <Text
              style={{
                fontFamily: 'Nunito-Regular',
                fontSize: 10,
                color: '#1F1F1F',
              }}
            >
              4 people
            </Text>
          </View>
          <View className="flex-row items-center" style={{ gap: rs(6) }}>
            <Clock size={18} color={'#1F1F1F'} />
            <Text
              style={{
                fontFamily: 'Nunito-Regular',
                fontSize: 10,
                color: '#1F1F1F',
              }}
            >
              {formatLastUpdatedTime()}
            </Text>
          </View>
        </View>
        <RightCircleArrow color={'#1F1F1F'} />
      </View>
    </Pressable>
  );
}
