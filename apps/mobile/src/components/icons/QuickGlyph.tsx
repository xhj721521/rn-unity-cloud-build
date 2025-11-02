import React from 'react';
import { StyleSheet, View } from 'react-native';

export type QuickGlyphType =
  | 'Leaderboard'
  | 'Forge'
  | 'Marketplace'
  | 'EventShop';

type QuickGlyphProps = {
  type: QuickGlyphType;
  accent: string;
};

export const QuickGlyph = ({ type, accent }: QuickGlyphProps) => (
  <View style={styles.iconWrap}>
    {type === 'Leaderboard' && (
      <>
        <View style={[styles.trophyCup, { borderColor: accent }]} />
        <View style={[styles.trophyStem, { backgroundColor: accent }]} />
      </>
    )}
    {type === 'Forge' && (
      <>
        <View style={[styles.hammerHead, { backgroundColor: accent }]} />
        <View style={[styles.hammerHandle, { backgroundColor: accent }]} />
      </>
    )}
    {type === 'Marketplace' && (
      <>
        <View style={[styles.tag, { borderColor: accent }]} />
        <View style={[styles.tagHole, { borderColor: accent }]} />
      </>
    )}
    {type === 'EventShop' && (
      <>
        <View style={[styles.giftLid, { backgroundColor: accent }]} />
        <View style={[styles.giftBox, { borderColor: accent }]} />
      </>
    )}
  </View>
);

const styles = StyleSheet.create({
  iconWrap: {
    width: 28,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyCup: {
    width: 22,
    height: 12,
    borderWidth: 2,
    borderRadius: 6,
    borderBottomWidth: 2,
  },
  trophyStem: {
    width: 8,
    height: 8,
    borderRadius: 3,
    marginTop: 2,
  },
  hammerHead: {
    width: 20,
    height: 8,
    borderRadius: 4,
  },
  hammerHandle: {
    width: 5,
    height: 12,
    borderRadius: 3,
    marginTop: 2,
  },
  tag: {
    width: 20,
    height: 14,
    borderWidth: 2,
    borderRadius: 4,
    transform: [{ rotate: '-12deg' }],
  },
  tagHole: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 2,
    position: 'absolute',
    top: 4,
    right: 5,
  },
  giftLid: {
    width: 20,
    height: 4,
    borderRadius: 2,
  },
  giftBox: {
    width: 20,
    height: 12,
    borderRadius: 4,
    borderWidth: 2,
    marginTop: 3,
  },
});
