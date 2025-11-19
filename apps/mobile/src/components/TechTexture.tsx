import React from 'react';
import Svg, { Defs, Pattern, Path, Rect } from 'react-native-svg';

const TechTexture = ({ opacity = 0.04 }: { opacity?: number }) => (
  <Svg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
    <Defs>
      <Pattern id="techGrid" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
        <Path d="M-4 20 L20 -4 M0 20 L20 0" stroke="#8BA1D6" strokeWidth={1} opacity={opacity} />
      </Pattern>
    </Defs>
    <Rect x="0" y="0" width="100%" height="100%" fill="url(#techGrid)" />
  </Svg>
);

export default TechTexture;
