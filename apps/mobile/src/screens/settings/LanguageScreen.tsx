import React, { useMemo, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, ToastAndroid } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import SettingSection from '@components/settings/SettingSection';
import SettingRow from '@components/settings/SettingRow';
import NeonButton from '@components/NeonButton';
import { translate as t, languageLabels, supportedLanguages } from '@locale/strings';
import { palette } from '@theme/colors';
import { typography } from '@theme/typography';

const showPlaceholder = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert(t('common.notice', '提示'), message);
  }
};

export const LanguageScreen = () => {
  const [selected, setSelected] = useState<(typeof supportedLanguages)[number]>('zh-CN');
  const placeholderText = useMemo(() => t('common.placeholder', '占位功能'), []);

  const handleApply = () => {
    showPlaceholder(placeholderText);
  };

  return (
    <ScreenContainer variant="plain" scrollable>
      <Text style={styles.title}>{t('settings.language.title', '语言设置')}</Text>
      <Text style={styles.subtitle}>
        {t('settings.language.hint', '选择应用语言，后续版本将同步界面。')}
      </Text>
      <SettingSection>
        {supportedLanguages.map((code) => (
          <SettingRow
            key={code}
            icon="globe"
            title={`${languageLabels[code]} (${code})`}
            variant="radio"
            selected={selected === code}
            onPress={() => setSelected(code)}
            onLongPress={() => showPlaceholder(placeholderText)}
          />
        ))}
      </SettingSection>
      <NeonButton title={t('settings.language.apply', '应用（占位）')} onPress={handleApply} />
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
});

export default LanguageScreen;
