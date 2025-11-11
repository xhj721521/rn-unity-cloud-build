import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';

type Props = {
  onOpenMap: () => void;
  onOpenDungeon: () => void;
  onToggleWarehouse: () => void;
  onToggleNotice: () => void;
  dungeon: { difficulty: string; left: number; max: number };
};

export const ActionGrid = ({
  onOpenMap,
  onOpenDungeon,
  onToggleWarehouse,
  onToggleNotice,
  dungeon,
}: Props) => {
  const actions = [
    { label: '团队地图', hint: '进入地图', handler: onOpenMap },
    { label: '团队副本', hint: `剩余 ${dungeon.left}/${dungeon.max}`, handler: onOpenDungeon },
    { label: '团队仓库', hint: '查看物资', handler: onToggleWarehouse },
    { label: '团队公告', hint: '查看 / 发布', handler: onToggleNotice },
  ];

  return (
    <View style={styles.grid}>
      {actions.map((action) => (
        <Pressable
          key={action.label}
          onPress={action.handler}
          style={({ pressed }) => [styles.capsule, pressed && styles.capsulePressed]}
        >
          <Text style={styles.capsuleLabel}>{action.label}</Text>
          <Text style={styles.capsuleHint}>{action.hint}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 12,
    rowGap: 12,
  },
  capsule: {
    height: 48,
    flexBasis: '48%',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  capsulePressed: {
    opacity: 0.85,
  },
  capsuleLabel: {
    ...typography.subtitle,
    color: palette.text,
  },
  capsuleHint: {
    ...typography.captionCaps,
    color: palette.sub,
  },
});

export default ActionGrid;
