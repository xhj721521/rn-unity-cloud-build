import React, { PropsWithChildren } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNeonPulse, getGlowStyle } from '@theme/animations';
import { neonPalette } from '@theme/neonPalette';
import { shape, spacing } from '@theme/tokens';
import { useBottomGutter } from '@hooks/useBottomGutter';

type ScreenContainerVariant = 'overlay' | 'plain';

type ScreenContainerProps = PropsWithChildren<{
  scrollable?: boolean;
  variant?: ScreenContainerVariant;
  edgeVignette?: boolean;
  background?: React.ReactNode;
}>;

type GlowBackdropProps = {
  primaryPulse: Animated.Value;
  secondaryPulse: Animated.Value;
};

const GlowBackdrop = ({ primaryPulse, secondaryPulse }: GlowBackdropProps) => (
  <>
    <Animated.View
      pointerEvents="none"
      style={[
        styles.glow,
        styles.glowPrimary,
        getGlowStyle({
          animated: primaryPulse,
          minOpacity: 0.25,
          maxOpacity: 0.6,
          minScale: 0.9,
          maxScale: 1.25,
        }),
      ]}
    />
    <Animated.View
      pointerEvents="none"
      style={[
        styles.glow,
        styles.glowSecondary,
        getGlowStyle({
          animated: secondaryPulse,
          minOpacity: 0.18,
          maxOpacity: 0.45,
          minScale: 0.8,
          maxScale: 1.4,
        }),
      ]}
    />
  </>
);

export const ScreenContainer = ({
  children,
  scrollable = false,
  variant = 'overlay',
  edgeVignette = false,
  background,
}: ScreenContainerProps) => {
  const primaryPulse = useNeonPulse({ duration: 5200 });
  const secondaryPulse = useNeonPulse({ duration: 6600 });

  const contentStyle = [
    styles.contentBase,
    variant === 'overlay' ? styles.overlayContent : styles.plainContent,
  ];
  const containerStyle = [
    styles.contentBase,
    variant === 'overlay' ? styles.overlayStatic : styles.plainStatic,
  ];

  const bottomGutter = useBottomGutter();
  const shouldRenderDefaultBackground = !background;
  const BackgroundWrapper = background ? (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {background}
    </View>
  ) : null;

  if (scrollable) {
    return (
      <View style={styles.wrapper}>
        {shouldRenderDefaultBackground ? (
          <>
            <LinearGradient
              colors={neonPalette.backgroundGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <GlowBackdrop primaryPulse={primaryPulse} secondaryPulse={secondaryPulse} />
          </>
        ) : (
          BackgroundWrapper
        )}
        {edgeVignette ? <EdgeVignette /> : null}
        <ScrollView
          contentContainerStyle={[styles.scrollContent, bottomGutter.contentContainerStyle]}
          style={[styles.scroll, variant === 'overlay' ? undefined : styles.plainScroll]}
          contentInset={bottomGutter.contentInset}
          scrollIndicatorInsets={bottomGutter.scrollIndicatorInsets}
        >
          <View style={contentStyle}>{children}</View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {shouldRenderDefaultBackground ? (
        <>
          <LinearGradient
            colors={neonPalette.backgroundGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <GlowBackdrop primaryPulse={primaryPulse} secondaryPulse={secondaryPulse} />
        </>
      ) : (
        BackgroundWrapper
      )}
      {edgeVignette ? <EdgeVignette /> : null}
      <View style={containerStyle}>{children}</View>
    </View>
  );
};

const EdgeVignette = () => (
  <>
    <LinearGradient
      pointerEvents="none"
      colors={['rgba(4, 1, 15, 0.6)', 'transparent']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.vignette, styles.vignetteTop]}
    />
    <LinearGradient
      pointerEvents="none"
      colors={['transparent', 'rgba(4, 1, 15, 0.6)']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.vignette, styles.vignetteBottom]}
    />
    <LinearGradient
      pointerEvents="none"
      colors={['rgba(4, 1, 15, 0.55)', 'transparent']}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[styles.vignetteVertical, styles.vignetteLeft]}
    />
    <LinearGradient
      pointerEvents="none"
      colors={['transparent', 'rgba(4, 1, 15, 0.55)']}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[styles.vignetteVertical, styles.vignetteRight]}
    />
  </>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#04010F',
  },
  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentBase: {
    flex: 1,
  },
  overlayContent: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingTop: spacing.pageVertical,
    paddingBottom: spacing.section * 2,
    backgroundColor: neonPalette.backgroundOverlay,
    borderTopLeftRadius: shape.blockRadius + 4,
    borderTopRightRadius: shape.blockRadius + 4,
    borderWidth: 1,
    borderColor: neonPalette.surfaceBorderMuted,
  },
  overlayStatic: {
    margin: spacing.pageHorizontal,
    borderRadius: shape.blockRadius + 4,
    paddingHorizontal: spacing.pageHorizontal,
    paddingTop: spacing.pageVertical,
    paddingBottom: spacing.section * 2,
    backgroundColor: neonPalette.backgroundOverlay,
    borderWidth: 1,
    borderColor: neonPalette.surfaceBorderMuted,
  },
  plainContent: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingTop: spacing.pageVertical,
    paddingBottom: spacing.section * 1.75,
  },
  plainStatic: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingTop: spacing.pageVertical,
    paddingBottom: spacing.section * 1.75,
  },
  scrollContent: {
    paddingBottom: spacing.section * 2,
    flexGrow: 1,
  },
  plainScroll: {
    backgroundColor: 'transparent',
  },
  glow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
  },
  glowPrimary: {
    top: -80,
    right: -60,
    backgroundColor: neonPalette.glowPink,
  },
  glowSecondary: {
    bottom: -60,
    left: -40,
    backgroundColor: neonPalette.glowCyan,
  },
  vignette: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 80,
  },
  vignetteVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 60,
  },
  vignetteTop: {
    top: 0,
  },
  vignetteBottom: {
    bottom: 0,
  },
  vignetteLeft: {
    left: 0,
  },
  vignetteRight: {
    right: 0,
  },
});
