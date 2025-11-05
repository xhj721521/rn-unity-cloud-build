import React, { useMemo } from 'react';
import Svg, { Circle, Defs, LinearGradient, Line, Path, Polygon, Stop } from 'react-native-svg';

export type QuickGlyphId =
  | 'arc'
  | 'ore'
  | 'leaderboard'
  | 'forge'
  | 'market'
  | 'event'
  | 'blindbox'
  | 'home'
  | 'explore'
  | 'trial'
  | 'chain';

type QuickGlyphProps = {
  id: QuickGlyphId;
  size?: number;
  strokeWidth?: number;
  colors?: [string, string];
};

const QuickGlyph = ({
  id,
  size = 28,
  strokeWidth = 2,
  colors = ['#FF66EA', '#58D7FF'],
}: QuickGlyphProps) => {
  const strokeId = useMemo(() => `glyph-stroke-${id}-${Math.random().toString(36).slice(2)}`, [id]);
  const fillId = useMemo(() => `glyph-fill-${id}-${Math.random().toString(36).slice(2)}`, [id]);
  const stroke = `url(#${strokeId})`;
  const fill = `url(#${fillId})`;

  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Defs>
        <LinearGradient id={strokeId} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={colors[0]} />
          <Stop offset="100%" stopColor={colors[1]} />
        </LinearGradient>
        <LinearGradient id={fillId} x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={colors[0]} stopOpacity={0.25} />
          <Stop offset="100%" stopColor={colors[1]} stopOpacity={0.15} />
        </LinearGradient>
      </Defs>
      {renderGlyph(id, stroke, fill, strokeWidth)}
    </Svg>
  );
};

const renderGlyph = (id: QuickGlyphId, stroke: string, fill: string, strokeWidth: number) => {
  const common = {
    stroke,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (id) {
    case 'arc':
      return (
        <>
          <Path d="M9 22L14 6L19 22" {...common} />
          <Line x1={11.2} y1={16} x2={16.8} y2={16} {...common} />
        </>
      );
    case 'ore':
      return (
        <>
          <Polygon points="14,4 24,14 14,24 4,14" {...common} fill="none" />
          <Line x1={14} y1={4} x2={14} y2={10} {...common} />
          <Line x1={14} y1={24} x2={10} y2={14} {...common} />
          <Line x1={18} y1={14} x2={14} y2={10} {...common} />
        </>
      );
    case 'leaderboard':
      return (
        <>
          <Path d="M6 22V14H11V22Z" {...common} fill="none" />
          <Path d="M12 22V10H17V22Z" {...common} fill="none" />
          <Path d="M18 22V17H23V22Z" {...common} fill="none" />
          <Path d="M17 5V13" {...common} />
          <Path d="M17 6L23 8L17 10Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        </>
      );
    case 'forge':
      return (
        <>
          <Path d="M7 18L18 7L21 10L10 21Z" {...common} fill="none" />
          <Line x1={18} y1={7} x2={21} y2={4} {...common} />
          <Line x1={12} y1={22} x2={15} y2={20} {...common} />
          <Line x1={9} y1={19} x2={11} y2={21} {...common} />
        </>
      );
    case 'market':
      return (
        <>
          <Path d="M6 11H22L21 22H7Z" {...common} fill="none" />
          <Path d="M6 11L9 6H19L22 11" {...common} />
          <Line x1={10} y1={15} x2={10} y2={19} {...common} />
          <Line x1={18} y1={15} x2={18} y2={19} {...common} />
        </>
      );
    case 'event':
      return (
        <>
          <Path d="M6 12H22V22H6Z" {...common} fill="none" />
          <Path d="M6 12L9 6H19L22 12" {...common} />
          <Line x1={14} y1={12} x2={14} y2={22} {...common} />
          <Line x1={10} y1={12} x2={18} y2={12} {...common} />
        </>
      );
    case 'blindbox':
      return (
        <>
          <Path d="M6 10L14 6L22 10V18L14 22L6 18Z" {...common} fill="none" />
          <Line x1={6} y1={10} x2={14} y2={14} {...common} />
          <Line x1={22} y1={10} x2={14} y2={14} {...common} />
          <Line x1={14} y1={14} x2={14} y2={22} {...common} />
        </>
      );
    case 'home':
      return (
        <>
          <Path d="M6 19V12L14 6L22 12V19" {...common} fill="none" />
          <Path d="M9 19V13H19V19" {...common} />
          <Line x1={14} y1={13} x2={14} y2={19} {...common} />
        </>
      );
    case 'explore':
      return (
        <>
          <Circle cx={14} cy={14} r={8} {...common} fill="none" />
          <Path d="M10 18L12.8 12.8L18 10L15.2 15.2Z" {...common} fill="none" />
        </>
      );
    case 'trial':
      return (
        <>
          <Path d="M7 9L21 23" {...common} />
          <Path d="M21 9L14 16" {...common} />
          <Path d="M8 22L11 19" {...common} />
        </>
      );
    case 'chain':
      return (
        <>
          <Circle cx={12} cy={12} r={6} {...common} fill="none" />
          <Line x1={16} y1={16} x2={22} y2={22} {...common} />
          <Path d="M8 12H12V8" {...common} />
        </>
      );
    default:
      return null;
  }
};

export default QuickGlyph;
