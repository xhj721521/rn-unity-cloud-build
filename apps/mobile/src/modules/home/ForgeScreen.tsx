import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';

export const ForgeScreen = () => {
  return (
    <ScreenContainer scrollable>
      <Text style={styles.heading}>铸造坊</Text>
      <Text style={styles.subHeading}>
        合成装备、升级模块与打造独特的链游武器。
      </Text>

      <View style={styles.section}>
        <LoadingPlaceholder label="铸造功能建设中..." />
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
