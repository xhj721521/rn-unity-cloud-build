import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { palette } from '@theme/colors';
import { typography } from '@theme/typography';
import { shape, spacing } from '@theme/tokens';

export type TeamTabKey = 'members' | 'announcements' | 'chat';

const TAB_LABELS: Record<TeamTabKey, string> = {
  members: '成员',
  announcements: '公告',
  chat: '聊天',
};

type Props = {
  active: TeamTabKey;
  onChange: (tab: TeamTabKey) => void;
};

export const TeamTabsBar = ({ active, onChange }: Props) => (
  <View style={styles.tabs}>
    {(Object.keys(TAB_LABELS) as TeamTabKey[]).map((key) => {
      const selected = key === active;
      return (
        <Pressable
          key={key}
          style={[styles.tab, selected && styles.tabActive]}
          onPress={() => onChange(key)}
        >
          <Text style={[styles.tabText, selected && styles.tabTextActive]}>{TAB_LABELS[key]}</Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    gap: spacing.cardGap,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tab: {
    flex: 1,
    borderRadius: shape.capsuleRadius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(6,8,18,0.6)',
  },
  tabActive: {
    borderColor: palette.primary,
    backgroundColor: 'rgba(0,209,199,0.15)',
  },
  tabText: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  tabTextActive: {
    color: palette.text,
  },
});
