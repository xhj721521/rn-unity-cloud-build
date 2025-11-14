import React from 'react';
import Svg, { Path, Polyline } from 'react-native-svg';
import { DEFAULT_ICON_COLOR, DEFAULT_ICON_STROKE, NeonIconProps } from './types';

const RankingIcon = ({
  size = 24,
  color = DEFAULT_ICON_COLOR,
  strokeWidth = DEFAULT_ICON_STROKE,
}: NeonIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 17.5V9.2C7 8.537 7.537 8 8.2 8H9.8C10.463 8 11 8.537 11 9.2V17.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 17.5V12.2C3 11.537 3.537 11 4.2 11H5.8C6.463 11 7 11.537 7 12.2V17.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11 17.5V6.2C11 5.537 11.537 5 12.2 5H13.8C14.463 5 15 5.537 15 6.2V17.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15 17.5V8.2C15 7.537 15.537 7 16.2 7H17.8C18.463 7 19 7.537 19 8.2V17.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Polyline
      points="3.5,5.5 6,3 8.5,5.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Polyline
      points="13.5,3.5 16,1 18.5,3.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default RankingIcon;
