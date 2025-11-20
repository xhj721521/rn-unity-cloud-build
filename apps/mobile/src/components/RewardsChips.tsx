import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import typography from '@theme/typography';

const fonts = {
  title: typography.captionCaps,
  body: typography.body,
};

type RewardCard = {
  title: string;
  tier?: string;
  detail?: string;
  raw: string;
};

type Props = {
  onPressCard?: (label: string) => void;
  labels?: string[];
};

const defaultLabels = [
  '命运巅峰 · TOP1-3 · 神秘盲盒×1 + Arc×300',
  '命运荣光 · TOP4-10 · Arc×150 + 勋章×1',
  '命运鼓励 · TOP11-20 · Arc×80 + 礼包×1',
];

const parseReward = (text: string): RewardCard => {
  const segments = text
    .split('·')
    .map((seg) => seg.trim())
    .filter(Boolean);
  const [title, tier, ...rest] = segments;
  return {
    title: title ?? text,
    tier,
    detail: rest.length ? rest.join(' · ') : undefined,
    raw: text,
  };
};

const RewardsChips: React.FC<Props> = ({ onPressCard, labels = defaultLabels }) => {
  const items = labels.map(parseReward);
  return (
    <View style={styles.wrapper}>
      {items.map((item) => (
        <Pressable key={item.raw} style={styles.card} onPress={() => onPressCard?.(item.raw)}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {item.tier ? <Text style={styles.cardTier}>{item.tier}</Text> : null}
          {item.detail ? <Text style={styles.cardDetail}>{item.detail}</Text> : null}
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginTop: 12,
    gap: 10,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(77,163,255,0.35)',
    backgroundColor: 'rgba(10,18,38,0.9)',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 6,
  },
  cardTitle: {
    ...fonts.title,
    color: '#E5F2FF',
    fontSize: 13,
    letterSpacing: 0.4,
  },
  cardTier: {
    ...fonts.body,
    fontWeight: '700',
    color: '#96BEFF',
  },
  cardDetail: {
    ...fonts.body,
    fontSize: 13,
    color: 'rgba(229,242,255,0.72)',
  },
});

export default RewardsChips;
