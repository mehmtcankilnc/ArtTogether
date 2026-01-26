import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Canvas, Group, Path, Skia, SkPath } from '@shopify/react-native-skia';
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
import SignalRService from '../services/SignalRService';
import Toolbar, { GestureMode } from '../components/Toolbar';

const ROOM_ID = 'test-oda-1';
const API_URL = 'http://localhost:5091/hubs/drawing';

interface Stroke {
  path: SkPath;
  color: string;
  width: number;
}

export default function CanvasPage() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const SCREEN_WIDTH = width < height ? height : width;
  const SCREEN_HEIGHT = width < height ? width : height;

  const [mode, setMode] = useState<GestureMode>('draw');
  const [completedStrokes, setCompletedStrokes] = useState<Stroke[]>([]);
  const currentPath = useSharedValue(Skia.Path.Make());

  const translateX = useSharedValue(SCREEN_WIDTH / 2);
  const translateY = useSharedValue(SCREEN_HEIGHT / 2);
  const scale = useSharedValue(1);

  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const savedScale = useSharedValue(1);

  const groupTransform = useDerivedValue(() => {
    return [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ];
  });

  const zoomToFit = useCallback(
    (strokes: Stroke[]) => {
      if (strokes.length === 0) return;

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      strokes.forEach(s => {
        const bounds = s.path.getBounds();
        if (bounds.width > 0 && bounds.height > 0) {
          if (bounds.x < minX) minX = bounds.x;
          if (bounds.y < minY) minY = bounds.y;
          if (bounds.x + bounds.width > maxX) maxX = bounds.x + bounds.width;
          if (bounds.y + bounds.height > maxY) maxY = bounds.y + bounds.height;
        }
      });

      if (minX === Infinity) return;

      const contentWidth = maxX - minX;
      const contentHeight = maxY - minY;

      const contentCenterX = minX + contentWidth / 2;
      const contentCenterY = minY + contentHeight / 2;

      const scaleX = SCREEN_WIDTH / contentWidth;
      const scaleY = SCREEN_HEIGHT / contentHeight;
      const targetScale = Math.min(scaleX, scaleY) * 0.85;

      const targetX = SCREEN_WIDTH / 2 / targetScale - contentCenterX;
      const targetY = SCREEN_HEIGHT / 2 / targetScale - contentCenterY;

      translateX.value = withTiming(targetX * targetScale, {
        duration: 500,
        easing: Easing.out(Easing.exp),
      });
      translateY.value = withTiming(targetY * targetScale, {
        duration: 500,
        easing: Easing.out(Easing.exp),
      });
      scale.value = withTiming(targetScale, {
        duration: 500,
        easing: Easing.out(Easing.exp),
      });
    },
    [SCREEN_WIDTH, SCREEN_HEIGHT, translateX, translateY, scale],
  );

  useEffect(() => {
    const initSignalR = async () => {
      const history = await SignalRService.getHistory(ROOM_ID);

      const historyPaths = history
        .map(h => ({
          path: Skia.Path.MakeFromSVGString(h.pathData)!,
          color: h.color,
          width: h.width,
        }))
        .filter(p => p.path !== null);

      setCompletedStrokes(historyPaths);

      if (historyPaths.length > 0) {
        setTimeout(() => {
          zoomToFit(historyPaths);
        }, 100);
      }

      await SignalRService.connect(API_URL);
      await SignalRService.joinRoom(ROOM_ID);

      SignalRService.onReceiveStroke((userId, incomingStroke) => {
        // KENDİ ÇİZDİĞİM VERİYİ TEKRAR ALIYORSAM ÇİZME (Echo Prevention)
        // Backend'de "Context.ConnectionId" kullanmıştık.
        // Buradaki MY_USER_ID ile backend'in gönderdiği ID'yi eşleştirmek gerek.
        // Şimdilik sadece "Başkası çizdi" mantığını kuralım:

        const pathObj = Skia.Path.MakeFromSVGString(incomingStroke.pathData);

        if (pathObj) {
          const newStroke: Stroke = {
            path: pathObj,
            color: incomingStroke.color,
            width: incomingStroke.width,
          };

          setCompletedStrokes(prev => [...prev, newStroke]);
        }
      });
    };

    initSignalR();

    return () => {
      SignalRService.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Orientation.lockToLandscape();
    if (Platform.OS === 'android') SystemNavigationBar.stickyImmersive();
    StatusBar.setHidden(true);
    return () => {
      Orientation.unlockAllOrientations();
      if (Platform.OS === 'android') {
        SystemNavigationBar.navigationShow();
        SystemNavigationBar.setNavigationColor('transparent');
      }
      StatusBar.setHidden(false);
    };
  }, []);

  const sendStrokeToBackend = (pathString: string) => {
    const strokeData = {
      color: '#000000',
      width: 4,
      pathData: pathString,
    };

    SignalRService.sendStroke(ROOM_ID, strokeData);
  };

  const drawGesture = Gesture.Pan()
    .enabled(mode === 'draw')
    .minDistance(1)
    .runOnJS(true)
    .onStart(g => {
      const newPath = Skia.Path.Make();
      const x = (g.x - translateX.value) / scale.value;
      const y = (g.y - translateY.value) / scale.value;
      newPath.moveTo(x, y);
      currentPath.value = newPath;
    })
    .onUpdate(g => {
      const x = (g.x - translateX.value) / scale.value;
      const y = (g.y - translateY.value) / scale.value;
      currentPath.value.lineTo(x, y);
      currentPath.modify();
    })
    .onEnd(() => {
      if (currentPath.value) {
        const pathCopy = currentPath.value.copy();
        const svgString = pathCopy.toSVGString();
        setCompletedStrokes(prev => [
          ...prev,
          { path: pathCopy, color: '#000', width: 4 },
        ]);
        sendStrokeToBackend(svgString);
      }
    });

  const panGesture = Gesture.Pan()
    .enabled(mode === 'view')
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate(e => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    });

  const pinchGesture = Gesture.Pinch()
    .enabled(mode === 'view')
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate(e => {
      scale.value = savedScale.value * e.scale;
    });

  const composedGestures = Gesture.Race(
    drawGesture,
    Gesture.Simultaneous(panGesture, pinchGesture),
  );

  return (
    <View style={styles.container}>
      <Toolbar
        activeMode={mode}
        onModeChange={newMode => setMode(newMode)}
        onBack={() => navigation.goBack()}
      />
      <GestureDetector gesture={composedGestures}>
        <View style={styles.canvasContainer}>
          <Canvas style={styles.canvas}>
            <Group transform={groupTransform}>
              {completedStrokes.map((stroke, index) => (
                <Path
                  key={index}
                  path={stroke.path}
                  color={stroke.color}
                  style="stroke"
                  strokeWidth={stroke.width}
                  strokeCap="round"
                  strokeJoin="round"
                />
              ))}
              <Path
                path={currentPath}
                color="#000"
                style="stroke"
                strokeWidth={4}
                strokeCap="round"
                strokeJoin="round"
              />
            </Group>
          </Canvas>
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  canvasContainer: { flex: 1, backgroundColor: '#fff' },
  canvas: { flex: 1 },
  floatingBackButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
