import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';

export const MarketplaceScreen = () => {
  return (
    <ScreenContainer scrollable>
      <Text style={styles.heading}>\u96c6\u5e02\u574a</Text>
      <Text style={styles.subHeading}>
        \u5728\u94fe\u4e0a\u96c6\u5e02\u4ea4\u6613\u88c5\u5907\u3001\u4f19\u4f34\u4e0e\u7a00\u6709\u9053\u5177\u3002
      </Text>

      <View style={styles.section}>
        <LoadingPlaceholder label="\u96c6\u5e02\u6570\u636e\u63a5\u53e3\u63a5\u5165\u4e2d..." />
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
