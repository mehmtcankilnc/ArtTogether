/* eslint-disable react-native/no-inline-styles */
import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Project } from '../data/types';

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
  const { rs } = useResponsive();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('Canvas', { projectId: project.projectId })
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
        <Ionicons name="heart-outline" size={16} color="#1F1F1F" />
      </View>
      <View className="w-full items-center">
        <Ionicons name="images-outline" size={48} color="#1F1F1F" />
      </View>
      <View className="flex-row justify-between items-center">
        <View>
          <View className="flex-row items-center" style={{ gap: rs(6) }}>
            <Ionicons name="people-outline" size={16} color="#1F1F1F" />
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
            <Ionicons name="time-outline" size={16} color="#1F1F1F" />
            <Text
              style={{
                fontFamily: 'Nunito-Regular',
                fontSize: 10,
                color: '#1F1F1F',
              }}
            >
              8 hours ago
            </Text>
          </View>
        </View>
        <Ionicons
          name="chevron-forward-circle-outline"
          size={24}
          color="#1F1F1F"
        />
      </View>
    </Pressable>
  );
}
