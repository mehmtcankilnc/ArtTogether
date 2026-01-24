import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Canvas, Path, Skia, SkPath } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import Orientation from 'react-native-orientation-locker';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import SignalRService from '../services/SignalRService';

const ROOM_ID = 'test-oda-1';
const API_URL = 'http://localhost:5091/hubs/drawing';

interface Stroke {
  path: SkPath;
  color: string;
  width: number;
}

export default function CanvasPage() {
  const navigation = useNavigation();
  const [completedStrokes, setCompletedStrokes] = useState<Stroke[]>([]);
  const currentPath = useSharedValue(Skia.Path.Make());

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

      await SignalRService.connect(API_URL);
      await SignalRService.joinRoom(ROOM_ID);

      SignalRService.onReceiveStroke((userId, incomingStroke) => {
        console.log('Veri geldi:', userId);

        // KENDİ ÇİZDİĞİM VERİYİ TEKRAR ALIYORSAM ÇİZME (Echo Prevention)
        // Backend'de "Context.ConnectionId" kullanmıştık.
        // Buradaki MY_USER_ID ile backend'in gönderdiği ID'yi eşleştirmek gerek.
        // Şimdilik sadece "Başkası çizdi" mantığını kuralım:

        // Gelen String Path'i Skia Path'e çevir
        const pathObj = Skia.Path.MakeFromSVGString(incomingStroke.pathData);

        if (pathObj) {
          const newStroke: Stroke = {
            path: pathObj,
            color: incomingStroke.color,
            width: incomingStroke.width,
          };

          // State güncelle (Fonksiyonel update ile race condition'ı önle)
          setCompletedStrokes(prev => [...prev, newStroke]);
        }
      });
    };

    initSignalR();

    return () => {
      SignalRService.disconnect();
    };
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

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(g => {
      const newPath = Skia.Path.Make();
      newPath.moveTo(g.x, g.y);
      currentPath.value = newPath;
    })
    .onUpdate(g => {
      currentPath.value.lineTo(g.x, g.y);
      currentPath.modify();
    })
    .onEnd(() => {
      if (currentPath.value) {
        const pathCopy = currentPath.value.copy();
        const svgString = pathCopy.toSVGString();

        // 1. Ekrana çiz (UI Thread'de kalabilir veya JS'e geçebilir, sorun yok)
        runOnJS(setCompletedStrokes)([
          ...completedStrokes,
          { path: pathCopy, color: '#000', width: 4 },
        ]);

        // 2. Backend'e Gönder (HATA BURADAYDI, ŞİMDİ DÜZELDİ)
        // SignalRService objesini buraya sokmuyoruz.
        // Sadece string veriyi gönderiyoruz.
        runOnJS(sendStrokeToBackend)(svgString);
      }
    });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.floatingBackButton}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <GestureDetector gesture={pan}>
        <View style={styles.canvasContainer}>
          <Canvas style={styles.canvas}>
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
