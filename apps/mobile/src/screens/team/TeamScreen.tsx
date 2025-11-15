import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuickGlyph from '@components/QuickGlyph';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import teamSummary from '@mock/team.summary.json';
import membersData from '@mock/team.members.json';
import { Member } from '@mock/team.members';
import { typography } from '@theme/typography';

const gradientColors = ['#050A18', '#08152F', '#042D4A'];

export const TeamScreen = () => {
  const [chatVisible, setChatVisible] = useState(false);
  const [chatDraft, setChatDraft] = useState('');
  const members = membersData.members as Member[];
  const tabBarHeight = useBottomTabBarHeight?.() ?? 0;

  const memberList = useMemo(
    () =>
      members.map((member) => ({
        ...member,
        initials: member.name.charAt(0).toUpperCase(),
      })),
    [members],
  );

  return (
    <View style={styles.root}>
      <LinearGradient colors={gradientColors} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: tabBarHeight + 180 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <TeamHeaderCard onPressChat={() => setChatVisible(true)} />
          <TeamQuickActions />
          <TeamMembersCard members={memberList} />
        </ScrollView>
        <TeamBottomActions />
      </SafeAreaView>
      <ChatComposer
        visible={chatVisible}
        value={chatDraft}
        onChange={setChatDraft}
        onClose={() => setChatVisible(false)}
      />
    </View>
  );
};

const TeamHeaderCard = ({ onPressChat }: { onPressChat: () => void }) => {
  const { team } = teamSummary;
  const expRemaining = Math.max(team.next - team.exp, 0);
  const progressText = `Lv.${team.level}  距上一级还差 ${expRemaining} / ${team.next}`;
  const membersText = `队员 ${team.online} / ${team.cap}`;
  const progressRatio = team.exp / team.next;

  return (
    <View style={styles.headerCard}>
      <View style={styles.headerTopRow}>
        <View style={styles.teamAvatar}>
          <Text style={styles.teamAvatarText}>{team.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.headerTextBlock}>
          <Text style={styles.headerTitle}>{team.name}</Text>
          <Text style={styles.headerSubtitle}>{progressText}</Text>
          <Text style={styles.headerSubtitle}>{membersText}</Text>
        </View>
        <Pressable style={styles.chatButton} onPress={onPressChat}>
          <Text style={styles.chatButtonText}>团队聊天</Text>
        </Pressable>
      </View>
      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>当前进度</Text>
        <Text style={styles.progressValue}>
          {team.exp} / {team.next}
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.min(progressRatio * 100, 100)}%` }]} />
      </View>
    </View>
  );
};

const quickActions = [
  {
    key: 'map',
    title: '团队地图',
    subtitle: `今日 ${teamSummary.maps.opened} / ${teamSummary.maps.quota}`,
  },
  {
    key: 'dungeon',
    title: '团队副本',
    subtitle: `剩余 ${teamSummary.raid.attemptsLeft} / ${teamSummary.raid.total}`,
  },
  { key: 'storage', title: '团队仓库', subtitle: '查看物资' },
  { key: 'notice', title: '团队公告', subtitle: '查看 / 发布' },
];

const TeamQuickActions = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>团队功能</Text>
    <View style={styles.quickGrid}>
      {quickActions.map((action) => (
        <Pressable key={action.key} style={styles.quickCard}>
          <Text style={styles.quickTitle}>{action.title}</Text>
          <Text style={styles.quickSubtitle}>{action.subtitle}</Text>
        </Pressable>
      ))}
    </View>
  </View>
);

const TeamMembersCard = ({ members }: { members: Array<Member & { initials: string }> }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>成员列表</Text>
    <Text style={styles.sectionHint}>头像 · 名字 · 职务 · 情报</Text>
    <View style={styles.membersWrapper}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {members.map((member) => (
          <View key={member.id} style={styles.memberRow}>
            <View style={styles.memberAvatar}>
              <Text style={styles.memberAvatarText}>{member.initials}</Text>
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>
                {member.role === 'leader' ? '队长' : member.role === 'officer' ? '副官' : '成员'} ·{' '}
                {member.online ? '在线' : `离线 ${member.lastSeen}`}
              </Text>
            </View>
            <View style={styles.memberStatus}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: member.online ? '#33F5FF' : 'rgba(255,255,255,0.3)' },
                ]}
              />
              <View style={styles.intelBadge}>
                <Text style={styles.intelBadgeText}>情报 {member.contribWeek ?? 0}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  </View>
);

const TeamBottomActions = () => (
  <View style={styles.bottomActions}>
    <Pressable style={[styles.bottomButton, styles.bottomPrimary]}>
      <Text style={styles.bottomPrimaryText}>邀请</Text>
    </Pressable>
    <Pressable style={[styles.bottomButton, styles.bottomDanger]}>
      <Text style={styles.bottomDangerText}>离队</Text>
    </Pressable>
  </View>
);

type ComposerProps = {
  visible: boolean;
  value: string;
  onChange: (text: string) => void;
  onClose: () => void;
};

const ChatComposer = ({ visible, value, onChange, onClose }: ComposerProps) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.modalBackdrop}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalCard}
      >
        <Text style={styles.modalTitle}>团队聊天（占位）</Text>
        <TextInput
          style={styles.modalInput}
          placeholder="发送一条团队消息..."
          placeholderTextColor="rgba(255,255,255,0.4)"
          multiline
          autoFocus
          value={value}
          onChangeText={onChange}
        />
        <View style={styles.modalActions}>
          <Pressable style={[styles.modalButton, styles.modalGhost]} onPress={onClose}>
            <Text style={styles.modalGhostText}>取消</Text>
          </Pressable>
          <Pressable style={[styles.modalButton, styles.modalPrimary]} onPress={onClose}>
            <Text style={styles.modalPrimaryText}>发送</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 20,
  },
  headerCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(5,9,15,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.25)',
    padding: 18,
    shadowColor: '#00FFFF',
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  teamAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  teamAvatarText: {
    ...typography.heading,
    color: '#FFFFFF',
  },
  headerTextBlock: {
    flex: 1,
    gap: 4,
  },
  headerTitle: {
    ...typography.heading,
    color: '#FFFFFF',
  },
  headerSubtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.75)',
  },
  chatButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.5)',
    backgroundColor: 'rgba(0,255,255,0.12)',
  },
  chatButtonText: {
    color: '#33F5FF',
    fontWeight: '600',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  progressLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
  },
  progressValue: {
    ...typography.caption,
    color: '#FFFFFF',
  },
  progressTrack: {
    marginTop: 6,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#33F5FF',
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sectionHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  quickCard: {
    width: '48%',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.18)',
    backgroundColor: 'rgba(5,8,18,0.78)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#00FFFF',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  quickTitle: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  quickSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.72)',
    marginTop: 6,
  },
  membersWrapper: {
    height: 300,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.18)',
    backgroundColor: 'rgba(5,8,18,0.78)',
    padding: 12,
    shadowColor: '#00FFFF',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginBottom: 8,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(51,245,255,0.15)',
  },
  memberAvatarText: {
    ...typography.subtitle,
    color: '#FFFFFF',
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  memberName: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  memberRole: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 4,
  },
  memberStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  intelBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.3)',
    backgroundColor: 'rgba(0,255,255,0.08)',
  },
  intelBadgeText: {
    fontSize: 12,
    color: '#33F5FF',
  },
  bottomActions: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    gap: 12,
  },
  bottomButton: {
    flex: 1,
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomPrimary: {
    backgroundColor: '#33F5FF',
  },
  bottomPrimaryText: {
    color: '#041024',
    fontWeight: '700',
  },
  bottomDanger: {
    borderWidth: 1,
    borderColor: 'rgba(255,92,92,0.8)',
    backgroundColor: 'rgba(255,92,92,0.08)',
  },
  bottomDangerText: {
    color: '#FF5C5C',
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.35)',
    padding: 20,
    backgroundColor: 'rgba(3,8,16,0.95)',
    gap: 16,
  },
  modalTitle: {
    ...typography.subtitle,
    color: '#FFFFFF',
  },
  modalInput: {
    minHeight: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 12,
    color: '#FFFFFF',
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  modalGhost: {
    borderColor: 'rgba(255,255,255,0.3)',
  },
  modalPrimary: {
    borderColor: '#00E5FF',
    backgroundColor: 'rgba(0,229,255,0.1)',
  },
  modalGhostText: {
    ...typography.subtitle,
    color: '#FFFFFF',
  },
  modalPrimaryText: {
    ...typography.subtitle,
    color: '#00E5FF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TeamScreen;
