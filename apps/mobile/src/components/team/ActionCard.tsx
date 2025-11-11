import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import QuickGlyph, { QuickGlyphId } from '@components/QuickGlyph';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';

type Props = {
  title: string;
  subtitle: string;
  glyph: QuickGlyphId;
  onPress: () => void;
};

export const ActionCard = ({ title, subtitle, glyph, onPress }: Props) => (
  <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]} onPress={onPress}>
    <View style={styles.cardInner}>
      <View style={styles.iconShell}>
        <QuickGlyph id={glyph} size={28} />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {subtitle}
      </Text>
      <View style={styles.tapHint} />
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    flexBasis: '48%',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.25)',
    backgroundColor: 'rgba(5,10,16,0.9)',
    padding: 2,
    minHeight: 128,
  },
  cardInner: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  iconShell: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(0,229,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.subtitle,
    color: palette.text,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.caption,
    color: palette.sub,
    textAlign: 'center',
  },
  tapHint: {
    position: 'absolute',
    bottom: 6,
    left: 16,
    right: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(0,229,255,0.4)',
    opacity: 0.4,
  },
});

export default ActionCard;
