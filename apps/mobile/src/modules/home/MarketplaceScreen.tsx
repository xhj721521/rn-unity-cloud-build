import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';

export const MarketplaceScreen = () => {
  return (
    <ScreenContainer scrollable>
      <Text style={styles.heading}>集市坊</Text>
      <Text style={styles.subHeading}>
        在链上集市交易装备、伙伴与稀有道具。
      </Text>

      <View style={styles.section}>
        <LoadingPlaceholder label="集市数据接口接入中..." />
      </View>
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
  section: {
    marginTop: 12,
  },
});
