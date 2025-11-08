import { Platform, TextStyle } from 'react-native';

const futuristicLatin = Platform.select({
  ios: 'Futura',
  android: 'sans-serif-medium',
  default: 'System',
});

const readableChinese = Platform.select({
  ios: 'PingFang SC',
  android: 'Noto Sans CJK SC',
  default: 'System',
});

const numericFace = Platform.select({
  ios: 'Menlo',
  android: 'sans-serif-medium',
  default: 'System',
});

const base: TextStyle = {
  fontFamily: futuristicLatin,
  color: '#E6EBFF',
};

export const typography = {
  heading: {
    ...base,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700' as const,
    letterSpacing: 0.6,
    textShadowColor: 'rgba(130, 210, 255, 0.65)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  subtitle: {
    ...base,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
    color: '#B9C7FF',
    textShadowColor: 'transparent',
  },
  body: {
    fontFamily: readableChinese,
    fontSize: 14,
    lineHeight: 20,
    color: '#C9D2FF',
    fontWeight: '500' as const,
  },
  micro: {
    fontFamily: readableChinese,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.4,
  },
  numeric: {
    fontFamily: numericFace,
    fontVariant: ['tabular-nums'],
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600' as const,
    letterSpacing: 0.4,
  },
  captionCaps: {
    fontFamily: readableChinese,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.8,
  },
};

export default typography;
