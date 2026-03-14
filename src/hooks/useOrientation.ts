import { useWindowDimensions } from 'react-native';

export const useOrientation = () => {
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;

  return {
    isLandscape,
    isPortrait: !isLandscape,
    width,
    height,
    orientation: isLandscape ? 'LANDSCAPE' : 'PORTRAIT',
  };
};
