import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import NeonCard from '@components/NeonCard';
import RipplePressable from '@components/RipplePressable';
import QuickGlyph, { QuickGlyphId } from '@components/QuickGlyph';
import HomeBackground from '../../ui/HomeBackground';
import { useAccountSummary } from '@services/web3/hooks';
import { palette } from '@theme/colors';
import { spacing, shape } from '@theme/tokens';
import { typography } from '@theme/typography';
import { translate as t } from '@locale/strings';

type WalletTab = 'wallet.topup' | 'wallet.withdraw' | 'wallet.history';

const walletTabs: { key: WalletTab; glyph: QuickGlyphId }[] = [
  { key: 'wallet.topup', glyph: 'arc' },
  { key: 'wallet.withdraw', glyph: 'lock' },
  { key: 'wallet.history', glyph: 'reports' },
];

export const WalletScreen = () => {
  const background = useMemo(() => <HomeBackground showVaporLayers />, []);
  const { data } = useAccountSummary();
  const kycStatus = data?.kycStatus ?? 'pending';
  const [tab, setTab] = useState<WalletTab>('wallet.topup');

  const tabDescription = useMemo(() => {
    switch (tab) {
      case 'wallet.topup':
        return t('wallet.topup.desc');
      case 'wallet.withdraw':
        return t('wallet.withdraw.desc');
      case 'wallet.history':
      default:
        return t('wallet.history.desc');
    }
  }, [tab]);

  return (
    <ScreenContainer scrollable variant="plain" edgeVignette background={background}>
      <Text style={styles.title}>{t('wallet.title')}</Text>
      <View style={styles.tabRow}>
        {walletTabs.map((item) => (
          <RipplePressable
            key={item.key}
            style={[styles.tabChip, tab === item.key && styles.tabChipActive]}
            onPress={() => setTab(item.key)}
          >
            <QuickGlyph id={item.glyph} size={18} />
            <Text style={styles.tabText}>{t(item.key)}</Text>
          </RipplePressable>
        ))}
      </View>
      <NeonCard
        borderRadius={shape.cardRadius}
        overlayColor="rgba(8,10,22,0.7)"
        contentPadding={20}
        style={styles.card}
      >
        <Text style={styles.cardTitle}>{t(tab)}</Text>
        <Text style={styles.cardDesc}>{tabDescription}</Text>
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            {t('wallet.notice', {
              status: kycStatus === 'verified' ? t('member.vip') : t('member.non'),
            })}
          </Text>
          <Text style={styles.noticeSub}>{t('wallet.settle')}</Text>
        </View>
      </NeonCard>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.heading,
    marginBottom: spacing.section,
  },
  tabRow: {
    flexDirection: 'row',
    gap: spacing.cardGap,
    marginBottom: spacing.cardGap,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: shape.capsuleRadius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    backgroundColor: 'rgba(7,9,20,0.6)',
  },
  tabChipActive: {
    borderColor: palette.primary,
    backgroundColor: 'rgba(0,209,199,0.1)',
  },
  tabText: {
    ...typography.captionCaps,
    color: palette.text,
  },
  card: {
    minHeight: 180,
  },
  cardTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  cardDesc: {
    ...typography.body,
    color: palette.sub,
    marginTop: 8,
  },
  notice: {
    marginTop: spacing.cardGap,
    padding: 14,
    borderRadius: shape.cardRadius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(5,7,18,0.6)',
  },
  noticeText: {
    ...typography.body,
    color: palette.text,
  },
  noticeSub: {
    ...typography.captionCaps,
    color: palette.muted,
    marginTop: 6,
  },
});

export default WalletScreen;
