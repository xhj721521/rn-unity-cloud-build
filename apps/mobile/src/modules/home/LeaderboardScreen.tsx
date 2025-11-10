import React, { useMemo, useRef, useState } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import { translate as t } from '@locale/strings';
import { useAppSelector } from '@state/hooks';
import {
  LeaderboardCategory,
  LeaderboardEntry,
  LeaderboardPeriod,
} from '@state/leaderboard/leaderboardSlice';
import { HeroCard } from '@components/leaderboard/HeroCard';
import { RankSegments } from '@components/leaderboard/RankSegments';
import { TopThree } from '@components/leaderboard/TopThree';
import { RankGrid } from '@components/leaderboard/RankGrid';
import { RankRow } from '@components/leaderboard/RankRow';
import { SeasonRewards } from '@components/leaderboard/SeasonRewards';
import { useBottomGutter } from '@hooks/useBottomGutter';

type ListItem =
  | { type: 'hero' }
  | { type: 'segments' }
  | { type: 'top' }
  | { type: 'grid' }
  | { type: 'row'; entry: LeaderboardEntry }
  | { type: 'rewards' };

const TYPE_OPTIONS: Array<{ key: LeaderboardCategory; label: string }> = [
  { key: 'inviter', label: t('lb.invite', undefined, '邀请达人') },
  { key: 'team', label: t('lb.team', undefined, '团队排行') },
  { key: 'wealth', label: t('lb.wealth', undefined, '财富榜') },
];

const PERIOD_OPTIONS: Array<{ key: LeaderboardPeriod; label: string }> = [
  { key: 'daily', label: t('lb.daily', undefined, '日榜') },
  { key: 'weekly', label: t('lb.weekly', undefined, '周榜') },
  { key: 'monthly', label: t('lb.monthly', undefined, '月榜') },
];

export const LeaderboardScreen = () => {
  const [category, setCategory] = useState<LeaderboardCategory>('inviter');
  const [period, setPeriod] = useState<LeaderboardPeriod>('daily');
  const listRef = useRef<FlatList<ListItem>>(null);

  const leaderboard = useAppSelector((state) => state.leaderboard.data);
  const rewards = useAppSelector((state) => state.leaderboard.rewards);
  const { entries, myRank } = leaderboard[category][period];

  const GRID_ROWS = 5;
  const GRID_COUNT = GRID_ROWS * 3;

  const topThree = entries.filter((entry) => entry.rank <= 3);
  const gridEntries = entries.filter((entry) => entry.rank > 3 && entry.rank <= 3 + GRID_COUNT);
  const listEntries = entries.filter((entry) => entry.rank > 3 + GRID_COUNT);

  const listData = useMemo<ListItem[]>(() => {
    const base: ListItem[] = [{ type: 'hero' }, { type: 'segments' }, { type: 'top' }];
    if (gridEntries.length) {
      base.push({ type: 'grid' });
    }
    listEntries.forEach((entry) => base.push({ type: 'row', entry }));
    base.push({ type: 'rewards' });
    return base;
  }, [gridEntries.length, listEntries]);

  const bottomGutter = useBottomGutter();

  const handleBackToMine = () => {
    if (!myRank) {
      return;
    }
    if (myRank.rank <= 3 + GRID_COUNT) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
      return;
    }
    const targetIndex = listData.findIndex(
      (item) => item.type === 'row' && item.entry.userId === myRank.userId,
    );
    if (targetIndex >= 0) {
      listRef.current?.scrollToIndex({ index: targetIndex, animated: true, viewPosition: 0.3 });
    }
  };

  const renderItem = ({ item }: ListRenderItemInfo<ListItem>) => {
    switch (item.type) {
      case 'hero':
        return <HeroCard topEntry={topThree[0]} myRank={myRank} onBackToMine={handleBackToMine} />;
      case 'segments':
        return (
          <RankSegments
            typeOptions={TYPE_OPTIONS}
            periodOptions={PERIOD_OPTIONS}
            valueType={category}
            valuePeriod={period}
            onChangeType={setCategory}
            onChangePeriod={setPeriod}
          />
        );
      case 'top':
        return <TopThree entries={topThree} />;
      case 'grid':
        return <RankGrid entries={gridEntries} />;
      case 'row':
        return <RankRow entry={item.entry} highlight={item.entry.userId === myRank?.userId} />;
      case 'rewards':
        return (
          <SeasonRewards
            rewards={[
              {
                key: 'top',
                title: t('rank.rewards.top', undefined, '巅峰荣耀'),
                body: rewards[category].top1To3,
                claimable: true,
              },
              {
                key: 'pro',
                title: t('rank.rewards.pro', undefined, '进阶嘉奖'),
                body: rewards[category].top4To10,
              },
              {
                key: 'keep',
                title: t('rank.rewards.keep', undefined, '持续激励'),
                body: rewards[category].top11To20,
              },
            ]}
          />
        );
      default:
        return null;
    }
  };

  const keyExtractor = (item: ListItem, index: number) =>
    item.type === 'row' ? `row-${item.entry.userId}` : `${item.type}-${index}`;

  const listPadding = {
    paddingBottom: bottomGutter.paddingBottom,
  };

  return (
    <ScreenContainer variant="plain" edgeVignette scrollable={false}>
      <FlatList
        ref={listRef}
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        stickyHeaderIndices={[0]}
        contentContainerStyle={[styles.listContent, listPadding]}
        contentInset={bottomGutter.contentInset}
        scrollIndicatorInsets={bottomGutter.scrollIndicatorInsets}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 16,
  },
});
