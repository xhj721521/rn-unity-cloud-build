import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import typography from '@theme/typography';

const fonts = {
  body: typography.body,
  meta: typography.captionCaps,
};

type Props = {
  rank?: number;
  score?: number;
  diff?: number;
  title?: string;
  diffLabel?: string;
  guideLabel?: string;
  onPressGuide?: () => void;
  style?: ViewStyle;
};

const MyRankBar: React.FC<Props> = ({
  rank,
  score,
  diff,
  title = '我的排名',
  diffLabel,
  guideLabel = '攻略',
  onPressGuide,
  style,
}) => (
  <View style={[styles.container, style]}>
    <View style={styles.left}>
      <Text style={styles.label}>{title}</Text>
      <Text style={styles.value}>
        {rank ? `NO.${String(rank).padStart(2, '0')} · ${score ?? 0} 分` : '暂未上榜'}
      </Text>
      {diff && diffLabel ? <Text style={styles.meta}>{diffLabel}</Text> : null}
    </View>
    <View style={styles.right}>
      <Pressable onPress={onPressGuide} style={styles.linkBtn}>
        <Text style={styles.link}>{guideLabel}</Text>
      </Pressable>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(77,163,255,0.4)',
    backgroundColor: 'rgba(7,11,24,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  left: {
    flex: 1,
  },
  label: { ...fonts.meta, color: 'rgba(159,177,209,1)' },
  value: { ...fonts.body, fontSize: 16, fontWeight: '700', marginTop: 4 },
  meta: { ...fonts.meta, marginTop: 4 },
  linkBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(77,163,255,0.45)',
    backgroundColor: 'rgba(34,54,88,0.8)',
  },
  link: { ...fonts.meta, color: '#EAF2FF' },
  right: {
    alignItems: 'flex-end',
  },
});

export default MyRankBar;
