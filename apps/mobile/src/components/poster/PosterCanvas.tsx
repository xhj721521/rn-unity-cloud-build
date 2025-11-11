import React from 'react';
import { ImageBackground, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';

type PosterCanvasProps = {
  template: ImageSourcePropType;
  ratio: string;
};

export const PosterCanvas = ({ template, ratio }: PosterCanvasProps) => (
  <View style={styles.wrapper}>
    <ImageBackground source={template} style={styles.canvas} imageStyle={styles.canvasImage}>
      <Text style={styles.ratioTag}>{ratio}</Text>
      <Text style={styles.title}>加入我的队</Text>
      <Text style={styles.subtitle}>邀请码 · ABCD12</Text>
      <Text style={styles.team}>队伍：Trinity</Text>
      <View style={styles.rewardPill}>
        <Text style={styles.rewardText}>满10人 赠盲盒券 ×1</Text>
      </View>
      <View style={styles.qrPlaceholder}>
        <Text style={styles.qrText}>二维码</Text>
      </View>
    </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  canvas: {
    height: 340,
    padding: 20,
    justifyContent: 'flex-end',
  },
  canvasImage: {
    resizeMode: 'cover',
  },
  ratioTag: {
    position: 'absolute',
    top: 16,
    right: 16,
    ...typography.captionCaps,
    color: palette.text,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  title: {
    ...typography.heading,
    fontSize: 28,
    color: '#FFFFFF',
  },
  subtitle: {
    ...typography.subtitle,
    color: '#00E5FF',
    marginTop: 8,
  },
  team: {
    ...typography.caption,
    color: '#FFFFFF',
    marginTop: 4,
  },
  rewardPill: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  rewardText: {
    ...typography.captionCaps,
    color: '#FFFFFF',
  },
  qrPlaceholder: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrText: {
    ...typography.caption,
    color: '#FFFFFF',
  },
});

export default PosterCanvas;
