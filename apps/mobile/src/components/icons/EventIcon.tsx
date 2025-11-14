import React from 'react';
import Svg, { Path, Line, Circle } from 'react-native-svg';
import { DEFAULT_ICON_COLOR, DEFAULT_ICON_STROKE, NeonIconProps } from './types';

const EventIcon = ({
  size = 24,
  color = DEFAULT_ICON_COLOR,
  strokeWidth = DEFAULT_ICON_STROKE,
}: NeonIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 9H19V18C19 19.105 18.105 20 17 20H7C5.895 20 5 19.105 5 18V9Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Path
      d="M4 9H20"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M12 4C9 5 9.5 7 9.5 7H7C6.448 7 6 7.448 6 8V9H18V8C18 7.448 17.552 7 17 7H14.5C14.5 7 15 5 12 4Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Line
      x1="12"
      y1="9"
      x2="12"
      y2="20"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Circle cx="7.5" cy="4.5" r="1" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="16.5" cy="3.5" r="1" stroke={color} strokeWidth={strokeWidth} />
    <Line
      x1="5"
      y1="5"
      x2="4"
      y2="4"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Line
      x1="19"
      y1="5"
      x2="20"
      y2="4"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export default EventIcon;
