import React, { useMemo } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { translate as t } from '@locale/strings';
import { useAccountSummary } from '@services/web3/hooks';
import { ChainAsset } from '@services/web3/types';
import { RootStackParamList, RootTabParamList } from '@app/navigation/types';

const ARC_TOKEN_ID = 'tok-energy';
const ORE_TOKEN_ID = 'tok-neon';
const USDT_TOKEN_ID = 'tok-usdt';

type AssetKey = 'arc' | 'ore' | 'usdt';

type AssetRecord = {
  id: string;
  title: string;
  time: string;
  amount: string;
  status: string;
};

const mockHistory: AssetRecord[] = [
  { id: 'h1', title: '充值 ARC', amount: '+300', status: '成功', time: '今天 12:08' },
  { id: 'h2', title: '提现 USDT', amount: '-120', status: '审核中', time: '昨天 18:35' },
  { id: 'h3', title: '矿石收益', amount: '+80', status: '已结算', time: '昨天 09:20' },
  { id: 'h4', title: '充值 ARC', amount: '+200', status: '成功', time: '前天 22:47' },
];

const formatAmount = (assets: ChainAsset[] | undefined, id: string): string => {
  const value = assets?.find((asset) => asset.id === id)?.amount;
  if (!value) {
    return '--';
  }
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return value;
  }
  return new Intl.NumberFormat('zh-CN').format(numeric);
};

type AssetCardProps = {
  type: 'ARC' | 'ORE' | 'USDT';
  title: string;
  amount: number | string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimaryPress: () => void;
  onSecondaryPress: () => void;
};

const AssetCard = ({
  type,
  title,
  amount,
  primaryLabel,
  secondaryLabel,
  onPrimaryPress,
  onSecondaryPress,
}: AssetCardProps) => (
  <View style={styles.assetCard}>
    <View style={styles.assetHeader}>
      <Text style={styles.assetTitle}>{title}</Text>
      <Text style={styles.assetAmount}>
        {typeof amount === 'number' ? amount.toLocaleString() : amount}
      </Text>
    </View>
    <View style={styles.assetActionsRow}>
      <TouchableOpacity style={styles.assetPrimaryBtn} activeOpacity={0.9} onPress={onPrimaryPress}>
        <Text style={styles.assetPrimaryText}>{primaryLabel}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.assetSecondaryBtn,
          type === 'ORE' && styles.assetSecondaryBtnForOre,
        ]}
        activeOpacity={0.9}
        onPress={onSecondaryPress}
      >
        <Text style={styles.assetSecondaryText}>{secondaryLabel}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const WithdrawInfoCard = ({ isMember }: { isMember: boolean }) => (
  <View style={styles.withdrawInfoCard}>
    <Text style={styles.withdrawInfoTitle}>提现需实名</Text>
    <Text style={styles.withdrawInfoSubtitle}>
      当前状态：{isMember ? '会员 · 已实名' : '非会员'}
    </Text>
    <Text style={styles.withdrawInfoDesc}>当日 18:00 统一结算</Text>
  </View>
);

const AssetHistoryCard = ({ records }: { records: AssetRecord[] }) => (
  <View style={styles.historyCard}>
    <Text style={styles.historyTitle}>资金记录</Text>
    <ScrollView style={styles.historyScroll} showsVerticalScrollIndicator={false}>
      {records.map((record) => (
        <View key={record.id} style={styles.historyRow}>
          <View style={styles.historyLeft}>
            <Text style={styles.historyRecordTitle}>{record.title}</Text>
            <Text style={styles.historyRecordTime}>{record.time}</Text>
          </View>
          <View style={styles.historyRight}>
            <Text style={styles.historyAmount}>{record.amount}</Text>
            <Text style={styles.historyStatus}>{record.status}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  </View>
);

export const WalletScreen = () => {
  const { data } = useAccountSummary();
  const stackNavigation = useNavigation();
  const tabNavigation = stackNavigation.getParent() as NavigationProp<RootTabParamList> | undefined;
  const rootNavigation = stackNavigation.getParent()?.getParent() as
    | NavigationProp<RootStackParamList>
    | undefined;
  const tabBarHeight = useBottomTabBarHeight?.() ?? 0;
  const tokens = useMemo(() => data?.tokens ?? [], [data?.tokens]);
  const arcAmount = useMemo(() => formatAmount(tokens, ARC_TOKEN_ID), [tokens]);
  const oreAmount = useMemo(() => formatAmount(tokens, ORE_TOKEN_ID), [tokens]);
  const usdtAmount = useMemo(() => formatAmount(tokens, USDT_TOKEN_ID), [tokens]);
  const isMember = false;

  const handleDeposit = (asset: AssetKey) => {
    Alert.alert('占位功能', `${asset.toUpperCase()} 充值`);
  };

  const handleWithdraw = (asset: AssetKey) => {
    Alert.alert('占位功能', `${asset.toUpperCase()} 提现`);
  };

  const handleOreGoToMarket = () => {
    rootNavigation?.navigate?.('FateMarket', {
      screen: 'MarketListings',
      params: { type: 'ore', side: 'sell' },
    });
  };

  const handleOreGoToForge = () => {
    tabNavigation?.navigate?.('Home', { screen: 'Forge' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: tabBarHeight ? tabBarHeight + 32 : 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>{t('wallet.title', '资产中心')}</Text>
        <AssetCard
          type="ARC"
          title="ARC"
          amount={arcAmount}
          primaryLabel="充值"
          secondaryLabel="提现"
          onPrimaryPress={() => handleDeposit('arc')}
          onSecondaryPress={() => handleWithdraw('arc')}
        />
        <AssetCard
          type="ORE"
          title="矿石"
          amount={oreAmount}
          primaryLabel="去交易"
          secondaryLabel="去铸造"
          onPrimaryPress={handleOreGoToMarket}
          onSecondaryPress={handleOreGoToForge}
        />
        <AssetCard
          type="USDT"
          title="USDT"
          amount={usdtAmount}
          primaryLabel="充值"
          secondaryLabel="提现"
          onPrimaryPress={() => handleDeposit('usdt')}
          onSecondaryPress={() => handleWithdraw('usdt')}
        />
        <WithdrawInfoCard isMember={isMember} />
        <AssetHistoryCard records={mockHistory} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617',
  },
  container: { flex: 1 },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  pageTitle: {
    color: '#F9FAFB',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  assetCard: {
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.3)',
    backgroundColor: 'rgba(5,8,18,0.86)',
    shadowColor: '#38bdf8',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  assetHeader: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(15,23,42,0.96)',
  },
  assetTitle: {
    color: 'rgba(148,163,184,0.9)',
    fontSize: 13,
  },
  assetAmount: {
    marginTop: 8,
    color: '#F9FAFB',
    fontSize: 26,
    fontWeight: '700',
  },
  assetActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  assetPrimaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#0EA5E9',
  },
  assetPrimaryText: {
    color: '#F9FAFB',
    fontSize: 15,
    fontWeight: '600',
  },
  assetSecondaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.8)',
    backgroundColor: 'rgba(15,23,42,0.9)',
  },
  assetSecondaryBtnForOre: {},
  assetSecondaryText: {
    color: '#E5E7EB',
    fontSize: 15,
    fontWeight: '500',
  },
  withdrawInfoCard: {
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(15,23,42,0.96)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
  },
  withdrawInfoTitle: {
    color: '#E5F2FF',
    fontSize: 14,
    fontWeight: '600',
  },
  withdrawInfoSubtitle: {
    marginTop: 4,
    color: 'rgba(248,250,252,0.9)',
    fontSize: 13,
  },
  withdrawInfoDesc: {
    marginTop: 2,
    color: 'rgba(148,163,184,0.9)',
    fontSize: 12,
  },
  historyCard: {
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: 'rgba(15,23,42,0.98)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.3)',
  },
  historyTitle: {
    color: '#E5F2FF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  historyScroll: {
    maxHeight: 320,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(30,64,175,0.5)',
  },
  historyLeft: { flex: 1, paddingRight: 8 },
  historyRecordTitle: {
    color: '#E5F2FF',
    fontSize: 13,
  },
  historyRecordTime: {
    marginTop: 2,
    color: 'rgba(148,163,184,0.9)',
    fontSize: 11,
  },
  historyRight: { alignItems: 'flex-end' },
  historyAmount: {
    color: '#F9FAFB',
    fontSize: 13,
    fontWeight: '600',
  },
  historyStatus: {
    marginTop: 2,
    color: 'rgba(148,163,184,0.9)',
    fontSize: 11,
  },
});

export default WalletScreen;
