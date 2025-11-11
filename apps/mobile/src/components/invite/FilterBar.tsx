import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';

export type InviteFilterTab = 'all' | 'pending' | 'joined' | 'expired';

type FilterBarProps = {
  value: InviteFilterTab;
  onChange: (tab: InviteFilterTab) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortLabel: string;
  onPressSort: () => void;
};

const TAB_ITEMS: Array<{ key: InviteFilterTab; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待确认' },
  { key: 'joined', label: '已加入' },
  { key: 'expired', label: '已过期' },
];

export const FilterBar = ({
  value,
  onChange,
  searchValue,
  onSearchChange,
  sortLabel,
  onPressSort,
}: FilterBarProps) => (
  <View style={styles.container}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabRow}
    >
      {TAB_ITEMS.map((tab) => {
        const active = tab.key === value;
        return (
          <Pressable
            key={tab.key}
            style={[styles.tab, active && styles.tabActive]}
            onPress={() => onChange(tab.key)}
          >
            <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
    <View style={styles.tools}>
      <TextInput
        style={styles.searchInput}
        placeholder="搜索昵称..."
        placeholderTextColor="rgba(230,241,255,0.5)"
        value={searchValue}
        onChangeText={onSearchChange}
      />
      <Pressable style={styles.sortButton} onPress={onPressSort}>
        <Text style={styles.sortText}>{sortLabel}</Text>
      </Pressable>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  tabRow: {
    gap: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  tabActive: {
    borderColor: '#00E5FF',
    backgroundColor: 'rgba(0,229,255,0.12)',
  },
  tabText: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  tabTextActive: {
    color: '#00E5FF',
  },
  tools: {
    flexDirection: 'row',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 14,
    color: palette.text,
  },
  sortButton: {
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    height: 42,
  },
  sortText: {
    ...typography.captionCaps,
    color: palette.text,
  },
});

export default FilterBar;
