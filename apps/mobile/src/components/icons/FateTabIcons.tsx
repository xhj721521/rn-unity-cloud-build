import React from 'react';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

const strokeFor = (focused: boolean) => (focused ? '#33F5FF' : 'rgba(255,255,255,0.55)');

type TabIconProps = { focused: boolean };

export const FateHomeIcon = ({ focused }: TabIconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <G
      stroke={strokeFor(focused)}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M7 18V11L12 6L17 11V18H7Z" />
      <Circle cx={12} cy={13.5} r={0.9} />
    </G>
  </Svg>
);

export const FateExploreIcon = ({ focused }: TabIconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <G
      stroke={strokeFor(focused)}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Circle cx={12} cy={12} r={4} />
      <Path d="M5 11C7.5 9.5 9.8 9 12 9c2.2 0 4 .4 7 1.4" />
      <Path d="M5.5 14.5C7.4 13.7 9 13.3 11.2 13.2c2.1-.1 3.7.2 5.8 1" />
    </G>
  </Svg>
);

export const FateTrialsIcon = ({ focused }: TabIconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <G
      stroke={strokeFor(focused)}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M7 5l4 4" />
      <Path d="M6 9.5l3-1 1 1-1 3" />
      <Path d="M6.5 15.5L8.5 17.5" />
      <Path d="M17 5l-4 4" />
      <Path d="M18 9.5l-3-1-1 1 1 3" />
      <Path d="M17.5 15.5L15.5 17.5" />
    </G>
  </Svg>
);

export const FateMarketIcon = ({ focused }: TabIconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <G
      stroke={strokeFor(focused)}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M5 9h14l-1.2 8.2c-.2 1.4-1.4 2.5-2.8 2.5H9c-1.4 0-2.6-1.1-2.8-2.5L5 9Z" />
      <Rect x={7.5} y={5} width={9} height={4} rx={1.5} />
      <Path d="M10 12v4" />
      <Path d="M14 12v4" />
    </G>
  </Svg>
);

export const FateProfileIcon = ({ focused }: TabIconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <G
      stroke={strokeFor(focused)}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Circle cx={12} cy={9} r={3} />
      <Path d="M6.5 18c1.3-2 3-3 5.5-3s4.2 1 5.5 3" />
    </G>
  </Svg>
);