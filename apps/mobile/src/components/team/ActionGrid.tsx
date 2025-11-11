import React from 'react';
import { StyleSheet, View } from 'react-native';
import ActionCard from './ActionCard';

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
}: Props) => (
  <View style={styles.grid}>
    <ActionCard title="团队地图" subtitle="今日可开 3/3" glyph="map" onPress={onOpenMap} />
    <ActionCard
      title="副本任务"
      subtitle={`难度 ${dungeon.difficulty} · 剩余 ${dungeon.left}/${dungeon.max}`}
      glyph="blindbox"
      onPress={onOpenDungeon}
    />
    <ActionCard title="团队仓库" subtitle="物资一览" glyph="storage" onPress={onToggleWarehouse} />
    <ActionCard title="团队公告" subtitle="查看 / 编辑" glyph="reports" onPress={onToggleNotice} />
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 10,
    rowGap: 10,
  },
});

export default ActionGrid;
