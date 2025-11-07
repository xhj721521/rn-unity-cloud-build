import React, { forwardRef } from 'react';
import {
  Image,
  ImageResizeMode,
  ImageSourcePropType,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type NeonCardProps = ViewProps & {
  borderColors?: [string, string];
  backgroundSource?: ImageSourcePropType;
  overlayColor?: string;
  borderRadius?: number;
  contentPadding?: number;
  glowColor?: string;
  backgroundResizeMode?: ImageResizeMode;
  backgroundStyle?: object;
};

export const NeonCard = forwardRef<View, NeonCardProps>(
  (
    {
      style,
      children,
      borderColors = ['#FF5AE0', '#7DD3FC'],
      backgroundSource,
      overlayColor = 'rgba(6, 8, 22, 0.8)',
      borderRadius = 24,
      contentPadding = 18,
      glowColor = '#7DD3FC',
      backgroundResizeMode = 'cover',
      backgroundStyle,
      ...rest
    },
    ref,
  ) => {
    const innerRadius = Math.max(0, borderRadius - 3);
    return (
      <LinearGradient
        ref={ref}
        colors={borderColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius, shadowColor: glowColor }, style]}
        {...rest}
      >
        <View
          style={[
            styles.inner,
            {
              borderRadius: innerRadius,
              padding: contentPadding,
            },
          ]}
        >
          {backgroundSource ? (
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFillObject,
                styles.backgroundContainer,
                { borderRadius: innerRadius },
              ]}
            >
              <Image
                source={backgroundSource}
                resizeMode={backgroundResizeMode}
                style={[styles.backgroundImage, { borderRadius: innerRadius }, backgroundStyle]}
              />
            </View>
          ) : null}
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFillObject,
              { borderRadius: innerRadius, backgroundColor: overlayColor },
            ]}
          />
          <View style={styles.body}>{children}</View>
        </View>
      </LinearGradient>
    );
  },
);

const styles = StyleSheet.create({
  gradient: {
    padding: 2,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  inner: {
    flex: 1,
    overflow: 'hidden',
  },
  backgroundContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  body: {
    flex: 1,
  },
});

export default NeonCard;
