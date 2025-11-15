import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { fateColors, fateRadius, fateSpacing } from '../fateTheme';

export type FateModeAction = {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: [string, string];
  onPress: () => void;
};

type Props = {
  actions: FateModeAction[];
};

const FateModePills = ({ actions }: Props) => (
  <View style={styles.container}>
    {actions.map((action) => (
      <Pressable
        key={action.key}
        onPress={action.onPress}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <LinearGradient
          colors={action.gradient}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.button}
        >
          <View style={styles.icon}>{action.icon}</View>
          <View style={styles.textBlock}>
            <Text style={styles.title}>{action.title}</Text>
            <Text style={styles.subtitle}>{action.subtitle}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </LinearGradient>
      </Pressable>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: fateSpacing.featureGap + 4,
  },
  pressable: {
    borderRadius: fateRadius.chip,
    overflow: 'hidden',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  button: {
    minHeight: 56,
    borderRadius: fateRadius.chip,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    shadowColor: 'rgba(8, 12, 24, 0.8)',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 9,
    elevation: 3,
  },
  icon: {
    width: 36,
    alignItems: 'center',
  },
  textBlock: {
    flex: 1,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 16,
    color: fateColors.textPrimary,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    color: fateColors.textSecondary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: fateColors.textPrimary,
    fontWeight: '300',
  },
});

export default FateModePills;
