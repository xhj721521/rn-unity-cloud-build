import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { fateColors, fateRadius } from '../fateTheme';
import BlindboxIcon from '@components/icons/BlindboxIcon';

type Props = {
  width: number;
  onPress: () => void;
};

const cardIllustration = require('../../../assets/cards/card_blindbox.webp');

const FateBlindboxCard = ({ width, onPress }: Props) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.pressable,
      { width },
      pressed && { transform: [{ scale: 0.97 }] },
    ]}
  >
    <ImageBackground
      source={cardIllustration}
      resizeMode="cover"
      style={[styles.card, { width }]}
      imageStyle={styles.cardImage}
    >
      <LinearGradient
        colors={['rgba(5,8,20,0.92)', 'rgba(5,8,20,0.3)']}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.copy}>
        <Text style={styles.label}>命运盲盒 & 矿工</Text>
        <Text style={styles.title}>管理矿工 · 开启命运盲盒</Text>
        <Text style={styles.desc}>
          升级团队矿工，提升团队地图收益；消耗矿石与 ARC 抽取命运加成与外观；所有结果将记录在命运档案中。
        </Text>
      </View>
      <View style={styles.side}>
        <BlindboxIcon size={48} />
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.buttonText}>前往盲盒 & 矿工</Text>
        </Pressable>
        <View style={styles.priceChip}>
          <Text style={styles.priceText}>单次 200 ARC</Text>
        </View>
      </View>
    </ImageBackground>
  </Pressable>
);

const styles = StyleSheet.create({
  pressable: {
    borderRadius: fateRadius.bigCard,
    overflow: 'hidden',
  },
  card: {
    borderRadius: fateRadius.bigCard,
    borderWidth: 1,
    borderColor: fateColors.borderSoft,
    flexDirection: 'row',
    padding: 20,
    gap: 18,
    alignItems: 'center',
  },
  cardImage: {
    borderRadius: fateRadius.bigCard,
  },
  copy: {
    flex: 1,
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: fateColors.textMuted,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 20,
    color: fateColors.textPrimary,
    fontWeight: '700',
  },
  desc: {
    fontSize: 12,
    lineHeight: 18,
    color: fateColors.textSecondary,
  },
  side: {
    width: '38%',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    borderRadius: fateRadius.chip,
    backgroundColor: fateColors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    color: fateColors.bg,
    fontSize: 14,
    fontWeight: '600',
  },
  priceChip: {
    borderRadius: fateRadius.chip,
    borderWidth: 1,
    borderColor: fateColors.borderSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  priceText: {
    fontSize: 12,
    color: fateColors.textSecondary,
  },
});

export default FateBlindboxCard;
