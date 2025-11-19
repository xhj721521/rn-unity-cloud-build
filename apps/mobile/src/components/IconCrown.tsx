import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

const IconCrown: React.FC<Props> = ({ size = 16, color = '#FFD66B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M5 10.5 8.5 13l3.5-6 3.5 6 3.5-2.5V17H5zM4 19h16l-1 3H5z"
    />
  </Svg>
);

export default IconCrown;
