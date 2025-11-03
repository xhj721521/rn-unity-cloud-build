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
  accentColor: string;
  isOnline?: boolean;
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
      colors={['rgba(26, 18, 56, 0.96)', 'rgba(10, 10, 34, 0.94)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.body}>
        <View style={styles.headerRow}>
          <View style={styles.identityColumn}>
            <View style={styles.identityBlock}>
              <View style={styles.avatar}>
                <Text style={styles.avatarLabel}>{avatarInitial}</Text>
              </View>
              <View style={styles.identityText}>
                <Text style={styles.displayName}>{displayName}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
              </View>
            </View>
            <View style={styles.connectionChip} accessibilityElementsHidden>
              <View style={styles.connectionDot} />
              <Text style={styles.connectionLabel}>{connectionLabel}</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="打开设置"
            onPress={onPressSettings}
            style={styles.settingsButton}
          >
            <GearIcon />
          </Pressable>
        </View>
        <View style={styles.resourceRow}>
          {resources.map((resource) => (
            <ResourceCapsuleView key={resource.id} resource={resource} />
          ))}
        </View>
      </View>
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.topSheen}
      />
    </LinearGradient>
  );
};

const ResourceCapsuleView = ({ resource }: { resource: ResourceCapsule }) => {
  const { label, value, unit, accentColor, isOnline } = resource;
  return (
    <View style={styles.resourceCapsule}>
      <View style={styles.resourceMeta}>
        <View
          style={[
            styles.resourceDot,
            { backgroundColor: accentColor, opacity: isOnline === false ? 0.4 : 1 },
          ]}
        />
        <Text style={styles.resourceLabel}>{label}</Text>
      </View>
      <Text style={styles.resourceValue} numberOfLines={1}>
        {value}
        <Text style={styles.resourceUnit}> {unit}</Text>
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

const styles = StyleSheet.create({
  container: {
    borderRadius: shape.blockRadius,
    padding: spacing.section,
    borderWidth: 1,
    borderColor: 'rgba(122, 108, 230, 0.4)',
    overflow: 'hidden',
    ...shadowStyles.card,
    shadowOpacity: 0.26,
    shadowRadius: 18,
    elevation: 9,
  },
  body: {
    gap: spacing.cardGap,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.section,
  },
  identityColumn: {
    flex: 1,
    gap: spacing.cardGap,
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
    ...typeScale.body,
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
    gap: spacing.cardGap,
  },
  resourceCapsule: {
    flex: 1,
    height: 56,
    borderRadius: shape.capsuleRadius,
    borderWidth: 1,
    borderColor: 'rgba(132, 120, 255, 0.4)',
    backgroundColor: 'rgba(16, 14, 46, 0.85)',
    paddingHorizontal: spacing.section,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resourceMeta: {
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
  resourceValue: {
    color: neonPalette.textPrimary,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.2,
  },
  resourceUnit: {
    color: neonPalette.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  connectionChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.grid / 2,
    paddingHorizontal: spacing.section,
    paddingVertical: spacing.grid / 2,
    borderRadius: shape.capsuleRadius,
    backgroundColor: 'rgba(48, 116, 78, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(76, 217, 100, 0.28)',
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
  topSheen: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    height: 36,
    borderTopLeftRadius: shape.blockRadius - 1,
    borderTopRightRadius: shape.blockRadius - 1,
  },
});
