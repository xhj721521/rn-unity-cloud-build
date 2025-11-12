import React from 'react';
import { StyleSheet, View } from 'react-native';
import Video from 'react-native-video';

const backgroundSource = require('../assets/shouyeshiping_loop.mp4');

export const GlobalBackground = () => (
  <View pointerEvents="none" style={styles.container}>
    <Video
      source={backgroundSource}
      style={styles.video}
      resizeMode="cover"
      repeat
      muted
      rate={1}
      paused={false}
      playInBackground={false}
      playWhenInactive={false}
      ignoreSilentSwitch="obey"
    />
    <View style={styles.tint} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4, 6, 18, 0.35)',
  },
});

export default GlobalBackground;
