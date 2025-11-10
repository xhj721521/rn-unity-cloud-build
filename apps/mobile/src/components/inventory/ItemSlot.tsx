import React from 'react';
import { Alert, Image, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import NeonCard from '@components/NeonCard';
import { rarityGlow } from '@theme/neon';
import { UIItem } from '@mock/inventory';
import { typography } from '@theme/typography';
import RipplePressable from '@components/RipplePressable';

type ItemSlotProps = {
  item?: UIItem;
  onPressEmpty?: () => void;
  onPressItem?: (item: UIItem) => void;
  style?: ViewStyle;
};

export const ItemSlot = ({ item, onPressEmpty, onPressItem, style }: ItemSlotProps) => {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  const handlePress = () => {
    if (item) {
      onPressItem?.(item);
      scale.value = withSpring(0.97, { stiffness: 300 }, () => {
        scale.value = withSpring(1);
      });
      glow.value = withTiming(1, { duration: 120 }, () => {
        glow.value = withTiming(0, { duration: 180 });
      });
    } else {
      onPressEmpty?.() ?? Alert.alert('提示', '空槽位');
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: 0.2 + glow.value * 0.4,
  }));

  if (!item) {
    return (
      <RipplePressable style={[styles.slotPressable, style]} onPress={handlePress}>
        <View style={styles.emptySlot}>
          <Text style={styles.emptyText}>+</Text>
        </View>
      </RipplePressable>
    );
  }

  const glowStyles = rarityGlow(item.rarity);

  return (
    <RipplePressable style={[styles.slotPressable, style]} onPress={handlePress}>
      <Animated.View style={[glowStyles.shadowStyle, animatedStyle]}>
        <NeonCard
          backgroundSource={item.icon}
          overlayColor="rgba(10,16,41,0.54)"
          borderRadius={20}
          borderColors={glowStyles.borderColors}
          innerBorderColors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
          contentPadding={10}
          style={styles.slot}
        >
          <View style={styles.slotContent}>
            <Image source={item.icon} style={styles.itemIcon} resizeMode="contain" />
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.qty}>x{item.qty}</Text>
          </View>
        </NeonCard>
      </Animated.View>
    </RipplePressable>
  );
};

const styles = StyleSheet.create({
  slotPressable: {
    flex: 1,
  },
  slot: {
    flex: 1,
  },
  slotContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  itemIcon: {
    width: '70%',
    height: '70%',
  },
  itemName: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.86)',
  },
  qty: {
    ...typography.captionCaps,
    color: 'rgba(255,255,255,0.9)',
  },
  emptySlot: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,209,199,0.4)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.heading,
    color: 'rgba(0,209,199,0.7)',
  },
});
