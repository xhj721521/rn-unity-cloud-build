import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fateColors, fateRadius, fateSpacing } from '../fateTheme';

type FateFeature = {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
};

type Props = {
  features: FateFeature[];
  cardWidth: number;
};

const FateFeatureGrid = ({ features, cardWidth }: Props) => (
  <View style={[styles.grid, { columnGap: fateSpacing.featureGap, rowGap: fateSpacing.featureGap }]}>
    {features.map((feature) => (
      <Pressable
        key={feature.key}
        onPress={feature.onPress}
        style={({ pressed }) => [
          styles.card,
          { width: cardWidth },
          pressed && { transform: [{ scale: 0.97 }] },
        ]}
      >
        <View style={styles.cardInner}>
          <View style={styles.icon}>{feature.icon}</View>
          <Text style={styles.title}>{feature.title}</Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {feature.subtitle}
          </Text>
        </View>
      </Pressable>
    ))}
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    borderRadius: fateRadius.smallCard,
    borderWidth: 1,
    borderColor: fateColors.borderSoft,
    backgroundColor: fateColors.cardBg,
    shadowColor: 'rgba(5, 8, 20, 0.8)',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 2,
  },
  cardInner: {
    padding: 14,
    gap: 10,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(51,245,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    color: fateColors.textPrimary,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    color: fateColors.textSecondary,
    lineHeight: 16,
  },
});

export default FateFeatureGrid;
