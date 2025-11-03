import React, { useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
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
};

export const GachaStage = ({
  status,
  drops,
  copy,
  isOpening,
  onOpen,
  currentResult,
  onDismissResult,
}: GachaStageProps) => {
  const disabled = status !== 'ready' || isOpening;
  const buttonLabel = useMemo(() => {
    if (status !== 'ready') {
      return copy.loading;
    }
    return isOpening ? copy.buttonLoading : copy.buttonReady;
  }, [copy.buttonLoading, copy.buttonReady, copy.loading, isOpening, status]);

  return (
    <LinearGradient
      colors={['rgba(20, 18, 56, 0.95)', 'rgba(6, 8, 28, 0.94)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.stageShell}
    >
      <View pointerEvents="box-none" style={styles.stageBody}>
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
        <View pointerEvents="box-none" style={styles.overlayContent}>
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
          <CTAButton disabled={disabled} label={buttonLabel} isLoading={isOpening} onPress={onOpen} />
        </View>
      </View>
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.stageSheen}
      />
    </LinearGradient>
  );
};

type CTAButtonProps = {
  disabled: boolean;
  label: string;
  isLoading: boolean;
  onPress: () => void;
};

const CTAButton = ({ disabled, label, isLoading, onPress }: CTAButtonProps) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => animateTo(0.98)}
      onPressOut={() => animateTo(1)}
      style={styles.ctaPressable}
      accessibilityRole="button"
    >
      <Animated.View
        style={[
          styles.ctaButton,
          disabled && styles.ctaButtonDisabled,
          { transform: [{ scale }] },
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
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  stageShell: {
    borderRadius: shape.blockRadius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(86, 68, 172, 0.45)',
    alignSelf: 'stretch',
    ...shadowStyles.card,
    shadowOpacity: 0.26,
    shadowRadius: 18,
    elevation: 9,
  },
  stageBody: {
    height: 300,
    borderRadius: shape.blockRadius,
    overflow: 'hidden',
    backgroundColor: 'rgba(6, 7, 24, 0.95)',
  },
  unitySurface: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.section,
    paddingBottom: spacing.section,
    gap: 24,
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
    maxWidth: 80,
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
  ctaPressable: {
    alignSelf: 'stretch',
  },
  ctaButton: {
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
  ctaButtonDisabled: {
    borderColor: 'rgba(124, 112, 180, 0.45)',
    backgroundColor: 'rgba(16, 16, 36, 0.64)',
  },
  ctaGradient: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    color: '#14031F',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
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
  stageSheen: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    height: 40,
    borderTopLeftRadius: shape.blockRadius - 1,
    borderTopRightRadius: shape.blockRadius - 1,
  },
});
