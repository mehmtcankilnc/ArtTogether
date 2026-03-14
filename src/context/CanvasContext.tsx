import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useCallback,
} from 'react';
import { ProjectDetails, UpdateProjectDto } from '../data/types';
import { useAuth } from './AuthContext';

interface CanvasContextType {
  fetchProjectDetails: (projectId: string) => Promise<void>;
  activeProject: ProjectDetails | undefined;
  loading: boolean;
  handleUpdateProject: (
    dto: UpdateProjectDto,
    projectId: string,
  ) => Promise<void>;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export default function CanvasProvider({ children }: { children: ReactNode }) {
  const { authenticatedFetch, accessToken } = useAuth();

  const [activeProject, setActiveProject] = useState<ProjectDetails>();
  const [loading, setLoading] = useState(false);

  const fetchProjectDetails = useCallback(
    async (projectId: string) => {
      setLoading(true);
      try {
        const response = await authenticatedFetch(`/project/${projectId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setActiveProject(data);
        } else {
          console.error(
            'Proje detayları alınamadı. HTTP Status:',
            response.status,
          );
        }
      } catch (error) {
        console.error('Fetch Hatası:', error);
      } finally {
        setLoading(false);
      }
    },
    [authenticatedFetch, accessToken],
  );

  const handleUpdateProject = async (
    dto: UpdateProjectDto,
    projectId: string,
  ) => {
    setActiveProject(prev => (prev ? { ...prev, ...dto } : prev));

    try {
      await authenticatedFetch(`/project/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(dto),
      });
    } catch (error) {
      console.error('Güncelleme Hatası:', error);
    }
  };

  return (
    <CanvasContext.Provider
      value={{
        fetchProjectDetails,
        activeProject,
        loading,
        handleUpdateProject,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}

export const useCanvas = () => {
  const context = useContext(CanvasContext);

  if (context === undefined) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }

  return context;
};
