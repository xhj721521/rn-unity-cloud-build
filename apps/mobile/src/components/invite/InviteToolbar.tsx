import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import RipplePressable from '@components/RipplePressable';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';
import { translate as t } from '@locale/strings';

export type InviteFilter = 'all' | 'pending' | 'joined' | 'expired';

type InviteToolbarProps = {
  filter: InviteFilter;
  onFilterChange: (filter: InviteFilter) => void;
  onSearchPress: () => void;
  onSortPress: () => void;
  sortLabel: string;
};

const FILTER_OPTIONS: Array<{ key: InviteFilter; label: string }> = [
  { key: 'all', label: t('invite.tabs.all', '全部') },
  { key: 'pending', label: t('invite.tabs.pending', '待确认') },
  { key: 'joined', label: t('invite.tabs.joined', '已加入') },
  { key: 'expired', label: t('invite.tabs.expired', '已过期') },
];

export const InviteToolbar = ({
  filter,
  onFilterChange,
  onSearchPress,
  onSortPress,
  sortLabel,
}: InviteToolbarProps) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        {FILTER_OPTIONS.map((option) => {
          const active = filter === option.key;
          return (
            <RipplePressable
              key={option.key}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onFilterChange(option.key)}
            >
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                {option.label}
              </Text>
            </RipplePressable>
          );
        })}
      </ScrollView>

      <View style={styles.actionRow}>
        <RipplePressable style={styles.searchBox} onPress={onSearchPress}>
          <Text style={styles.searchPlaceholder}>
            {t('invite.placeholder', '发起搜索（占位）')}
          </Text>
        </RipplePressable>
        <RipplePressable style={styles.sortBtn} onPress={onSortPress}>
          <Text style={styles.sortText}>{sortLabel}</Text>
        </RipplePressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  chipScroll: {
    marginBottom: 12,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    marginRight: 8,
    backgroundColor: 'rgba(9,12,26,0.6)',
  },
  chipActive: {
    borderColor: 'rgba(0,255,209,0.7)',
    shadowColor: '#00FFD1',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  chipLabel: {
    ...typography.caption,
    color: palette.sub,
  },
  chipLabelActive: {
    color: palette.text,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  searchBox: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(7,11,22,0.8)',
  },
  searchPlaceholder: {
    ...typography.caption,
    color: palette.muted,
  },
  sortBtn: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,255,209,0.55)',
    paddingHorizontal: 16,
    minWidth: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortText: {
    ...typography.captionCaps,
    color: palette.text,
  },
});

export default InviteToolbar;
