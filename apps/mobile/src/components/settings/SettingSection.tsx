import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NeonPanel } from '@components/common/NeonPanel';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';
import { spacing } from '@theme/tokens';

type SettingSectionProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  tone?: 'default' | 'danger';
}>;

const gradients = {
  default: {
    borderColors: ['#00FFD1', '#7DB1FF'] as [string, string],
    glowColor: '#7BD7FF',
  },
  danger: {
    borderColors: ['#FF5F8E', '#FF936B'] as [string, string],
    glowColor: '#FF6F91',
  },
};

export const SettingSection = ({
  title,
  subtitle,
  tone = 'default',
  children,
}: SettingSectionProps) => {
  const gradient = gradients[tone];
  return (
    <NeonPanel
      style={styles.section}
      borderColors={gradient.borderColors}
      glowColor={gradient.glowColor}
      padding={18}
      borderRadius={24}
    >
      {title ? (
        <Text style={[styles.title, tone === 'danger' && styles.dangerTitle]}>{title}</Text>
      ) : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.content}>{children}</View>
    </NeonPanel>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.section,
  },
  title: {
    ...typography.captionCaps,
    color: palette.sub,
    marginBottom: 8,
  },
  dangerTitle: {
    color: '#FF8899',
  },
  subtitle: {
    ...typography.caption,
    color: palette.muted,
    marginBottom: 10,
  },
  content: {
    gap: 10,
  },
});

export default SettingSection;
