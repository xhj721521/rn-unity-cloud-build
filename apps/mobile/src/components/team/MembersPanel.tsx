import React, { useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import MemberPill from './MemberPill';
import { palette } from '@theme/colors';
import { typography } from '@theme/typography';

type TeamMember = {
  id: string;
  name: string;
  role: 'leader' | 'officer' | 'member';
  online: boolean;
  avatar?: string;
  intelToday: number;
  intelTotal: number;
};

type Props = {
  members: TeamMember[];
  onInvite?: () => void;
  onLeave?: () => void;
};

export const MembersPanel = ({ members, onInvite, onLeave }: Props) => {
  const [metric, setMetric] = useState<'today' | 'total'>('today');
  const listRef = useRef<FlatList<TeamMember>>(null);

  const data = useMemo(() => members, [members]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>成员列表</Text>
        <View style={styles.segmentRow}>
          {(['today', 'total'] as const).map((key) => {
            const active = key === metric;
            return (
              <Pressable
                key={key}
                style={[styles.segmentChip, active && styles.segmentActive]}
                onPress={() => setMetric(key)}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                  {key === 'today' ? '今日' : '总计'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        nestedScrollEnabled
        initialNumToRender={12}
        windowSize={9}
        getItemLayout={(_, index) => ({
          length: 100,
          offset: 100 * index,
          index,
        })}
        renderItem={({ item }) => (
          <MemberPill member={item} metricMode={metric} onPress={() => {}} onLongPress={() => {}} />
        )}
        style={styles.list}
      />
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
    height: 440,
    backgroundColor: 'rgba(8,12,18,0.92)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 6,
  },
  segmentChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  segmentActive: {
    borderColor: '#00E5FF',
    backgroundColor: 'rgba(0,229,255,0.15)',
  },
  segmentText: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  segmentTextActive: {
    color: '#00E5FF',
  },
  list: {
    flex: 1,
  },
  column: {
    gap: 10,
    marginBottom: 10,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
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
