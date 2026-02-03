/* eslint-disable react-native/no-inline-styles */
import React, { useState, useCallback } from 'react';
import {
  View,
  StatusBar,
  Platform,
  Pressable,
  Text,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { useResponsive } from '../hooks/useResponsive';
import Header from '../components/Header';
import ProjectCard from '../components/ProjectCard';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import FloatingActionButton from '../components/FloatingActionButton';
import { Storage } from '../utils/storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import CreatedProjectModal from '../components/CreatedProjectModal';
import CreateModal from '../components/CreateModal';
import { useAuth } from '../context/AuthContext';
import { CreateProjectDto, Project } from '../data/types';
import Page from '../components/Page';
import UpperTabs from '../components/UpperTabs';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Overlay from '../components/Overlay';
import Drawer from '../components/Drawer';

export default function HomePage() {
  const { rs } = useResponsive();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const { accessToken, authenticatedFetch } = useAuth();
  const [searchText, setSearchText] = useState('');
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const active = useSharedValue(false);
  const progress = useDerivedValue(() => {
    return withTiming(active.value ? 1 : 0);
  });
  const moveX = SCREEN_WIDTH * -0.6;

  const animatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      progress.value,
      [0, 1],
      [0, 15],
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        { perspective: 1000 },
        {
          scale: active.value ? withTiming(0.8) : withTiming(1),
        },
        {
          translateX: active.value ? withSpring(moveX) : withTiming(0),
        },
        { rotateY: `${rotateY}deg` },
      ],
      borderRadius: active.value ? withTiming(20) : withTiming(0),
    };
  });

  const [projects, setProjects] = useState<Project[]>([]);

  const [createVisible, setCreateVisible] = useState(false);

  const [createdModalVisible, setCreatedModalVisible] = useState(false);
  const [createdProjectName, setCreatedProjectName] = useState('');
  const [createdInvitationLink, setCreatedInvitationLink] = useState('');

  useFocusEffect(
    useCallback(() => {
      Orientation.lockToPortrait();

      StatusBar.setHidden(false);

      if (Platform.OS === 'android') {
        SystemNavigationBar.navigationShow();
        SystemNavigationBar.setNavigationColor('transparent');
      }

      const fetchProjects = async () => {
        try {
          const response = await authenticatedFetch('/project', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            return false;
          } else {
            const data = await response.json();
            console.log(data);
            setProjects(data);
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchProjects();
    }, [accessToken, authenticatedFetch]),
  );

  const handleCreateNewWhiteBoardProject = async (
    projectDto: CreateProjectDto,
  ) => {
    try {
      const response = await authenticatedFetch('/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(projectDto),
      });

      if (!response.ok) {
        return false;
      } else {
        const data = await response.json();
        console.log(data);
        setCreatedProjectName(data.projectName);
        setCreatedInvitationLink(data.invitationUrl);
        setCreatedModalVisible(true);
        setProjects(prev => [...prev, data]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Drawer active={active} />
      <Animated.View className="flex-1 bg-main" style={animatedStyle}>
        <View className="flex-1">
          <Header
            searchText={searchText}
            setSearchText={text => setSearchText(text)}
            active={active}
          />
          <Page active={active}>
            <View style={{ gap: rs(20) }}>
              <UpperTabs />
              <Pressable
                onPress={() => {
                  Storage.clearAll();
                  navigation.replace('Onboarding');
                }}
              >
                <Text>Reset Auth</Text>
              </Pressable>
              <Pressable onPress={() => setCreatedModalVisible(true)}>
                <Text>debug modal</Text>
              </Pressable>
              <FlatList
                data={projects}
                keyExtractor={project => project.projectId}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                renderItem={({ item: project }) => (
                  <ProjectCard project={project} />
                )}
                contentContainerStyle={{
                  paddingBottom: rs(100),
                  paddingHorizontal: rs(10),
                  gap: rs(24),
                }}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </Page>
          <FloatingActionButton
            createNewWhiteBoard={() => setCreateVisible(true)}
            createNewPixelBoard={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        </View>
        {createVisible && (
          <CreateModal
            projectType="whiteboard"
            handleDismiss={() => setCreateVisible(false)}
            handleCreateWhiteBoard={projectDto =>
              handleCreateNewWhiteBoardProject(projectDto)
            }
            // handleCreatePixelBoard={projectName =>
            //   handleCreateNewPixelBoardProject(projectName)
            // }
          />
        )}
        {createdModalVisible && (
          <CreatedProjectModal
            handleDismiss={() => {
              setCreatedModalVisible(false);
              setCreatedProjectName('');
              setCreatedInvitationLink('');
            }}
            projectName={createdProjectName}
            invitationLink={createdInvitationLink}
          />
        )}
        <Overlay active={active} />
      </Animated.View>
    </>
  );
}
