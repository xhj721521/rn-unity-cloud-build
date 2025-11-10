import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Linking, Platform, StyleSheet, Text, ToastAndroid } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '@components/ScreenContainer';
import SettingSection from '@components/settings/SettingSection';
import SettingRow from '@components/settings/SettingRow';
import SkeletonBlock from '@components/common/SkeletonBlock';
import { ProfileStackParamList } from '@app/navigation/types';
import { translate as t, languageLabels } from '@locale/strings';
import { useAccountSummary } from '@services/web3/hooks';
import { palette } from '@theme/colors';
import { typography } from '@theme/typography';
import appPackage from '../../../package.json';

const supportLinks = [
  {
    key: 'twitter',
    labelKey: 'settings.contact.twitter',
    fallback: 'Twitter',
    url: 'https://twitter.com/arc-pilot',
  },
  {
    key: 'telegram',
    labelKey: 'settings.contact.telegram',
    fallback: 'Telegram',
    url: 'https://t.me/arc-pilot',
  },
  {
    key: 'email',
    labelKey: 'settings.contact.email',
    fallback: 'Email',
    url: 'mailto:team@arc-pilot.io',
  },
  {
    key: 'website',
    labelKey: 'settings.contact.website',
    fallback: 'Website',
    url: 'https://arc-pilot.io',
  },
];

export const SettingsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { data } = useAccountSummary();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 480);
    return () => clearTimeout(timer);
  }, []);

  const showToast = useCallback((message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(t('common.notice', '提示'), message);
    }
  }, []);

  const kycStatus = (data?.kycStatus ?? 'pending') === 'verified';
  const versionLabel = `v${appPackage.version ?? '0.0.0'}`;

  const handleExternal = (url: string) => {
    Linking.openURL(url).catch(() =>
      showToast(t('settings.contact.error', '无法打开链接，请稍候重试')),
    );
  };

  const handleCopy = (value: string) => {
    Clipboard.setString(value);
    showToast(t('common.copy_success', '已复制'));
  };

  const placeholder = () => showToast(t('common.placeholder', '占位功能'));

  const contactRows = useMemo(
    () =>
      supportLinks.map((item) => ({
        ...item,
        label: t(item.labelKey, item.fallback),
      })),
    [],
  );

  if (loading) {
    return (
      <ScreenContainer variant="plain" scrollable>
        <Text style={styles.title}>{t('settings.title', '系统与支持')}</Text>
        <SkeletonBlock height={120} />
        <SkeletonBlock height={220} />
        <SkeletonBlock height={160} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer variant="plain" scrollable>
      <Text style={styles.title}>{t('settings.title', '系统与支持')}</Text>
      <SettingSection title={t('settings.section.preferences', '偏好设置')}>
        <SettingRow
          icon="globe"
          title={t('settings.language.title', '语言 Language')}
          variant="chevron"
          value={languageLabels['zh-CN']}
          onPress={() => navigation.navigate('LanguageSettings')}
        />
        <SettingRow
          icon="theme"
          title={t('settings.theme.title', '个性化主题')}
          variant="disabled"
          badgeText={t('common.soon', '即将上线')}
        />
        <SettingRow
          icon="bell"
          title={t('settings.notifications.title', '通知与推送')}
          subtitle={t('settings.notifications.subtitle', '系统公告 / 战报推送')}
          variant="chevron"
          onPress={() => navigation.navigate('NotificationsSettings')}
        />
      </SettingSection>

      <SettingSection title={t('settings.section.account', '账户与资产')}>
        <SettingRow
          icon="lock"
          title={t('settings.kyc.title', '实名信息 KYC')}
          variant="badge"
          badgeTone={kycStatus ? 'ok' : 'pending'}
          badgeText={
            kycStatus
              ? t('settings.kyc.verified', '已实名')
              : t('settings.kyc.unverified', '未实名')
          }
          onPress={() => navigation.navigate('KYC')}
        />
        <SettingRow
          icon="storage"
          title={t('settings.funds.title', '资金记录')}
          variant="chevron"
          onPress={() => navigation.navigate('FundsRecord')}
        />
      </SettingSection>

      <SettingSection title={t('settings.section.support', '支持与关于')}>
        {contactRows.map((item) => (
          <SettingRow
            key={item.key}
            icon="link"
            title={item.label}
            subtitle={item.url.replace(/https?:\/\//, '')}
            variant="external"
            onPress={() => handleExternal(item.url)}
            onLongPress={() => handleCopy(item.url)}
          />
        ))}
        <SettingRow
          icon="network"
          title={t('settings.version', '版本更新')}
          variant="value"
          value={versionLabel}
          onPress={() => showToast(t('settings.version.latest', '已是最新版本'))}
        />
      </SettingSection>

      <SettingSection title={t('settings.section.danger', '危险区域')} tone="danger">
        <SettingRow
          icon="logout"
          title={t('settings.logout', '退出登录')}
          tone="danger"
          variant="chevron"
          onPress={placeholder}
        />
      </SettingSection>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.heading,
    color: palette.text,
    marginBottom: 20,
  },
});

export default SettingsScreen;
