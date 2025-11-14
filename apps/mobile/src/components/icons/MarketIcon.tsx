import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { DEFAULT_ICON_COLOR, DEFAULT_ICON_STROKE, NeonIconProps } from './types';

const MarketIcon = ({
  size = 24,
  color = DEFAULT_ICON_COLOR,
  strokeWidth = DEFAULT_ICON_STROKE,
}: NeonIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 4V20"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M6 8H18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M4 8L6.8 14.4C7.1 15.1 6.55 15.9 5.8 15.9H2.2C1.45 15.9 0.9 15.1 1.2 14.4L4 8Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Path
      d="M20 8L17.2 14.4C16.9 15.1 17.45 15.9 18.2 15.9H21.8C22.55 15.9 23.1 15.1 22.8 14.4L20 8Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Circle cx="6" cy="17.5" r="1.5" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M18.5 17.5L20 20L21.5 17.5L20 15Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </Svg>
);

export default MarketIcon;
