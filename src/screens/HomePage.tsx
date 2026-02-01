/* eslint-disable react-native/no-inline-styles */
import React, { useState, useCallback } from 'react';
import {
  View,
  StatusBar,
  Platform,
  Pressable,
  Text,
  FlatList,
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
import { Project } from '../data/types';
import Page from '../components/Page';
import UpperTabs from '../components/UpperTabs';

export default function HomePage() {
  const { rs } = useResponsive();
  const { accessToken, authenticatedFetch } = useAuth();
  const [searchText, setSearchText] = useState('');
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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

  const handleCreateNewWhiteBoardProject = async (projectName: string) => {
    try {
      const response = await authenticatedFetch('/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(projectName),
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
    <View className="flex-1 bg-main">
      <Header
        searchText={searchText}
        setSearchText={text => setSearchText(text)}
      />
      <Page>
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
            renderItem={({ item: project }) => (
              <ProjectCard key={project.projectId} project={project} />
            )}
            contentContainerStyle={{
              paddingBottom: rs(120),
              padding: rs(12),
              flexGrow: 1,
              gap: rs(24),
            }}
          />
        </View>
      </Page>
      {createVisible && (
        <CreateModal
          projectType="whiteboard"
          handleDismiss={() => setCreateVisible(false)}
          handleCreateWhiteBoard={projectName =>
            handleCreateNewWhiteBoardProject(projectName)
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
      <FloatingActionButton
        createNewWhiteBoard={() => setCreateVisible(true)}
        createNewPixelBoard={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    </View>
  );
}
