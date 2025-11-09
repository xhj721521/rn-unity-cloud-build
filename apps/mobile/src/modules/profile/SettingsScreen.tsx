import React, { useState } from 'react';
import { ActionSheetIOS, Alert, Linking, Platform, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import RipplePressable from '@components/RipplePressable';
import QuickGlyph, { QuickGlyphId } from '@components/QuickGlyph';
import { spacing, shape } from '@theme/tokens';
import { palette } from '@theme/colors';
import { typography } from '@theme/typography';
import { translate as t, languageLabels, supportedLanguages } from '@locale/strings';
import { useAccountSummary } from '@services/web3/hooks';
import HomeBackground from '../../ui/HomeBackground';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@app/navigation/types';
import { useNavigation } from '@react-navigation/native';

const contactLinks = [
  { key: 'twitter', label: 'Twitter', url: 'https://twitter.com/arc-pilot' },
  { key: 'telegram', label: 'Telegram', url: 'https://t.me/arc-pilot' },
  { key: 'email', label: 'Email', url: 'mailto:team@arc-pilot.io' },
  { key: 'website', label: 'Website', url: 'https://arc-pilot.io' },
];

export const SettingsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { data } = useAccountSummary();
  const [language, setLanguage] = useState<(typeof supportedLanguages)[number]>('zh-CN');

  const handleLanguage = () => {
    const labels = supportedLanguages.map((code) => `${languageLabels[code]} (${code})`);
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: t('my.language.sheetTitle'),
          options: [...labels, t('common.cancel', '取消')],
          cancelButtonIndex: labels.length,
        },
        (index) => {
          if (index >= labels.length) {
            return;
          }
          const next = supportedLanguages[index];
          setLanguage(next);
          Alert.alert(languageLabels[next], t('my.language.toast'));
        },
      );
    } else {
      Alert.alert(t('my.language.sheetTitle'), t('my.language.toast'));
    }
  };

  const openContact = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert(t('common.notice'), t('settings.contact.error', '无法打开链接'));
    });
  };

  const background = <HomeBackground showVaporLayers />;
  const isVerified = (data?.kycStatus ?? 'pending') === 'verified';

  return (
    <ScreenContainer scrollable variant="plain" edgeVignette background={background}>
      <Text style={styles.title}>{t('settings.title')}</Text>
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>{t('settings.preferences')}</Text>
        <SettingsItem
          icon="globe"
          label={t('my.settings.language')}
          value={languageLabels[language]}
          onPress={handleLanguage}
        />
        <SettingsItem
          icon="theme"
          label={t('my.settings.theme')}
          value={t('my.settings.soon')}
          disabled
        />
        <SettingsItem
          icon="bell"
          label={t('my.settings.notifications')}
          value={t('my.settings.soon')}
          disabled
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>{t('settings.account')}</Text>
        <SettingsItem
          icon="lock"
          label={t('my.settings.kyc')}
          value={isVerified ? t('member.vip') : t('member.non')}
          onPress={() => navigation.navigate('KYC')}
        />
        <SettingsItem
          icon="market"
          label={t('my.settings.records')}
          value={t('wallet.history')}
          onPress={() => navigation.navigate('Wallet')}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>{t('settings.contact')}</Text>
        {contactLinks.map((item) => (
          <RipplePressable
            key={item.key}
            style={styles.contactRow}
            onPress={() => openContact(item.url)}
          >
            <Text style={styles.contactLabel}>{item.label}</Text>
            <Text style={styles.contactValue}>{item.url.replace('https://', '')}</Text>
          </RipplePressable>
        ))}
      </View>
    </ScreenContainer>
  );
};

const SettingsItem = ({
  icon,
  label,
  value,
  onPress,
  disabled,
}: {
  icon: QuickGlyphId;
  label: string;
  value: string;
  onPress?: () => void;
  disabled?: boolean;
}) => (
  <RipplePressable
    style={[styles.item, disabled && styles.itemDisabled]}
    onPress={onPress}
    disabled={disabled || !onPress}
  >
    <View style={styles.itemLeft}>
      <QuickGlyph id={icon} size={20} />
      <Text style={styles.itemLabel}>{label}</Text>
    </View>
    <Text style={styles.itemValue}>{value}</Text>
  </RipplePressable>
);

const styles = StyleSheet.create({
  title: {
    ...typography.heading,
    marginBottom: spacing.section,
  },
  card: {
    borderRadius: shape.cardRadius,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: 'rgba(7,10,20,0.7)',
    padding: 16,
    marginBottom: spacing.section,
    gap: 6,
  },
  sectionLabel: {
    ...typography.captionCaps,
    color: palette.sub,
    marginBottom: 6,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  itemDisabled: {
    opacity: 0.5,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemLabel: {
    ...typography.body,
    color: palette.text,
  },
  itemValue: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  contactRow: {
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  contactLabel: {
    ...typography.body,
    color: palette.text,
  },
  contactValue: {
    ...typography.captionCaps,
    color: palette.primary,
    marginTop: 4,
  },
});

export default SettingsScreen;
