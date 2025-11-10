import React, { useMemo } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import NeonCard from '@components/NeonCard';
import OutlineCTA from '@components/shared/OutlineCTA';
import StatPill from '@components/shared/StatPill';
import { translate as t } from '@locale/strings';
import { useAccountSummary } from '@services/web3/hooks';
import { palette } from '@theme/colors';
import { spacing, shape } from '@theme/tokens';
import { typography } from '@theme/typography';

const ARC_TOKEN_ID = 'tok-energy';
const ORE_TOKEN_ID = 'tok-neon';
const USDT_TOKEN_ID = 'tok-usdt';

type AssetKey = 'arc' | 'ore' | 'usdt';
type ActionType = 'topup' | 'withdraw';

const formatAmount = (value?: string) => {
  if (!value) {
    return '--';
  }
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return value;
  }
  return new Intl.NumberFormat('zh-CN').format(numeric);
};

const mockHistory = [
  { id: 'h1', title: '充值 ARC', amount: '+300', status: '成功', time: '今天 12:08' },
  { id: 'h2', title: '提现 USDT', amount: '-120', status: '审核中', time: '昨天 18:35' },
  { id: 'h3', title: '矿石收益', amount: '+80', status: '已结算', time: '昨天 09:20' },
];

export const WalletScreen = () => {
  const { data } = useAccountSummary();

  const tokens = useMemo(() => data?.tokens ?? [], [data?.tokens]);
  const arcAmount = useMemo(
    () => formatAmount(tokens.find((asset) => asset.id === ARC_TOKEN_ID)?.amount),
    [tokens],
  );
  const oreAmount = useMemo(
    () => formatAmount(tokens.find((asset) => asset.id === ORE_TOKEN_ID)?.amount),
    [tokens],
  );
  const usdtAmount = useMemo(
    () => formatAmount(tokens.find((asset) => asset.id === USDT_TOKEN_ID)?.amount),
    [tokens],
  );

  const assets = [
    { key: 'arc', label: 'ARC', value: arcAmount, deposit: true, withdraw: true },
    { key: 'ore', label: '矿石', value: oreAmount, deposit: false, withdraw: false },
    { key: 'usdt', label: 'USDT', value: usdtAmount, deposit: true, withdraw: true },
  ] as const;

  const handleAction = (asset: AssetKey, action: ActionType) => {
    if (asset === 'ore') {
      Alert.alert('提示', '矿石暂不支持充值/提现');
      return;
    }
    Alert.alert('占位功能', `${asset.toUpperCase()} ${action === 'topup' ? '充值' : '提现'}`);
  };

  return (
    <ScreenContainer variant="plain" edgeVignette scrollable>
      <Text style={styles.title}>{t('wallet.title', '资产中心')}</Text>
      <View style={styles.statRow}>
        {assets.map((asset) => (
          <NeonCard
            key={asset.key}
            overlayColor="rgba(8,10,22,0.7)"
            contentPadding={18}
            borderRadius={20}
            style={styles.statCard}
          >
            <StatPill label={asset.label} value={asset.value} />
            <View style={styles.actionRow}>
              <OutlineCTA
                label="充值"
                onPress={() => handleAction(asset.key, 'topup')}
                disabled={!asset.deposit}
                style={styles.actionButton}
              />
              <OutlineCTA
                label="提现"
                onPress={() => handleAction(asset.key, 'withdraw')}
                disabled={!asset.withdraw}
                style={styles.actionButton}
              />
            </View>
          </NeonCard>
        ))}
      </View>

      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>{t('wallet.notice', { status: t('member.non') })}</Text>
        <Text style={styles.noticeBody}>{t('wallet.settle')}</Text>
      </View>

      <NeonCard
        overlayColor="rgba(8,10,22,0.7)"
        contentPadding={20}
        borderRadius={shape.cardRadius}
        style={styles.historyCard}
      >
        <Text style={styles.historyTitle}>{t('wallet.history', '资金记录')}</Text>
        {mockHistory.map((item) => (
          <View key={item.id} style={styles.historyRow}>
            <View>
              <Text style={styles.historyItemTitle}>{item.title}</Text>
              <Text style={styles.historyMeta}>{item.time}</Text>
            </View>
            <View style={styles.historyMetaColumn}>
              <Text style={styles.historyAmount}>{item.amount}</Text>
              <Text style={styles.historyStatus}>{item.status}</Text>
            </View>
          </View>
        ))}
      </NeonCard>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.heading,
    marginBottom: spacing.section,
  },
  statRow: {
    flexDirection: 'column',
    gap: spacing.cardGap,
  },
  statCard: {
    gap: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  noticeCard: {
    marginTop: spacing.section,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(5,8,18,0.8)',
    padding: 16,
    gap: 6,
  },
  noticeTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  noticeBody: {
    ...typography.body,
    color: palette.sub,
  },
  historyCard: {
    marginTop: spacing.section,
    gap: 12,
  },
  historyTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  historyItemTitle: {
    ...typography.body,
    color: palette.text,
  },
  historyMeta: {
    ...typography.caption,
    color: palette.sub,
    marginTop: 4,
  },
  historyMetaColumn: {
    alignItems: 'flex-end',
  },
  historyAmount: {
    ...typography.subtitle,
    color: palette.text,
  },
  historyStatus: {
    ...typography.captionCaps,
    color: palette.sub,
    marginTop: 4,
  },
});

export default WalletScreen;
