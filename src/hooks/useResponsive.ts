import { useCallback } from 'react';
import { useWindowDimensions } from 'react-native';

export const useResponsive = () => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;

  const rs = useCallback(
    (value: number, factor: number = 0.85) => {
      if (isSmallScreen) {
        return Math.round(value * factor);
      }
      return value;
    },
    [isSmallScreen],
  );

  const iconSize = rs(32);

  return { rs, iconSize };
};
