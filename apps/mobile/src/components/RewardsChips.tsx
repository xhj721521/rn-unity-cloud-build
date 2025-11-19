import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { T } from '../tokens';
import { fonts } from '../typography';

type Props = {
  onPressChip?: () => void;
  labels?: string[];
};

const defaultLabels = [
  'TOP1-3 · 神秘盲盒×1 + Arc×300',
  'TOP4-10 · Arc×150 + 勋章×1',
  'TOP11-20 · Arc×80 + 礼包×1',
];

const RewardsChips: React.FC<Props> = ({ onPressChip, labels = defaultLabels }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={{ marginHorizontal: 16, marginTop: 12 }}
    contentContainerStyle={{ gap: 8 }}
  >
    {labels.map((text) => (
      <Pressable key={text} style={styles.chip} onPress={onPressChip}>
        <Text style={styles.chipText}>{text}</Text>
      </Pressable>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  chip: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: T.color.stroke,
    justifyContent: 'center',
  },
  chipText: { ...fonts.meta, color: '#CFE2FF' },
});

export default RewardsChips;
