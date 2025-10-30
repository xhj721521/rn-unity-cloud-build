import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';

export const ForgeScreen = () => {
  return (
    <ScreenContainer scrollable>
      <Text style={styles.heading}>\u94f8\u9020\u574a</Text>
      <Text style={styles.subHeading}>
        \u5408\u6210\u88c5\u5907\u3001\u5347\u7ea7\u6a21\u5757\u4e0e\u6253\u9020\u72ec\u7279\u7684\u94fe\u6e38\u6b66\u5668\u3002
      </Text>

      <View style={styles.section}>
        <LoadingPlaceholder label="\u94f8\u9020\u529f\u80fd\u5efa\u8bbe\u4e2d..." />
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
