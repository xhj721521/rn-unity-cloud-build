import React, { PropsWithChildren } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNeonPulse, getGlowStyle } from '@theme/animations';
import { neonPalette } from '@theme/neonPalette';

type ScreenContainerProps = PropsWithChildren<{
  scrollable?: boolean;
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
}: ScreenContainerProps) => {
  const primaryPulse = useNeonPulse({ duration: 5200 });
  const secondaryPulse = useNeonPulse({ duration: 6600 });

  if (scrollable) {
    return (
      <View style={styles.wrapper}>
        <LinearGradient
          colors={neonPalette.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <GlowBackdrop
          primaryPulse={primaryPulse}
          secondaryPulse={secondaryPulse}
        />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={styles.scroll}
        >
          <View style={styles.content}>{children}</View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={neonPalette.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <GlowBackdrop
        primaryPulse={primaryPulse}
        secondaryPulse={secondaryPulse}
      />
      <View style={[styles.content, styles.staticContent]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#04010F',
  },
  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    backgroundColor: neonPalette.backgroundOverlay,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: neonPalette.surfaceBorderMuted,
  },
  staticContent: {
    margin: 20,
    borderRadius: 24,
  },
  scrollContent: {
    paddingBottom: 32,
    flexGrow: 1,
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
});
