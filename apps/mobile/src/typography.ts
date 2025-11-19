import { Platform, TextStyle } from 'react-native';

const baseFamily = Platform.select({ ios: 'PingFang SC', android: 'sans-serif-medium', default: 'System' });

export const fonts = {
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EAF2FF',
    fontFamily: baseFamily,
  } as TextStyle,
  body: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EAF2FF',
    fontFamily: baseFamily,
  } as TextStyle,
  meta: {
    fontSize: 12,
    fontWeight: '400',
    color: '#7E8AA6',
    fontFamily: baseFamily,
  } as TextStyle,
  number: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EAF2FF',
    letterSpacing: 0.2,
    includeFontPadding: false,
    fontVariant: Platform.OS === 'ios' ? (['tabular-nums'] as any) : undefined,
  } as TextStyle,
};

export const neonTitle = {
  textShadowColor: 'rgba(77,163,255,0.35)',
  textShadowRadius: 8,
};
