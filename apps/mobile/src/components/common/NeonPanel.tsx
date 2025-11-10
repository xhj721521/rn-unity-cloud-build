import React, { PropsWithChildren } from 'react';
import { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import NeonCard from '@components/NeonCard';

type NeonPanelProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  padding?: number;
  overlayColor?: string;
  backgroundSource?: ImageSourcePropType;
  glowColor?: string;
  borderColors?: [string, string];
  innerBorderColors?: [string, string];
}>;

export const NeonPanel = ({
  children,
  style,
  borderRadius = 24,
  padding = 20,
  overlayColor = 'rgba(6,10,28,0.78)',
  backgroundSource,
  glowColor = '#7BD7FF',
  borderColors = ['#00FFD1', '#7DB1FF'],
  innerBorderColors = ['#5CF4FF2E', '#C08BFF2E'],
}: NeonPanelProps) => {
  return (
    <NeonCard
      style={style}
      borderRadius={borderRadius}
      contentPadding={padding}
      overlayColor={overlayColor}
      borderColors={borderColors}
      innerBorderColors={innerBorderColors}
      glowColor={glowColor}
      backgroundSource={backgroundSource}
    >
      {children}
    </NeonCard>
  );
};

export default NeonPanel;
