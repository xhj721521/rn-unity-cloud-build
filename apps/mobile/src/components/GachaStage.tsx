import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { UnityView } from '@bridge/UnityView';
import { neonPalette } from '@theme/neonPalette';
import { shadowStyles, shape, spacing, typeScale } from '@theme/tokens';
import { UnityStatus } from '@bridge/useUnityBridge';

export type GachaDrop = {
  id: string;
  avatarFallback: string;
  name: string;
  rarity: string;
  timestamp: number;
};

type StageCopy = {
  loading: string;
  buttonReady: string;
  buttonLoading: string;
};

type GachaStageProps = {
  status: UnityStatus;
  drops: GachaDrop[];
  copy: StageCopy;
  isOpening: boolean;
  onOpen: () => void;
  currentResult?: GachaDrop;
  onDismissResult?: () => void;
  stageHeight: number;
};

const CTA_HEIGHT = 56;
const CTA_BOTTOM_INSET = spacing.section;
const INFO_STRIP_GAP = 24;
const INFO_BOTTOM_OFFSET = CTA_BOTTOM_INSET + CTA_HEIGHT + INFO_STRIP_GAP;

export const GachaStage = ({
  status,
  drops,
  copy,
  isOpening,
  onOpen,
  currentResult,
  onDismissResult,
  stageHeight,
}: GachaStageProps) => {
  const disabled = status !== 'ready' || isOpening;
  const buttonLabel = useMemo(() => {
    if (status !== 'ready') {
      return copy.loading;
    }
    return isOpening ? copy.buttonLoading : copy.buttonReady;
  }, [copy.buttonLoading, copy.buttonReady, copy.loading, isOpening, status]);

  return (
    <View style={[styles.frame, { height: stageHeight }]}>
      <View pointerEvents="none" style={styles.frameHighlight} />
      <View style={styles.inner}>
        <LinearGradient
          colors={['rgba(20, 18, 56, 0.95)', 'rgba(6, 8, 28, 0.94)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <UnityView pointerEvents="none" style={styles.unitySurface} />
        {status !== 'ready' ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color={neonPalette.accentMagenta} />
            <Text style={styles.loadingLabel}>{copy.loading}</Text>
          </View>
        ) : null}
        {currentResult ? (
          <Pressable
            onPress={onDismissResult}
            style={styles.resultCard}
            accessibilityRole="button"
          >
            <Text style={styles.resultTitle}>恭喜获得</Text>
            <Text style={styles.resultItem}>{currentResult.name}</Text>
            <Text style={styles.resultRarity}>{currentResult.rarity}</Text>
            <Text style={styles.resultHint}>点击收起</Text>
          </Pressable>
        ) : null}
        <View pointerEvents="box-none" style={styles.infoStripContainer}>
          <View pointerEvents="box-none" style={styles.infoStrip}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.infoContent}
            >
              <Text style={styles.infoPrefix}>最近掉落：</Text>
              {drops.length === 0 ? (
                <Text style={styles.infoItemMuted}>暂无记录</Text>
              ) : (
                drops.map((drop) => (
                  <View key={drop.id} style={styles.infoItem}>
                    <View style={styles.infoAvatar}>
                      <Text style={styles.infoAvatarLabel}>{drop.avatarFallback}</Text>
                    </View>
                    <Text style={styles.infoName} numberOfLines={1}>
                      {drop.name}
                    </Text>
                    <Text style={styles.infoRarity}>{drop.rarity}</Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
        <CTAButton disabled={disabled} label={buttonLabel} isLoading={isOpening} onPress={onOpen} />
      </View>
    </View>
  );
};

type CTAButtonProps = {
  disabled: boolean;
  label: string;
  isLoading: boolean;
  onPress: () => void;
};

const CTAButton = ({ disabled, label, isLoading, onPress }: CTAButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.ctaButton,
        disabled && styles.ctaButtonDisabled,
        pressed && !disabled ? styles.ctaButtonPressed : null,
      ]}
    >
      <LinearGradient
        colors={disabled ? ['#453A78', '#2A214F'] : ['#7B2EFF', '#FF5BD0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.ctaGradient}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={disabled ? '#D4CFFF' : '#14031F'} />
        ) : (
          <Text style={styles.ctaLabel}>{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  frame: {
    marginHorizontal: 0,
    borderRadius: shape.blockRadius,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 1,
    overflow: 'hidden',
    ...shadowStyles.card,
    alignSelf: 'stretch',
  },
  frameHighlight: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    height: 1,
    borderTopLeftRadius: shape.blockRadius - 1,
    borderTopRightRadius: shape.blockRadius - 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  inner: {
    flex: 1,
    borderRadius: shape.blockRadius - 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(6, 7, 24, 0.95)',
    position: 'relative',
  },
  unitySurface: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 7, 24, 0.6)',
    gap: spacing.grid,
  },
  loadingLabel: {
    color: neonPalette.textSecondary,
    fontSize: 13,
  },
  infoStripContainer: {
    position: 'absolute',
    left: spacing.section,
    right: spacing.section,
    bottom: INFO_BOTTOM_OFFSET,
  },
  infoStrip: {
    backgroundColor: 'rgba(8, 10, 34, 0.86)',
    borderRadius: shape.buttonRadius,
    paddingHorizontal: spacing.section,
    paddingVertical: spacing.grid / 2,
    borderWidth: 1,
    borderColor: 'rgba(72, 58, 160, 0.4)',
  },
  infoContent: {
    alignItems: 'center',
    gap: spacing.cardGap,
  },
  infoPrefix: {
    color: neonPalette.textSecondary,
    ...typeScale.caption,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.grid / 2,
  },
  infoAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(118, 92, 255, 0.32)',
  },
  infoAvatarLabel: {
    color: neonPalette.textPrimary,
    fontSize: 11,
    fontWeight: '600',
  },
  infoName: {
    color: neonPalette.textPrimary,
    fontSize: 12,
    maxWidth: 96,
  },
  infoRarity: {
    color: '#84FCE7',
    fontSize: 11,
    fontWeight: '600',
  },
  infoItemMuted: {
    color: neonPalette.textMuted,
    ...typeScale.caption,
  },
  ctaButton: {
    position: 'absolute',
    left: spacing.section,
    right: spacing.section,
    bottom: CTA_BOTTOM_INSET,
    height: CTA_HEIGHT,
    borderRadius: shape.buttonRadius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 110, 240, 0.7)',
    backgroundColor: 'rgba(255, 110, 240, 0.16)',
    ...shadowStyles.card,
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  ctaButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  ctaButtonDisabled: {
    borderColor: 'rgba(124, 112, 180, 0.45)',
    backgroundColor: 'rgba(16, 16, 36, 0.64)',
  },
  ctaGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    color: '#14031F',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  resultCard: {
    position: 'absolute',
    top: spacing.section,
    alignSelf: 'center',
    paddingHorizontal: spacing.section,
    paddingVertical: spacing.cardGap,
    borderRadius: shape.cardRadius,
    backgroundColor: 'rgba(22, 12, 56, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(120, 82, 240, 0.5)',
    alignItems: 'center',
    gap: 4,
  },
  resultTitle: {
    color: neonPalette.textSecondary,
    fontSize: 12,
  },
  resultItem: {
    color: neonPalette.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  resultRarity: {
    color: '#FF8BE3',
    fontSize: 13,
    fontWeight: '600',
  },
  resultHint: {
    color: neonPalette.textMuted,
    fontSize: 11,
  },
});
