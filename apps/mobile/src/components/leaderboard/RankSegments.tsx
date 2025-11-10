import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RipplePressable from '@components/RipplePressable';
import { leaderboardTokens } from '@modules/home/leaderboardTokens';
import { typography } from '@theme/typography';

type SegmentOption<T> = {
  key: T;
  label: string;
};

type RankSegmentsProps<T extends string, P extends string> = {
  typeOptions: SegmentOption<T>[];
  periodOptions: SegmentOption<P>[];
  valueType: T;
  valuePeriod: P;
  onChangeType: (value: T) => void;
  onChangePeriod: (value: P) => void;
};

export const RankSegments = <T extends string, P extends string>({
  typeOptions,
  periodOptions,
  valueType,
  valuePeriod,
  onChangeType,
  onChangePeriod,
}: RankSegmentsProps<T, P>) => (
  <View style={styles.wrapper}>
    <View style={styles.row}>
      {typeOptions.map((option) => renderChip(option, valueType, onChangeType))}
    </View>
    <View style={styles.row}>
      {periodOptions.map((option) => renderChip(option, valuePeriod, onChangePeriod))}
    </View>
  </View>
);

const renderChip = <T extends string>(
  option: SegmentOption<T>,
  value: T,
  onChange: (value: T) => void,
) => {
  const active = option.key === value;
  return (
    <RipplePressable
      key={option.key}
      style={[styles.chip, active && styles.chipActive]}
      onPress={() => onChange(option.key)}
    >
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{option.label}</Text>
    </RipplePressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: leaderboardTokens.paddingPage,
    gap: 6,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(6,8,18,0.4)',
  },
  chipActive: {
    backgroundColor: leaderboardTokens.colorBgSegOn,
    shadowColor: leaderboardTokens.colorBgSegOn,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
  },
  chipLabel: {
    ...typography.captionCaps,
    color: leaderboardTokens.colorTextSub,
  },
  chipLabelActive: {
    color: leaderboardTokens.colorTextMain,
    fontWeight: '700',
  },
});
