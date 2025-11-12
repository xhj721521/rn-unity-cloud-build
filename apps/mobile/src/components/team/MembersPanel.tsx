import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { FlashList } from '@shopify/flash-list';
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
  contribWeek?: number;
};

type Props = {
  members: TeamMember[];
  style?: ViewStyle;
  onInvite?: () => void;
  onLeave?: () => void;
};

export const MembersPanel = ({ members, style, onInvite, onLeave }: Props) => (
  <View style={[styles.container, style]}>
    <View style={styles.header}>
      <Text style={styles.headerTitle}>成员列表</Text>
      <Text style={styles.headerHint}>头像 · 名字 · 职务 · 情报</Text>
    </View>
    <View style={styles.listWrapper}>
      <FlashList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MemberPill member={item} style={styles.memberItem} />}
        estimatedItemSize={56}
        showsVerticalScrollIndicator={false}
      />
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

const styles = StyleSheet.create({
  container: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    backgroundColor: 'rgba(6,10,18,0.95)',
    gap: 12,
    flex: 1,
    maxHeight: 420,
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
  listWrapper: {
    flex: 1,
  },
  memberItem: {
    marginBottom: 8,
  },
  bottomBar: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  cta: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
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
