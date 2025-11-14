import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { DEFAULT_ICON_COLOR, DEFAULT_ICON_STROKE, NeonIconProps } from './types';

const FateTowerIcon = ({
  size = 24,
  color = DEFAULT_ICON_COLOR,
  strokeWidth = DEFAULT_ICON_STROKE,
}: NeonIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 20H16L15 8H9L8 20Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Path
      d="M10 8V5.5C10 4.672 10.672 4 11.5 4H12.5C13.328 4 14 4.672 14 5.5V8"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Circle cx="12" cy="3" r="1" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M9.5 12H14.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M9 15H15"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M7 20H17"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export default FateTowerIcon;
