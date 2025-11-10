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
  | 'chain'
  | 'miner'
  | 'nft'
  | 'map'
  | 'shard'
  | 'team'
  | 'storage'
  | 'invite'
  | 'member'
  | 'reports'
  | 'highlights'
  | 'lock'
  | 'globe'
  | 'network'
  | 'settings'
  | 'bell'
  | 'theme'
  | 'link'
  | 'logout';

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
    case 'miner':
      return (
        <>
          <Path d="M6 20L12 14" {...common} />
          <Path d="M12 14L18 8" {...common} />
          <Line x1={18} y1={8} x2={22} y2={12} {...common} />
          <Line x1={12} y1={14} x2={16} y2={18} {...common} />
          <Circle cx={9} cy={21} r={2} {...common} />
        </>
      );
    case 'nft':
      return (
        <>
          <Polygon points="14,5 22,11 22,19 14,25 6,19 6,11" {...common} fill="none" />
          <Line x1={14} y1={5} x2={14} y2={25} {...common} />
          <Line x1={6} y1={11} x2={22} y2={19} {...common} />
        </>
      );
    case 'map':
      return (
        <>
          <Path d="M7 9L13 5L19 9L25 5V19L19 23L13 19L7 23Z" {...common} fill="none" />
          <Line x1={13} y1={5} x2={13} y2={19} {...common} />
          <Line x1={19} y1={9} x2={19} y2={23} {...common} />
          <Line x1={7} y1={9} x2={7} y2={23} {...common} />
        </>
      );
    case 'shard':
      return (
        <>
          <Polygon points="14,4 22,14 14,24 6,14" {...common} fill="none" />
          <Line x1={14} y1={4} x2={14} y2={24} {...common} />
          <Line x1={6} y1={14} x2={22} y2={14} {...common} />
        </>
      );
    case 'team':
      return (
        <>
          <Circle cx={10} cy={11} r={3} {...common} fill="none" />
          <Circle cx={18} cy={11} r={3} {...common} fill="none" />
          <Path d="M6 23C6 19 9 17 14 17C19 17 22 19 22 23" {...common} />
        </>
      );
    case 'storage':
      return (
        <>
          <Path d="M6 11L14 6L22 11V19L14 24L6 19Z" {...common} fill="none" />
          <Line x1={6} y1={11} x2={14} y2={16} {...common} />
          <Line x1={22} y1={11} x2={14} y2={16} {...common} />
          <Line x1={14} y1={16} x2={14} y2={24} {...common} />
        </>
      );
    case 'invite':
      return (
        <>
          <Path d="M6 18V10L14 6L22 10V18L14 22Z" {...common} fill="none" />
          <Line x1={10} y1={14} x2={18} y2={14} {...common} />
          <Line x1={14} y1={10} x2={14} y2={18} {...common} />
        </>
      );
    case 'member':
      return (
        <>
          <Path d="M14 5L20 9V17L14 23L8 17V9Z" {...common} fill="none" />
          <Path d="M10 11H18L17 15L14 17L11 15Z" {...common} />
          <Path d="M14 5V2" {...common} />
        </>
      );
    case 'reports':
      return (
        <>
          <Path d="M9 5H19L23 9V23H9Z" {...common} fill="none" />
          <Line x1={9} y1={11} x2={19} y2={11} {...common} />
          <Line x1={9} y1={15} x2={21} y2={15} {...common} />
          <Line x1={9} y1={19} x2={19} y2={19} {...common} />
        </>
      );
    case 'highlights':
      return (
        <>
          <Path
            d="M14 4L16.5 10.5L23.5 11L18 15.5L19.5 22.5L14 18.5L8.5 22.5L10 15.5L4.5 11L11.5 10.5Z"
            {...common}
            fill="none"
          />
        </>
      );
    case 'lock':
      return (
        <>
          <Path d="M7 13H21V22H7Z" {...common} fill="none" />
          <Path d="M10 13V10C10 7.8 11.8 6 14 6C16.2 6 18 7.8 18 10V13" {...common} fill="none" />
          <Circle cx={14} cy={17} r={1.5} {...common} />
          <Line x1={14} y1={18.5} x2={14} y2={21} {...common} />
        </>
      );
    case 'globe':
      return (
        <>
          <Circle cx={14} cy={14} r={9} {...common} fill="none" />
          <Path d="M14 5C11 9 11 19 14 23C17 19 17 9 14 5Z" {...common} fill="none" />
          <Line x1={5} y1={14} x2={23} y2={14} {...common} />
        </>
      );
    case 'network':
      return (
        <>
          <Path d="M5 16C7.5 13.5 10.6 12 14 12C17.4 12 20.5 13.5 23 16" {...common} />
          <Path d="M8 19C9.5 17.8 11.7 17 14 17C16.3 17 18.5 17.8 20 19" {...common} />
          <Circle cx={14} cy={22} r={1.5} {...common} />
        </>
      );
    case 'settings':
      return (
        <>
          <Circle cx={14} cy={14} r={4} {...common} fill="none" />
          <Path d="M14 6V8" {...common} />
          <Path d="M14 20V22" {...common} />
          <Path d="M6 14H8" {...common} />
          <Path d="M20 14H22" {...common} />
          <Path d="M8.5 8.5L9.9 9.9" {...common} />
          <Path d="M18.1 18.1L19.5 19.5" {...common} />
          <Path d="M8.5 19.5L9.9 18.1" {...common} />
          <Path d="M18.1 9.9L19.5 8.5" {...common} />
        </>
      );
    case 'bell':
      return (
        <>
          <Path d="M11 6C11 4.895 11.895 4 13 4C14.105 4 15 4.895 15 6" {...common} />
          <Path d="M8 11C8 8.24 10.24 6 13 6C15.76 6 18 8.24 18 11V17H8Z" {...common} fill="none" />
          <Path d="M10 17C10 19 11 21 13 21C15 21 16 19 16 17" {...common} />
        </>
      );
    case 'theme':
      return (
        <>
          <Circle cx={14} cy={14} r={6} {...common} fill="none" />
          <Path d="M14 4V7" {...common} />
          <Path d="M14 21V24" {...common} />
          <Path d="M4 14H7" {...common} />
          <Path d="M21 14H24" {...common} />
          <Path d="M6.5 6.5L8.5 8.5" {...common} />
          <Path d="M19.5 19.5L21.5 21.5" {...common} />
          <Path d="M21.5 6.5L19.5 8.5" {...common} />
          <Path d="M8.5 19.5L6.5 21.5" {...common} />
        </>
      );
    case 'link':
      return (
        <>
          <Path d="M10 18L6 22C4 24 4 26 6 28C8 30 10 30 12 28L16 24" {...common} />
          <Path d="M18 10L22 6C24 4 26 4 28 6C30 8 30 10 28 12L24 16" {...common} />
          <Path d="M11 21L21 11" {...common} />
        </>
      );
    case 'logout':
      return (
        <>
          <Path d="M10 6H6V22H10" {...common} />
          <Path d="M14 14H25" {...common} />
          <Path d="M20 9L25 14L20 19" {...common} />
        </>
      );
    default:
      return null;
  }
};

export default QuickGlyph;
