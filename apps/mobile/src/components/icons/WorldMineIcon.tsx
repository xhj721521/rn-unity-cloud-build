import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { DEFAULT_ICON_COLOR, DEFAULT_ICON_STROKE, NeonIconProps } from './types';

const WorldMineIcon = ({
  size = 24,
  color = DEFAULT_ICON_COLOR,
  strokeWidth = DEFAULT_ICON_STROKE,
}: NeonIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle
      cx="12"
      cy="12"
      r="6.5"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Path
      d="M5 12H19"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M6.5 8.5C7.5 9 9.5 9.8 12 9.8C14.5 9.8 16.5 9 17.5 8.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M6.5 15.5C7.8 14.9 9.9 14.2 12 14.2C14.1 14.2 16.2 14.9 17.5 15.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M8.5 5.5L10 4L11 6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 5L18 6.5L16.5 8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default WorldMineIcon;
