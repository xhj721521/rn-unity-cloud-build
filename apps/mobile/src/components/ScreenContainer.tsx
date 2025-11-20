import React, { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { neonPalette } from '@theme/neonPalette';
import { shape, spacing } from '@theme/tokens';

type ScreenContainerVariant = 'overlay' | 'plain';

type ScreenContainerProps = PropsWithChildren<{
  scrollable?: boolean;
  variant?: ScreenContainerVariant;
  edgeVignette?: boolean;
  background?: React.ReactNode;
}>;

export const ScreenContainer = ({
  children,
  scrollable = false,
  variant = 'overlay',
  edgeVignette = false,
  background,
}: ScreenContainerProps) => {
  const contentStyle = [
    styles.contentBase,
    variant === 'overlay' ? styles.overlayContent : styles.plainContent,
  ];
  const containerStyle = [
    styles.contentBase,
    variant === 'overlay' ? styles.overlayStatic : styles.plainStatic,
  ];

  const BackgroundWrapper = background ? (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {background}
    </View>
  ) : null;

  if (scrollable) {
    return (
      <View style={styles.wrapper}>
        {BackgroundWrapper}
        {edgeVignette ? <EdgeVignette /> : null}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={[styles.scroll, variant === 'overlay' ? undefined : styles.plainScroll]}
        >
          <View style={contentStyle}>{children}</View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {BackgroundWrapper}
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
