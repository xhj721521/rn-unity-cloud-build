import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import { InviteSummaryCard } from '@components/invite/InviteSummaryCard';
import { InviteToolbar, InviteFilter } from '@components/invite/InviteToolbar';
import { InviteRecordItem } from '@components/invite/InviteRecordItem';
import { InviteDetailSheet, InviteSortOption } from '@components/invite/InviteDetailSheet';
import { InviteRecord, InviteStatus, MOCK_INVITES } from '@mock/invites';
import { NeonPanel } from '@components/common/NeonPanel';
import NeonButton from '@components/NeonButton';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';
import { useBottomGutter } from '@hooks/useBottomGutter';
import { translate as t } from '@locale/strings';

const INVITE_CODE = 'ABCD12';

type SheetState =
  | {
      mode: 'detail';
      record: InviteRecord;
    }
  | {
      mode: 'qr';
    }
  | { mode: 'sort' }
  | null;

const SORT_LABELS: Record<InviteSortOption, string> = {
  timeDesc: '时间 ↓',
  status: '状态',
  reward: '奖励',
};

export const InviteScreen = () => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<InviteRecord[]>([]);
  const [filter, setFilter] = useState<InviteFilter>('all');
  const [sortOption, setSortOption] = useState<InviteSortOption>('timeDesc');
  const [sheetState, setSheetState] = useState<SheetState>(null);

  const bottomGutter = useBottomGutter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setRecords(MOCK_INVITES);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const showToast = useCallback((message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(t('common.notice', '提示'), message);
    }
  }, []);

  const stats = useMemo(() => {
    const total = records.length;
    const pending = records.filter((record) => record.status === 'pending').length;
    const weekThreshold = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weekly = records.filter(
      (record) => new Date(record.datetime).getTime() >= weekThreshold,
    ).length;
    return { total, pending, weekly };
  }, [records]);

  const filtered = useMemo(() => {
    let list = records;
    if (filter !== 'all') {
      list = list.filter((record) => record.status === filter);
    }
    const sorted = [...list];
    switch (sortOption) {
      case 'status':
        sorted.sort(
          (a, b) =>
            STATUS_WEIGHT[a.status] - STATUS_WEIGHT[b.status] ||
            b.datetime.localeCompare(a.datetime),
        );
        break;
      case 'reward':
        sorted.sort((a, b) => {
          const hasRewardA = a.reward ? 1 : 0;
          const hasRewardB = b.reward ? 1 : 0;
          if (hasRewardA !== hasRewardB) {
            return hasRewardB - hasRewardA;
          }
          return b.datetime.localeCompare(a.datetime);
        });
        break;
      default:
        sorted.sort((a, b) => b.datetime.localeCompare(a.datetime));
        break;
    }
    return sorted;
  }, [records, filter, sortOption]);

  const handleCopy = () => showToast(t('invite.toast.copied', '已复制邀请码'));
  const handlePlaceholder = () => showToast(t('invite.toast.placeholder', '占位功能'));

  const handleRecordPress = (record: InviteRecord) => {
    setSheetState({ mode: 'detail', record });
  };

  const renderItem = ({ item }: ListRenderItemInfo<InviteRecord>) => (
    <InviteRecordItem record={item} onPress={handleRecordPress} />
  );

  const listHeader = (
    <>
      <InviteSummaryCard
        total={stats.total}
        weekly={stats.weekly}
        pending={stats.pending}
        inviteCode={INVITE_CODE}
        onCopy={handleCopy}
        onShowQr={() => setSheetState({ mode: 'qr' })}
        onGenerateLink={handlePlaceholder}
        onExport={handlePlaceholder}
      />
      <InviteToolbar
        filter={filter}
        onFilterChange={setFilter}
        onSearchPress={handlePlaceholder}
        onSortPress={() => setSheetState({ mode: 'sort' })}
        sortLabel={SORT_LABELS[sortOption]}
      />
      <View style={styles.progressCard}>
        <Text style={styles.progressLabel}>{t('invite.progress.nextReward', '下一奖励')}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, progressWidthStyle(stats.total)]} />
        </View>
        <Text style={styles.progressDesc}>
          {t('invite.progress.detail', '邀请满 10 人 赠盲盒券 ×1')}
        </Text>
      </View>
    </>
  );

  if (loading) {
    return <InviteSkeleton />;
  }

  return (
    <>
      <ScreenContainer variant="plain" scrollable={false}>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={<InviteEmptyState onCtaPress={handlePlaceholder} />}
          ListFooterComponent={<View style={styles.listFooter} />}
          removeClippedSubviews
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: bottomGutter.paddingBottom },
          ]}
          contentInset={bottomGutter.contentInset}
          scrollIndicatorInsets={bottomGutter.scrollIndicatorInsets}
        />
      </ScreenContainer>
      <InviteDetailSheet
        visible={!!sheetState}
        mode={sheetState?.mode ?? 'detail'}
        record={sheetState?.mode === 'detail' ? sheetState.record : undefined}
        onClose={() => setSheetState(null)}
        selectedSort={sortOption}
        onSelectSort={(value) => {
          setSortOption(value);
          setSheetState(null);
        }}
      />
    </>
  );
};

const STATUS_WEIGHT: Record<InviteStatus, number> = {
  pending: 0,
  joined: 1,
  expired: 2,
};

const InviteSkeleton = () => (
  <ScreenContainer variant="plain" scrollable>
    <SkeletonBlock height={160} />
    {Array.from({ length: 6 }).map((_, index) => (
      <SkeletonBlock key={index} height={84} />
    ))}
  </ScreenContainer>
);

const SkeletonBlock = ({ height }: { height: number }) => (
  <View style={styles.skeletonWrapper}>
    <NeonPanel padding={0}>
      <View style={[styles.skeletonInner, { height }]} />
    </NeonPanel>
  </View>
);

const InviteEmptyState = ({ onCtaPress }: { onCtaPress: () => void }) => (
  <NeonPanel style={styles.emptyCard}>
    <Text style={styles.emptyTitle}>{t('invite.empty.title', '暂无邀请记录')}</Text>
    <Text style={styles.emptyDesc}>
      {t('invite.empty.desc', '生成邀请链接，开启第一笔奖励进度。')}
    </Text>
    <NeonButton label={t('invite.createLink', '生成邀请链接')} onPress={onCtaPress} />
  </NeonPanel>
);

const progressWidthStyle = (total: number) => ({
  width: `${Math.min(1, total / 10) * 100}%`,
});

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  progressCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(7,11,23,0.7)',
  },
  progressLabel: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  progressBar: {
    height: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#00FFD1',
  },
  progressDesc: {
    ...typography.caption,
    color: palette.text,
  },
  skeletonWrapper: {
    marginBottom: 16,
  },
  skeletonInner: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  emptyCard: {
    marginTop: 32,
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  emptyDesc: {
    ...typography.body,
    color: palette.sub,
    textAlign: 'center',
  },
  listFooter: {
    height: 40,
  },
});

export default InviteScreen;
