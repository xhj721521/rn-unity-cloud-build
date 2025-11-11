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
  <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]} onPress={onPress}>
    <View style={styles.iconShell}>
      <QuickGlyph id={glyph} size={28} />
    </View>
    <View style={styles.textColumn}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.subtitle} numberOfLines={2}>
        {subtitle}
      </Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    flexBasis: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.25)',
    backgroundColor: 'rgba(5,10,16,0.85)',
    minHeight: 96,
  },
  iconShell: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0,229,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
  },
  title: {
    ...typography.subtitle,
    color: palette.text,
  },
  subtitle: {
    ...typography.caption,
    color: palette.sub,
    marginTop: 4,
  },
});

export default ActionCard;
