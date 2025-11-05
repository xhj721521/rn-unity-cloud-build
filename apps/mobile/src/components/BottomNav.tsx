import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NAV_H } from '@theme/metrics';
import QuickGlyph, { QuickGlyphId } from './QuickGlyph';

type TabItem = {
  key: string;
  label: string;
  glyph: QuickGlyphId;
};

const TABS: TabItem[] = [
  { key: 'home', label: '首页', glyph: 'home' },
  { key: 'trial', label: '试炼', glyph: 'trial' },
  { key: 'explore', label: '探索', glyph: 'explore' },
  { key: 'chain', label: '链鉴', glyph: 'chain' },
  { key: 'me', label: '我的', glyph: 'blindbox' },
];

export default function BottomNav({
  active,
  onChange,
}: {
  active: string;
  onChange: (k: string) => void;
}) {
  return (
    <View style={styles.bar}>
      {TABS.map((t) => {
        const selected = t.key === active;
        const colors = selected ? ['#FF77FB', '#6CF2FF'] : ['#7A80A5', '#4F5877'];
        return (
          <Pressable key={t.key} onPress={() => onChange(t.key)} style={styles.item}>
            <QuickGlyph
              id={t.glyph}
              size={23}
              strokeWidth={selected ? 2.1 : 1.6}
              colors={colors as [string, string]}
            />
            <Text style={[styles.label, selected && styles.labelActive]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: NAV_H,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: 'rgba(10, 12, 26, 0.86)',
    borderTopWidth: 1,
    borderColor: 'rgba(92, 100, 255, 0.25)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  item: {
    width: '20%',
    alignItems: 'center',
  },
  label: {
    color: 'rgba(226, 231, 255, 0.66)',
    fontSize: 11,
  },
  labelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
