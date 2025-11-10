import React, { useMemo } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import BadgeChip from '@components/shared/BadgeChip';
import { Pressable } from 'react-native';
import { translate as t } from '@locale/strings';
import { teamTokens } from '@theme/tokens.team';

export type RosterFilterKey = 'all' | 'online' | 'offline' | 'leader' | 'officer';

const FILTERS: Array<{ key: RosterFilterKey; label: string }> = [
  { key: 'all', label: t('filter.all', '全部') },
  { key: 'online', label: t('filter.online', '在线') },
  { key: 'offline', label: t('filter.offline', '离线') },
  { key: 'leader', label: t('filter.leader', '队长') },
  { key: 'officer', label: t('filter.officer', '副官') },
];

type Props = {
  value: RosterFilterKey;
  onChange: (key: RosterFilterKey) => void;
  keyword: string;
  onKeywordChange: (text: string) => void;
};

export const RosterFilterBar = ({ value, onChange, keyword, onKeywordChange }: Props) => {
  const chips = useMemo(() => FILTERS, []);

  return (
    <View style={styles.container}>
      <View style={styles.chipRow}>
        {chips.map((chip) => (
          <Pressable key={chip.key} onPress={() => onChange(chip.key)}>
            <BadgeChip
              label={chip.label}
              tone={chip.key === value ? 'online' : 'default'}
              style={styles.chip}
              testID={`filter-${chip.key}`}
            />
          </Pressable>
        ))}
      </View>
      <TextInput
        placeholder={t('team.search.placeholder', '输入成员姓名')}
        placeholderTextColor="rgba(255,255,255,0.4)"
        style={styles.input}
        value={keyword}
        onChangeText={onKeywordChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
  },
  input: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(12,16,32,0.85)',
    color: teamTokens.colors.textMain,
  },
});

export default RosterFilterBar;
