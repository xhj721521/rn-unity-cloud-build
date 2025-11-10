import React, { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import { translate as t } from '@locale/strings';
import { palette } from '@theme/colors';
import { typography } from '@theme/typography';
import SkeletonBlock from '@components/common/SkeletonBlock';

const filters = [
  { key: 'all', label: '全部' },
  { key: 'topup', label: '充值' },
  { key: 'withdraw', label: '提现' },
  { key: 'bonus', label: '分红' },
  { key: 'contribution', label: '贡献' },
] as const;

type FilterKey = (typeof filters)[number]['key'];

export const FundsRecordScreen = () => {
  const [active, setActive] = useState<FilterKey>('all');

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(t('common.notice', '提示'), message);
    }
  };

  return (
    <ScreenContainer variant="plain" scrollable>
      <Text style={styles.title}>{t('settings.funds.title', '资金记录')}</Text>
      <Text style={styles.subtitle}>
        {t('settings.funds.desc', '充值/提现/分红记录将在接入真实接口后展示，当前为骨架占位。')}
      </Text>
      <View style={styles.filterRow}>
        {filters.map((item) => {
          const activeChip = active === item.key;
          return (
            <Pressable
              key={item.key}
              style={[styles.chip, activeChip && styles.chipActive]}
              onPress={() => {
                setActive(item.key);
                showToast(t('common.placeholder', '占位功能'));
              }}
            >
              <Text style={[styles.chipLabel, activeChip && styles.chipLabelActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {Array.from({ length: 4 }).map((_, idx) => (
        <SkeletonBlock key={idx} height={90} />
      ))}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.heading,
    color: palette.text,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: palette.sub,
    marginBottom: 18,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(6,8,20,0.6)',
  },
  chipActive: {
    borderColor: '#00FFD1',
    backgroundColor: 'rgba(0,255,209,0.12)',
  },
  chipLabel: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  chipLabelActive: {
    color: palette.text,
  },
});

export default FundsRecordScreen;
