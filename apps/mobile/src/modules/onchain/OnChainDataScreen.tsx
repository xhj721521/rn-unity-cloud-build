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
      <Text style={styles.heading}>\u94fe\u9274\u4e2d\u5fc3</Text>
      <Text style={styles.subHeading}>
        \u6c47\u603b\u94fe\u4e0a\u8eab\u4efd\u3001\u8d44\u4ea7\u51ed\u8bc1\u4e0e\u4e16\u754c\u4e8b\u4ef6\u3002
      </Text>

      {loading ? (
        <LoadingPlaceholder label="\u540c\u6b65\u94fe\u4e0a\u8d26\u672c\u4e2d..." />
      ) : error ? (
        <ErrorState title="\u94fe\u4e0a\u6570\u636e\u6682\u4e0d\u53ef\u7528" description={error} />
      ) : data ? (
        <InfoCard title="\u8d44\u4ea7\u6982\u89c8">
          <View style={styles.row}>
            <Text style={styles.label}>\u5730\u5740</Text>
            <Text style={styles.value}>{data.address}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>\u4ee3\u5e01\u79cd\u7c7b</Text>
            <Text style={styles.value}>{data.tokens.length}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>NFT \u6570\u91cf</Text>
            <Text style={styles.value}>{data.nfts.length}</Text>
          </View>
        </InfoCard>
      ) : (
        <LoadingPlaceholder label="\u6682\u65e0\u94fe\u4e0a\u54cd\u5e94" />
      )}

      <InfoCard title="\u5f00\u53d1\u4e2d" subtitle="\u540e\u7eed\u5c06\u63a5\u5165">
        <Text style={styles.todoText}>
          \u00b7 \u5b9e\u65f6\u4ea4\u6613\u8ffd\u8e2a\u4e0e\u5b89\u5168\u9884\u8b66
        </Text>
        <Text style={styles.todoText}>
          \u00b7 \u94fe\u6e38\u6392\u884c\u699c\u4e0e\u8d5b\u5b63\u4fe1\u606f
        </Text>
        <Text style={styles.todoText}>
          \u00b7 NFT \u7ba1\u7406\uff08\u4e0a\u67b6 / \u8f6c\u79fb / \u5408\u6210\uff09
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
