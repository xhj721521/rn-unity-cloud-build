import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { fateColors, fateRadius } from '../fateTheme';
import BlindboxIcon from '@components/icons/BlindboxIcon';

type Props = {
  width: number;
  onPress: () => void;
};

const FateBlindboxCard = ({ width, onPress }: Props) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.pressable,
      { width },
      pressed && { transform: [{ scale: 0.98 }] },
    ]}
  >
    <LinearGradient
      colors={['#071428', '#050814']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, { width }]}
    >
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
    </LinearGradient>
  </Pressable>
);

const styles = StyleSheet.create({
  pressable: {
    borderRadius: fateRadius.bigCard,
    overflow: 'hidden',
  },
  card: {
    flexDirection: 'row',
    borderRadius: fateRadius.bigCard,
    borderWidth: 1,
    borderColor: fateColors.borderSoft,
    padding: 20,
    gap: 16,
    alignItems: 'center',
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
