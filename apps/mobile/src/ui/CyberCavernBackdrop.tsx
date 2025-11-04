import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const cavernTexture = require('../assets/backgrounds/cyber_cavern.png');
const noiseTexture = require('../assets/noise-2px.png');
const scanlineTexture = require('../assets/overlay_scanline.png');

export const CyberCavernBackdrop = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <ImageBackground source={cavernTexture} resizeMode="cover" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={['rgba(3, 1, 12, 0.86)', 'rgba(5, 0, 28, 0.4)', 'rgba(8, 9, 32, 0.92)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(255, 60, 210, 0.2)', 'rgba(0, 0, 0, 0)', 'rgba(0, 214, 255, 0.18)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <ImageBackground source={noiseTexture} resizeMode="repeat" style={styles.noise} />
      <ImageBackground source={scanlineTexture} resizeMode="repeat" style={styles.scanlines} />
    </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
  noise: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.08,
  },
  scanlines: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
  },
});
