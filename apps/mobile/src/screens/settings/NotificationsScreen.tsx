import React, { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, ToastAndroid } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import SettingSection from '@components/settings/SettingSection';
import SettingRow from '@components/settings/SettingRow';
import NeonPanel from '@components/common/NeonPanel';
import { translate as t } from '@locale/strings';
import { palette } from '@theme/colors';
import { typography } from '@theme/typography';

const notifyKeys = [
  { key: 'system', title: 'settings.notifications.system', fallback: '系统公告' },
  { key: 'battle', title: 'settings.notifications.battle', fallback: '战报推送' },
  { key: 'marketing', title: 'settings.notifications.marketing', fallback: '活动与营销' },
] as const;

type ToggleState = Record<(typeof notifyKeys)[number]['key'], boolean>;

export const NotificationsScreen = () => {
  const [state, setState] = useState<ToggleState>({
    system: true,
    battle: true,
    marketing: false,
  });

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(t('common.notice', '提示'), message);
    }
  };

  return (
    <ScreenContainer variant="plain" scrollable>
      <Text style={styles.title}>{t('settings.notifications.title', '通知设置')}</Text>
      <Text style={styles.subtitle}>
        {t('settings.notifications.desc', '切换感兴趣的推送内容，当前仅展示示例。')}
      </Text>
      <SettingSection>
        {notifyKeys.map((item) => (
          <SettingRow
            key={item.key}
            icon="bell"
            title={t(item.title, item.fallback)}
            variant="switch"
            switchValue={state[item.key]}
            onSwitchChange={(next) => {
              setState((prev) => ({
                ...prev,
                [item.key]: next,
              }));
              showToast(t('common.placeholder', '占位功能'));
            }}
          />
        ))}
      </SettingSection>

      <NeonPanel padding={18}>
        <Text style={styles.sampleLabel}>{t('settings.notifications.preview', '示例预览')}</Text>
        <Text style={styles.sampleTitle}>ARC · 系统公告</Text>
        <Text style={styles.sampleBody}>链路优化完成，新的盲盒掉率将于今日 22:00 生效。</Text>
      </NeonPanel>
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
  sampleLabel: {
    ...typography.captionCaps,
    color: palette.sub,
    marginBottom: 6,
  },
  sampleTitle: {
    ...typography.subtitle,
    color: palette.text,
    marginBottom: 4,
  },
  sampleBody: {
    ...typography.body,
    color: palette.sub,
  },
});

export default NotificationsScreen;
