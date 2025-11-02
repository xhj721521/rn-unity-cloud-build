import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import { InfoCard } from '@components/InfoCard';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';
import { ErrorState } from '@components/ErrorState';
import { useAccountSummary } from '@services/web3/hooks';

export const OnChainDataScreen = () => {
  const { data, loading, error } = useAccountSummary();

  return (
    <ScreenContainer scrollable>
      <Text style={styles.heading}>链鉴中心</Text>
      <Text style={styles.subHeading}>
        汇总链上身份、资产凭证与世界事件。
      </Text>

      {loading ? (
        <LoadingPlaceholder label="同步链上账本中..." />
      ) : error ? (
        <ErrorState title="链上数据暂不可用" description={error} />
      ) : data ? (
        <InfoCard title="资产概览">
          <View style={styles.row}>
            <Text style={styles.label}>地址</Text>
            <Text style={styles.value}>{data.address}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>代币种类</Text>
            <Text style={styles.value}>{data.tokens.length}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>NFT 数量</Text>
            <Text style={styles.value}>{data.nfts.length}</Text>
          </View>
        </InfoCard>
      ) : (
        <LoadingPlaceholder label="暂无链上响应" />
      )}

      <InfoCard title="开发中" subtitle="后续将接入">
        <Text style={styles.todoText}>
          · 实时交易追踪与安全预警
        </Text>
        <Text style={styles.todoText}>
          · 链游排行榜与赛季信息
        </Text>
        <Text style={styles.todoText}>
          · NFT 管理（上架 / 转移 / 合成）
        </Text>
      </InfoCard>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: '#F6F8FF',
    fontSize: 24,
    fontWeight: '700',
  },
  subHeading: {
    color: '#8D92A3',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  label: {
    color: '#B7B9C7',
    fontSize: 13,
  },
  value: {
    color: '#F6F8FF',
    fontSize: 14,
    fontWeight: '600',
  },
  todoText: {
    color: '#8D92A3',
    fontSize: 13,
    lineHeight: 20,
  },
});
