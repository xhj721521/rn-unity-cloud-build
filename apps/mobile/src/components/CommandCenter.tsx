import React from 'react';
import { LayoutChangeEvent, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { neonPalette } from '@theme/neonPalette';
import { shape, spacing, typeScale } from '@theme/tokens';
import { SurfaceCard, CapsuleCard } from '../ui/Card';
import PerforatedGrid from '../ui/decor/PerforatedGrid';

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
  const [cardSize, setCardSize] = React.useState({ width: 0, height: 0 });

  const handleLayout = React.useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setCardSize((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height },
    );
  }, []);

  const showGrid = cardSize.width > 0 && cardSize.height > 0;

  return (
    <SurfaceCard style={styles.surface}>
      <View style={styles.surfaceContent} onLayout={handleLayout}>
        {showGrid ? (
          <PerforatedGrid width={cardSize.width} height={cardSize.height} align="tr" />
        ) : null}
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
      </View>
    </SurfaceCard>
  );
};

const ResourceCapsuleView = ({ resource }: { resource: ResourceCapsule }) => {
  const { label, value, unit, accentColor, isOnline } = resource;
  return (
    <CapsuleCard style={styles.capsule}>
      <View style={styles.capsuleContent}>
        <View style={styles.resourceMeta}>
          <View
            style={[
              styles.resourceDot,
              { backgroundColor: accentColor, opacity: isOnline === false ? 0.4 : 1 },
            ]}
          />
          <Text style={styles.resourceLabel}>{label}</Text>
        </View>
        <View style={styles.resourceValueRow}>
          <Text style={styles.resourceValue} numberOfLines={1} ellipsizeMode="tail">
            {value}
          </Text>
          <Text style={styles.resourceUnit}>{unit}</Text>
        </View>
      </View>
    </CapsuleCard>
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
  surface: {
    position: 'relative',
  },
  surfaceContent: {
    position: 'relative',
    paddingBottom: spacing.section,
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
    color: '#EAEAFB',
    fontSize: 18,
    fontWeight: '700',
  },
  identityText: {
    gap: 4,
  },
  displayName: {
    ...typeScale.title,
    color: '#EAEAFB',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: 'rgba(234,234,251,0.78)',
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
  capsule: {
    flex: 1,
    minHeight: 56,
  },
  capsuleContent: {
    flex: 1,
    justifyContent: 'space-between',
    gap: spacing.grid,
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.grid / 2,
  },
  resourceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  resourceLabel: {
    ...typeScale.caption,
    color: 'rgba(234,234,251,0.78)',
    letterSpacing: 0.4,
  },
  resourceValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  resourceValue: {
    color: '#EAEAFB',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.2,
    paddingBottom: Platform.OS === 'android' ? 1 : 0,
  },
  resourceUnit: {
    color: 'rgba(234,234,251,0.78)',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.4,
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
});
