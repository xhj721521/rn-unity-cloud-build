import React from 'react';
import Svg, { Path, Polygon, Ellipse } from 'react-native-svg';
import { DEFAULT_ICON_COLOR, DEFAULT_ICON_STROKE, NeonIconProps } from './types';

const BlindboxIcon = ({
  size = 40,
  color = DEFAULT_ICON_COLOR,
  strokeWidth = DEFAULT_ICON_STROKE,
}: NeonIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <Polygon
      points="20,4 32,10 32,22 20,28 8,22 8,10"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Path
      d="M20 4V16"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M8 10L20 16L32 10"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Path
      d="M12 21.5L20 26L28 21.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Ellipse
      cx="20"
      cy="32.5"
      rx="10"
      ry="2.5"
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </Svg>
);

export default BlindboxIcon;
