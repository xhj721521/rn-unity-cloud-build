import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { neonPalette } from '@theme/neonPalette';
import { shadowStyles, shape, spacing, typeScale } from '@theme/tokens';

type ResourceCapsule = {
  id: string;
  label: string;
  value: string;
  unit: string;
  description: string;
  accentColor: string;
  isOnline?: boolean;
  progress?: number;
};

type CommandCenterProps = {
  displayName: string;
  subtitle: string;
  avatarInitial: string;
  onPressSettings: () => void;
  resources: readonly [ResourceCapsule, ResourceCapsule];
  connectionLabel: string;
};

export const CommandCenter = ({
  displayName,
  subtitle,
  avatarInitial,
  onPressSettings,
  resources,
  connectionLabel,
}: CommandCenterProps) => {
  return (
    <LinearGradient
      colors={['rgba(24, 18, 54, 0.92)', 'rgba(11, 12, 36, 0.96)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.topRow}>
        <View style={styles.identityBlock}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLabel}>{avatarInitial}</Text>
          </View>
          <View style={styles.identityText}>
            <Text style={styles.displayName}>{displayName}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>
        <Pressable accessibilityRole="button" onPress={onPressSettings} style={styles.settingsButton}>
          <GearIcon />
        </Pressable>
      </View>
      <View style={styles.resourceRow}>
        {resources.map((resource) => (
          <ResourceCapsuleView key={resource.id} resource={resource} />
        ))}
      </View>
      <View style={styles.connectionChip}>
        <View style={styles.connectionDot} />
        <Text style={styles.connectionLabel}>{connectionLabel}</Text>
      </View>
    </LinearGradient>
  );
};

const ResourceCapsuleView = ({ resource }: { resource: ResourceCapsule }) => {
  const { label, value, unit, description, accentColor, progress, isOnline } = resource;
  return (
    <View style={styles.resourceCapsule}>
      <View style={styles.resourceHeader}>
        <View style={styles.resourceLabelRow}>
          <View
            style={[
              styles.resourceDot,
              { backgroundColor: accentColor, opacity: isOnline === false ? 0.4 : 1 },
            ]}
          />
          <Text style={styles.resourceLabel}>{label}</Text>
        </View>
        {typeof progress === 'number' ? (
          <View style={styles.resourceProgress}>
            <CircularProgress value={progress} tint={accentColor} />
          </View>
        ) : null}
      </View>
      <View style={styles.resourceValueRow}>
        <Text style={styles.resourceValue}>{value}</Text>
        <Text style={styles.resourceUnit}>{unit}</Text>
      </View>
      <Text style={styles.resourceDescription} numberOfLines={2}>
        {description}
      </Text>
    </View>
  );
};

const GearIcon = () => (
  <View style={styles.gearShell}>
    <View style={styles.gearCore} />
    <View style={[styles.gearSpoke, styles.gearSpokeVertical]} />
    <View style={[styles.gearSpoke, styles.gearSpokeDiagonalA]} />
    <View style={[styles.gearSpoke, styles.gearSpokeDiagonalB]} />
  </View>
);

const CircularProgress = ({ value, tint }: { value: number; tint: string }) => {
  const clamped = Math.max(0, Math.min(1, value));
  const rotation = `${clamped * 360}deg`;
  const transforms = [{ translateX: -1 }, { rotate: rotation }, { translateX: 1 }];
  return (
    <View style={[styles.progressBase, { borderColor: `${tint}55` }]}
    >
      <View style={[styles.progressPointer, { backgroundColor: tint, transform: transforms }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: shape.blockRadius,
    padding: spacing.section,
    gap: spacing.section,
    borderWidth: 1,
    borderColor: 'rgba(88, 74, 180, 0.45)',
    ...shadowStyles.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  identityBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.cardGap,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(132, 108, 255, 0.6)',
    backgroundColor: 'rgba(18, 16, 44, 0.92)',
  },
  avatarLabel: {
    color: neonPalette.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  identityText: {
    gap: 4,
  },
  displayName: {
    ...typeScale.title,
    color: neonPalette.textPrimary,
  },
  subtitle: {
    ...typeScale.caption,
    color: neonPalette.textSecondary,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: shape.buttonRadius,
    borderWidth: 1,
    borderColor: 'rgba(108, 96, 210, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(20, 18, 46, 0.85)',
  },
  resourceRow: {
    flexDirection: 'row',
    gap: spacing.section,
  },
  resourceCapsule: {
    flex: 1,
    borderRadius: shape.capsuleRadius,
    padding: spacing.cardGap,
    borderWidth: 1,
    borderColor: 'rgba(101, 82, 200, 0.3)',
    backgroundColor: 'rgba(14, 16, 38, 0.92)',
    gap: spacing.cardGap / 2,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resourceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.grid / 2,
  },
  resourceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  resourceLabel: {
    ...typeScale.caption,
    color: neonPalette.textPrimary,
    letterSpacing: 0.4,
  },
  resourceProgress: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.grid / 2,
  },
  resourceValue: {
    color: neonPalette.textPrimary,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  resourceUnit: {
    color: neonPalette.textSecondary,
    ...typeScale.caption,
  },
  resourceDescription: {
    color: neonPalette.textMuted,
    ...typeScale.caption,
  },
  connectionChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.grid / 2,
    paddingHorizontal: spacing.section,
    paddingVertical: spacing.grid / 2,
    borderRadius: shape.capsuleRadius,
    backgroundColor: 'rgba(48, 116, 78, 0.24)',
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CD964',
  },
  connectionLabel: {
    ...typeScale.caption,
    color: '#D8FFE6',
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  gearShell: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(154, 146, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gearCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(154, 146, 255, 0.9)',
  },
  gearSpoke: {
    position: 'absolute',
    width: 2,
    height: 12,
    backgroundColor: 'rgba(154, 146, 255, 0.9)',
  },
  gearSpokeVertical: {
    transform: [{ rotate: '0deg' }],
  },
  gearSpokeDiagonalA: {
    transform: [{ rotate: '60deg' }],
  },
  gearSpokeDiagonalB: {
    transform: [{ rotate: '-60deg' }],
  },
  progressBase: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  progressPointer: {
    position: 'absolute',
    width: 2,
    height: 6,
    top: 2,
    left: 7,
    borderRadius: 1,
  },
});
