import React, { useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import MemberPill from './MemberPill';
import { palette } from '@theme/colors';
import { typography } from '@theme/typography';

type TeamMember = {
  id: string;
  name: string;
  role: 'leader' | 'officer' | 'member';
  online: boolean;
  avatar?: string;
  intelToday?: number;
};

type Props = {
  members: TeamMember[];
  onInvite?: () => void;
  onLeave?: () => void;
};

const COLUMN_GAP = 12;

export const MembersPanel = ({ members, onInvite, onLeave }: Props) => {
  const [gridWidth, setGridWidth] = useState(0);

  const paddedMembers = useMemo(() => {
    const source = [...members];
    while (source.length % 2 !== 0) {
      source.push(undefined as unknown as TeamMember);
    }
    return source;
  }, [members]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const nextWidth = event.nativeEvent.layout.width;
      if (nextWidth && Math.abs(nextWidth - gridWidth) > 1) {
        setGridWidth(nextWidth);
      }
    },
    [gridWidth],
  );

  const cardWidth = gridWidth > 0 ? (gridWidth - COLUMN_GAP) / 2 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>成员列表</Text>
        <Text style={styles.headerHint}>头像 · 名字 · 职务 · 今日情报</Text>
      </View>
      <View
        style={[styles.grid, { columnGap: COLUMN_GAP, rowGap: COLUMN_GAP }]}
        onLayout={handleLayout}
      >
        {cardWidth > 0
          ? paddedMembers.map((member, index) =>
              member ? (
                <MemberPill
                  key={member.id}
                  member={member}
                  style={{ width: cardWidth }}
                  onPress={() => {}}
                  onLongPress={() => {}}
                />
              ) : (
                <View key={`empty-${index}`} style={[styles.placeholder, { width: cardWidth }]}>
                  <Text style={styles.placeholderPlus}>+</Text>
                </View>
              ),
            )
          : null}
      </View>
      <View style={styles.bottomBar}>
        <Pressable style={[styles.cta, styles.invite]} onPress={onInvite}>
          <Text style={styles.ctaText}>邀请</Text>
        </Pressable>
        <Pressable style={[styles.cta, styles.leave]} onPress={onLeave}>
          <Text style={styles.leaveText}>离队</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.2)',
    padding: 12,
    backgroundColor: 'rgba(8,12,18,0.92)',
    gap: 12,
  },
  header: {
    gap: 4,
  },
  headerTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  headerHint: {
    ...typography.caption,
    color: palette.sub,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  placeholder: {
    height: 92,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderPlus: {
    color: 'rgba(0,229,255,0.7)',
    fontSize: 20,
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cta: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  invite: {
    backgroundColor: '#00E5FF',
  },
  leave: {
    borderWidth: 1,
    borderColor: '#FF5C7A',
  },
  ctaText: {
    ...typography.subtitle,
    color: '#041016',
  },
  leaveText: {
    ...typography.subtitle,
    color: '#FF5C7A',
  },
});

export default MembersPanel;
