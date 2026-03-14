import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
  Text,
} from 'react-native';
import {
  Canvas,
  Group,
  Path,
  Skia,
  SkPath,
  Rect,
  TileMode,
  FilterMode,
} from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Orientation from 'react-native-orientation-locker';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { useNavigation } from '@react-navigation/native';
import SignalRService from '../../services/SignalRService';
import Toolbar, { GestureMode } from '../../components/Toolbar';
import { API_BASE_URL } from '@env';
import UtilityBar from '../../components/UtilityBar';
import { useCanvas } from '../../context/CanvasContext';
import uuid from 'react-native-uuid';
import { useAuth } from '../../context/AuthContext';

interface Stroke {
  id: string;
  path: SkPath;
  color: string;
  width: number;
  isEraser: boolean;
}

const CHECKERBOARD_TILE_SIZE = 16;

export default function CanvasPage({ route }: any) {
  const navigation = useNavigation();
  const { projectId } = route.params;
  const { activeProject, fetchProjectDetails, loading } = useCanvas();
  const mySessionStrokeIds = useRef<Set<string>>(new Set());
  const { accessToken, authenticatedFetch } = useAuth();
  const isExiting = useRef(false);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails(projectId);
    }
  }, [projectId, fetchProjectDetails]);

  const PROJECT_WIDTH = Number(activeProject?.width) || 1920;
  const PROJECT_HEIGHT = Number(activeProject?.height) || 1080;
  const PROJECT_BG = activeProject?.backgroundColor || '#ffffff';

  const { width, height } = useWindowDimensions();
  const SCREEN_WIDTH = width;
  const SCREEN_HEIGHT = height;

  const [mode, setMode] = useState<GestureMode>('view');
  const [completedStrokes, setCompletedStrokes] = useState<Stroke[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [brushWidth, setBrushWidth] = useState(4);
  const [eraserWidth, setEraserWidth] = useState(10);

  const currentPath = useSharedValue(Skia.Path.Make());

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const clipPath = useMemo(() => {
    const path = Skia.Path.Make();
    path.addRect(Skia.XYWHRect(0, 0, PROJECT_WIDTH, PROJECT_HEIGHT));
    return path;
  }, [PROJECT_WIDTH, PROJECT_HEIGHT]);

  const groupTransform = useDerivedValue(() => {
    return [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ];
  });

  const checkerboardPaint = useMemo(() => {
    const patternSize = CHECKERBOARD_TILE_SIZE * 2;
    const rect = Skia.XYWHRect(0, 0, patternSize, patternSize);

    const recorder = Skia.PictureRecorder();
    const canvas = recorder.beginRecording(rect);

    const paintLight = Skia.Paint();
    paintLight.setColor(Skia.Color('#ffffff'));

    const paintDark = Skia.Paint();
    paintDark.setColor(Skia.Color('#e0e0e0'));

    canvas.drawRect(
      Skia.XYWHRect(0, 0, CHECKERBOARD_TILE_SIZE, CHECKERBOARD_TILE_SIZE),
      paintLight,
    );
    canvas.drawRect(
      Skia.XYWHRect(
        CHECKERBOARD_TILE_SIZE,
        CHECKERBOARD_TILE_SIZE,
        CHECKERBOARD_TILE_SIZE,
        CHECKERBOARD_TILE_SIZE,
      ),
      paintLight,
    );

    canvas.drawRect(
      Skia.XYWHRect(
        CHECKERBOARD_TILE_SIZE,
        0,
        CHECKERBOARD_TILE_SIZE,
        CHECKERBOARD_TILE_SIZE,
      ),
      paintDark,
    );
    canvas.drawRect(
      Skia.XYWHRect(
        0,
        CHECKERBOARD_TILE_SIZE,
        CHECKERBOARD_TILE_SIZE,
        CHECKERBOARD_TILE_SIZE,
      ),
      paintDark,
    );

    const picture = recorder.finishRecordingAsPicture();

    const shader = picture.makeShader(
      TileMode.Repeat,
      TileMode.Repeat,
      FilterMode.Nearest,
    );

    const paint = Skia.Paint();
    paint.setShader(shader);

    return paint;
  }, []);

  const isBackgroundTransparent =
    PROJECT_BG === 'transparent' ||
    PROJECT_BG === 'rgba(0,0,0,0)' ||
    !PROJECT_BG;

  const fitProjectToScreen = useCallback(() => {
    const padding = 50;
    const scaleX = (SCREEN_WIDTH - padding * 2) / PROJECT_WIDTH;
    const scaleY = (SCREEN_HEIGHT - padding * 2) / PROJECT_HEIGHT;
    const targetScale = Math.min(scaleX, scaleY);

    const targetX = (SCREEN_WIDTH - PROJECT_WIDTH * targetScale) / 2;
    const targetY = (SCREEN_HEIGHT - PROJECT_HEIGHT * targetScale) / 2;

    translateX.value = withTiming(targetX, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
    translateY.value = withTiming(targetY, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
    scale.value = withTiming(targetScale, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
  }, [
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    PROJECT_WIDTH,
    PROJECT_HEIGHT,
    translateX,
    translateY,
    scale,
  ]);

  useEffect(() => {
    if (activeProject && PROJECT_WIDTH > 0 && PROJECT_HEIGHT > 0) {
      fitProjectToScreen();
    }
  }, [
    width,
    height,
    activeProject,
    fitProjectToScreen,
    PROJECT_WIDTH,
    PROJECT_HEIGHT,
  ]);

  useEffect(() => {
    if (!activeProject) return;

    const initSignalR = async () => {
      try {
        const history = await SignalRService.getHistory(
          activeProject.projectId,
        );

        const historyPaths = history
          .map((h: any) => {
            if (!h.pathData) return null;
            const pathObj = Skia.Path.MakeFromSVGString(h.pathData);
            if (!pathObj) return null;
            return {
              id: h.id,
              path: pathObj,
              color: h.color || '#000000',
              width: Number(h.width) || 4,
              isEraser: h.isEraser || false,
            };
          })
          .filter((item): item is Stroke => item !== null);

        setCompletedStrokes(historyPaths);

        await SignalRService.connect(`${API_BASE_URL}/hubs/drawing`);
        await SignalRService.joinRoom(activeProject.projectId);

        SignalRService.onReceiveStroke((userId, incomingStroke) => {
          if (!incomingStroke?.pathData) return;
          const pathObj = Skia.Path.MakeFromSVGString(incomingStroke.pathData);

          if (pathObj) {
            setCompletedStrokes(prev => {
              const isDuplicate = prev.some(s => s.id === incomingStroke.id);

              if (isDuplicate) {
                return prev;
              }

              return [
                ...prev,
                {
                  id: incomingStroke.id,
                  path: pathObj,
                  color: incomingStroke.color || '#000',
                  width: Number(incomingStroke.width) || 4,
                  isEraser: incomingStroke.isEraser || false,
                },
              ];
            });
          }
        });

        SignalRService.onStrokeUndone(strokeId => {
          setCompletedStrokes(prev => prev.filter(s => s.id !== strokeId));
        });

        SignalRService.onStrokeRedone(incomingStroke => {
          if (!incomingStroke?.pathData) return;
          const pathObj = Skia.Path.MakeFromSVGString(incomingStroke.pathData);

          if (pathObj) {
            setCompletedStrokes(prev => [
              ...prev,
              {
                id: incomingStroke.id,
                path: pathObj,
                color: incomingStroke.color || '#000',
                width: Number(incomingStroke.width) || 4,
                isEraser: incomingStroke.isEraser || false,
              },
            ]);
          }
        });

        SignalRService.onCanvasCleared(clearedProjectId => {
          if (activeProject?.projectId === clearedProjectId) {
            setCompletedStrokes([]);
            setRedoStack([]);
            mySessionStrokeIds.current.clear();
            currentPath.value = Skia.Path.Make();
          }
        });
      } catch (e) {
        console.error('SignalR Init Error:', e);
      }
    };

    initSignalR();

    return () => {
      SignalRService.disconnect();
      setRedoStack([]);
      setCompletedStrokes([]);
    };
  }, [activeProject, currentPath]);

  useEffect(() => {
    Orientation.unlockAllOrientations();

    if (Platform.OS === 'android') SystemNavigationBar.stickyImmersive();
    StatusBar.setHidden(true);

    return () => {
      Orientation.lockToPortrait();

      if (Platform.OS === 'android') {
        SystemNavigationBar.navigationShow();
        SystemNavigationBar.setNavigationColor('transparent');
      }
      StatusBar.setHidden(false);
    };
  }, []);

  const handleExit = useCallback(
    async (actionToRetry?: any) => {
      try {
        await authenticatedFetch(`/project/${projectId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({}),
        });
      } catch (error) {
        console.error('Çıkış güncelleme hatası:', error);
      } finally {
        isExiting.current = true;

        if (actionToRetry) {
          navigation.dispatch(actionToRetry);
        } else {
          navigation.goBack();
        }
      }
    },
    [projectId, accessToken, authenticatedFetch, navigation],
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (isExiting.current) {
        return;
      }

      const action = e.data.action;

      e.preventDefault();

      handleExit(action);
    });

    return unsubscribe;
  }, [navigation, handleExit]);

  const sendStrokeToBackend = (
    pathString: string,
    isEraser: boolean,
    strokeId: string,
  ) => {
    if (activeProject) {
      const strokeData = {
        id: strokeId,
        color: selectedColor,
        width: isEraser ? eraserWidth : brushWidth,
        pathData: pathString,
        isEraser: isEraser,
      };
      SignalRService.sendStroke(activeProject.projectId, strokeData);
    }
  };

  const panX = useSharedValue(0);
  const panY = useSharedValue(0);
  const pinchScale = useSharedValue(1);
  const isDrawingValid = useSharedValue(false);

  useEffect(() => {
    if (!isDrawingValid.value) {
      requestAnimationFrame(() => {
        currentPath.value = Skia.Path.Make();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedStrokes]);

  const isDrawingOrErasing = mode === 'draw' || mode === 'erase';

  const drawGesture = Gesture.Pan()
    .enabled(isDrawingOrErasing)
    .minDistance(1)
    .maxPointers(1)
    .runOnJS(true)
    .onStart(g => {
      const x = (g.x - translateX.value) / scale.value;
      const y = (g.y - translateY.value) / scale.value;

      if (x >= 0 && x <= PROJECT_WIDTH && y >= 0 && y <= PROJECT_HEIGHT) {
        isDrawingValid.value = true;

        const newPath = Skia.Path.Make();
        newPath.moveTo(x, y);
        currentPath.value = newPath;
      } else {
        isDrawingValid.value = false;
      }
    })
    .onUpdate(g => {
      if (!isDrawingValid.value) return;

      let x = (g.x - translateX.value) / scale.value;
      let y = (g.y - translateY.value) / scale.value;

      if (x < 0) x = 0;
      if (x > PROJECT_WIDTH) x = PROJECT_WIDTH;
      if (y < 0) y = 0;
      if (y > PROJECT_HEIGHT) y = PROJECT_HEIGHT;

      currentPath.value.lineTo(x, y);
      currentPath.modify();
    })
    .onEnd(() => {
      if (isDrawingValid.value && currentPath.value) {
        const pathCopy = currentPath.value.copy();
        const svgString = pathCopy.toSVGString();

        const strokeId = uuid.v4() as string;
        mySessionStrokeIds.current.add(strokeId);

        const newStroke: Stroke = {
          id: strokeId,
          path: pathCopy,
          color: selectedColor,
          width: mode === 'erase' ? eraserWidth : brushWidth,
          isEraser: mode === 'erase',
        };

        setCompletedStrokes(prev => [...prev, newStroke]);

        setRedoStack([]);

        sendStrokeToBackend(svgString, mode === 'erase', strokeId);
      }

      isDrawingValid.value = false;
    });

  const panGesture = Gesture.Pan()
    .minPointers(isDrawingOrErasing ? 2 : 1)
    .averageTouches(true)
    .onStart(() => {
      panX.value = 0;
      panY.value = 0;
    })
    .onUpdate(e => {
      const deltaX = e.translationX - panX.value;
      const deltaY = e.translationY - panY.value;

      translateX.value += deltaX;
      translateY.value += deltaY;

      panX.value = e.translationX;
      panY.value = e.translationY;
    });

  const zoomGesture = Gesture.Pinch()
    .onStart(() => {
      pinchScale.value = 1;
    })
    .onUpdate(e => {
      const deltaScale = e.scale / pinchScale.value;
      pinchScale.value = e.scale;

      const oldScale = scale.value;
      const newScale = oldScale * deltaScale;
      scale.value = newScale;

      const correctionX = (1 - deltaScale) * (e.focalX - translateX.value);
      const correctionY = (1 - deltaScale) * (e.focalY - translateY.value);

      translateX.value += correctionX;
      translateY.value += correctionY;
    });

  const composedGestures = Gesture.Race(
    drawGesture,
    Gesture.Simultaneous(panGesture, zoomGesture),
  );

  const handleUndo = useCallback(() => {
    if (completedStrokes.length === 0) return;

    const lastStroke = completedStrokes[completedStrokes.length - 1];

    if (!mySessionStrokeIds.current.has(lastStroke.id)) {
      return;
    }

    mySessionStrokeIds.current.delete(lastStroke.id);

    SignalRService.undoStroke(activeProject?.projectId, lastStroke.id);

    setRedoStack(prevRedo => [...prevRedo, lastStroke]);

    setCompletedStrokes(prev => prev.slice(0, -1));
  }, [activeProject, completedStrokes]);

  const handleRedo = useCallback(() => {
    setRedoStack(prevRedo => {
      if (prevRedo.length === 0) return prevRedo;

      const strokeToRestore = prevRedo[prevRedo.length - 1];
      const newRedoStack = prevRedo.slice(0, -1);

      setCompletedStrokes(prevStrokes => [...prevStrokes, strokeToRestore]);

      mySessionStrokeIds.current.add(strokeToRestore.id);

      SignalRService.redoStroke(activeProject?.projectId, strokeToRestore.id);

      return newRedoStack;
    });
  }, [activeProject]);

  const handleWidthChange = (type: GestureMode, newWidth: number) => {
    if (type === 'draw') {
      setBrushWidth(newWidth);
    } else {
      setEraserWidth(newWidth);
    }
  };

  const handleClearCanvas = useCallback(() => {
    setCompletedStrokes([]);
    setRedoStack([]);
    mySessionStrokeIds.current.clear();
    currentPath.value = Skia.Path.Make();

    if (activeProject?.projectId) {
      SignalRService.clearCanvas(activeProject.projectId);
    }
  }, [activeProject, currentPath]);

  if (loading || !activeProject) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#1F1F1F" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Toolbar
        activeMode={mode}
        onModeChange={newMode => setMode(newMode)}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        brushWidth={brushWidth}
        eraserWidth={eraserWidth}
        onWidthChange={handleWidthChange}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClearCanvas={handleClearCanvas}
      />
      <UtilityBar onBack={() => navigation.goBack()} />
      <GestureDetector gesture={composedGestures}>
        <View style={styles.canvasContainer}>
          <Canvas style={styles.canvas}>
            <Group transform={groupTransform}>
              <Group clip={clipPath}>
                {isBackgroundTransparent ? (
                  <Rect
                    x={0}
                    y={0}
                    width={PROJECT_WIDTH}
                    height={PROJECT_HEIGHT}
                    paint={checkerboardPaint}
                  />
                ) : (
                  <Rect
                    x={0}
                    y={0}
                    width={PROJECT_WIDTH}
                    height={PROJECT_HEIGHT}
                    color={PROJECT_BG}
                  />
                )}
                <Group layer>
                  {completedStrokes.map((stroke, index) => {
                    if (!stroke.path) return null;
                    const isEraser = stroke.isEraser;

                    return (
                      <Path
                        key={index}
                        path={stroke.path}
                        blendMode={isEraser ? 'clear' : 'srcOver'}
                        color={isEraser ? 'transparent' : stroke.color}
                        style="stroke"
                        strokeWidth={stroke.width}
                        strokeCap="round"
                        strokeJoin="round"
                      />
                    );
                  })}
                  <Path
                    path={currentPath}
                    blendMode={mode === 'erase' ? 'clear' : 'srcOver'}
                    color={mode === 'erase' ? 'transparent' : selectedColor}
                    style="stroke"
                    strokeWidth={mode === 'erase' ? eraserWidth : brushWidth}
                    strokeCap="round"
                    strokeJoin="round"
                  />
                </Group>
              </Group>
            </Group>
          </Canvas>
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#444',
  },
  canvasContainer: { flex: 1, backgroundColor: '#444' },
  canvas: { flex: 1 },
});
