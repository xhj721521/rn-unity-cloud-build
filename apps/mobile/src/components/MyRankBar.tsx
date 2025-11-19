import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { T } from '../tokens';
import { fonts } from '../typography';

type Props = {
  rank?: number;
  score?: number;
  diff?: number;
  title?: string;
  diffLabel?: string;
  guideLabel?: string;
  onPressGuide?: () => void;
};

const MyRankBar: React.FC<Props> = ({
  rank,
  score,
  diff,
  title = '我的排名',
  diffLabel,
  guideLabel = '攻略',
  onPressGuide,
}) => (
  <LinearGradient
    colors={['#4DA3FF', '#173056']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.container}
  >
    <View style={{ flex: 1 }}>
      <Text style={styles.label}>{title}</Text>
      <Text style={styles.value}>
        {rank ? `NO.${String(rank).padStart(2, '0')} · ${score ?? 0} 分` : '暂未上榜'}
      </Text>
      {diff && diffLabel ? <Text style={styles.meta}>{diffLabel}</Text> : null}
    </View>
    <Pressable onPress={onPressGuide} style={styles.linkBtn}>
      <Text style={styles.link}>{guideLabel}</Text>
    </Pressable>
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: {
    height: 56,
    marginHorizontal: 16,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: { ...fonts.meta, color: T.color.textSec },
  value: { ...fonts.body, fontSize: 16, fontWeight: '700', marginTop: 4 },
  meta: { ...fonts.meta, marginTop: 4 },
  linkBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  link: { ...fonts.meta, color: T.color.textPri },
});

export default MyRankBar;
