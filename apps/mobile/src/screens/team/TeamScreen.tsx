import React, { useMemo, useState } from 'react';
import {
  Image,
  ImageStyle,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import teamSummary from '@mock/team.summary.json';
import membersData from '@mock/team.members.json';
import { Member } from '@mock/team.members';
import { teamWarehouseItems } from '@mock/teamWarehouse';
import { typography } from '@theme/typography';
import { ProfileStackParamList } from '@app/navigation/types';

const gradientColors = ['#050A18', '#08152F', '#042D4A'];

type DisplayMember = {
  id: string;
  name: string;
  roleLabel: string;
  onlineStatus: 'online' | 'offline';
  intel: number;
};

export const TeamScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const tabBarHeight = useBottomTabBarHeight?.() ?? 0;
  const [chatVisible, setChatVisible] = useState(false);
  const [chatDraft, setChatDraft] = useState('');
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [warehouseVisible, setWarehouseVisible] = useState(false);
  const [noticeVisible, setNoticeVisible] = useState(false);
  const members = membersData.members as Member[];

  const memberList = useMemo<DisplayMember[]>(
    () =>
      members.map((member) => ({
        id: member.id,
        name: member.name,
        roleLabel: member.role === 'leader' ? '队长' : member.role === 'officer' ? '副官' : '成员',
        onlineStatus: member.online ? 'online' : 'offline',
        intel: member.contribWeek ?? 0,
      })),
    [members],
  );

  const handleTeamMapPress = () => {
    navigation.getParent()?.navigate('Explore' as never);
  };

  const handleTeamDungeonPress = () => {
    navigation.getParent()?.navigate('Trials' as never);
  };

  const handleTeamStoragePress = () => {
    setWarehouseVisible(true);
  };

  const handleTeamNoticePress = () => {
    setNoticeVisible(true);
  };

  const handleInvitePress = () => {
    navigation.navigate('MyInvites');
  };

  const handleLeavePress = () => {
    setLeaveModalVisible(true);
  };

  const confirmLeaveTeam = () => {
    setLeaveModalVisible(false);
    console.log('leave team confirmed');
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={gradientColors} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingBottom: tabBarHeight ? tabBarHeight + 32 : 120 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <TeamHeaderCard onPressChat={() => setChatVisible(true)} />
          <TeamFunctionSection
            onTeamMapPress={handleTeamMapPress}
            onTeamDungeonPress={handleTeamDungeonPress}
            onTeamStoragePress={handleTeamStoragePress}
            onTeamNoticePress={handleTeamNoticePress}
          />
          <TeamMemberSection
            members={memberList}
            onInvite={handleInvitePress}
            onLeave={handleLeavePress}
          />
        </ScrollView>
      </SafeAreaView>
      <ChatComposer
        visible={chatVisible}
        value={chatDraft}
        onChange={setChatDraft}
        onClose={() => setChatVisible(false)}
      />
      <LeaveTeamModal
        visible={leaveModalVisible}
        onCancel={() => setLeaveModalVisible(false)}
        onConfirm={confirmLeaveTeam}
      />
      <WarehouseModal
        visible={warehouseVisible}
        onClose={() => setWarehouseVisible(false)}
        wallet={teamSummary.wallet}
      />
      <NoticeModal
        visible={noticeVisible}
        notice={teamSummary.notice}
        onClose={() => setNoticeVisible(false)}
      />
    </View>
  );
};

const TeamHeaderCard = ({ onPressChat }: { onPressChat: () => void }) => {
  const { team } = teamSummary;
  const expRemaining = Math.max(team.next - team.exp, 0);
  const progressText = `Lv.${team.level}  距上一级还有 ${expRemaining} / ${team.next}`;
  const membersText = `队员 ${team.online} / ${team.cap}`;
  const progressRatio = team.exp / team.next;

  return (
    <View style={[styles.headerCard, styles.horizontalMargin]}>
      <View style={styles.headerTopRow}>
        <View style={styles.teamAvatar}>
          <Text style={styles.teamAvatarText}>{team.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.headerTextBlock}>
          <Text style={styles.headerTitle}>{team.name}</Text>
          <Text style={styles.headerSubtitle}>{progressText}</Text>
          <Text style={styles.headerSubtitle}>{membersText}</Text>
        </View>
        <TouchableOpacity style={styles.chatButton} onPress={onPressChat}>
          <Text style={styles.chatButtonText}>团队聊天</Text>
        </TouchableOpacity>
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

type TeamFunctionCardProps = {
  title: string;
  subtitle?: string;
  onPress: () => void;
};

const TeamFunctionCard = ({ title, subtitle, onPress }: TeamFunctionCardProps) => (
  <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.teamFuncCard}>
    <View style={styles.teamFuncHeader}>
      <Text style={styles.teamFuncTitle}>{title}</Text>
      <Text style={styles.teamFuncArrow}>›</Text>
    </View>
    {subtitle ? <Text style={styles.teamFuncSubtitle}>{subtitle}</Text> : null}
  </TouchableOpacity>
);

type TeamFunctionSectionProps = {
  onTeamMapPress: () => void;
  onTeamDungeonPress: () => void;
  onTeamStoragePress: () => void;
  onTeamNoticePress: () => void;
};

const TeamFunctionSection = ({
  onTeamMapPress,
  onTeamDungeonPress,
  onTeamStoragePress,
  onTeamNoticePress,
}: TeamFunctionSectionProps) => (
  <View style={styles.teamFuncSection}>
    <Text style={styles.sectionTitle}>团队功能</Text>
    <View style={styles.teamFuncRow}>
      <TeamFunctionCard
        title="团队地图"
        subtitle={`今日 ${teamSummary.maps.opened} / ${teamSummary.maps.quota}`}
        onPress={onTeamMapPress}
      />
      <TeamFunctionCard
        title="团队副本"
        subtitle={`剩余 ${teamSummary.raid.attemptsLeft} / ${teamSummary.raid.total}`}
        onPress={onTeamDungeonPress}
      />
    </View>
    <View style={styles.teamFuncRow}>
      <TeamFunctionCard title="团队仓库" subtitle="查看物资" onPress={onTeamStoragePress} />
      <TeamFunctionCard title="团队公告" subtitle="查看 / 发布" onPress={onTeamNoticePress} />
    </View>
  </View>
);

type TeamMemberSectionProps = {
  members: DisplayMember[];
  onInvite: () => void;
  onLeave: () => void;
};

const TeamMemberSection = ({ members, onInvite, onLeave }: TeamMemberSectionProps) => (
  <View style={styles.memberSection}>
    <View style={styles.memberHeader}>
      <Text style={styles.sectionTitle}>成员列表</Text>
      <Text style={styles.memberSubtitle}>头像 · 名字 · 职务 · 情报</Text>
    </View>
    <View style={styles.memberCard}>
      <ScrollView style={styles.memberListScroll} showsVerticalScrollIndicator={false}>
        {members.map((member) => (
          <TeamMemberRow key={member.id} member={member} />
        ))}
      </ScrollView>
      <View style={styles.memberActionsRow}>
        <TouchableOpacity style={styles.inviteButton} activeOpacity={0.9} onPress={onInvite}>
          <Text style={styles.inviteButtonText}>邀请</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.leaveButton} activeOpacity={0.9} onPress={onLeave}>
          <Text style={styles.leaveButtonText}>离队</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const TeamMemberRow = ({ member }: { member: DisplayMember }) => (
  <View style={styles.memberRow}>
    <View style={styles.memberAvatar}>
      <Text style={styles.memberAvatarText}>{member.name.charAt(0).toUpperCase()}</Text>
    </View>
    <View style={styles.memberInfo}>
      <Text style={styles.memberName}>{member.name}</Text>
      <View style={styles.memberMetaRow}>
        <View style={styles.roleTag}>
          <Text style={styles.roleTagText}>{member.roleLabel}</Text>
        </View>
        <View style={getOnlineDotStyle(member.onlineStatus)} />
        <Text style={styles.onlineText}>{member.onlineStatus === 'online' ? '在线' : '离线'}</Text>
      </View>
    </View>
    <View style={styles.intelPill}>
      <Text style={styles.intelLabel}>情报</Text>
      <Text style={styles.intelValue}>{member.intel}</Text>
    </View>
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
          <TouchableOpacity style={[styles.modalButton, styles.modalGhost]} onPress={onClose}>
            <Text style={styles.modalGhostText}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modalButton, styles.modalPrimary]} onPress={onClose}>
            <Text style={styles.modalPrimaryText}>发送</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  </Modal>
);

type LeaveTeamModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const LeaveTeamModal = ({ visible, onCancel, onConfirm }: LeaveTeamModalProps) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
    <View style={styles.modalMask}>
      <View style={styles.modalCardAlt}>
        <Text style={styles.modalTitleAlt}>确认离开团队？</Text>
        <Text style={styles.modalDesc}>
          离队需要支付赎身券，确认后将从当前团队中移除，团队收益与权限将同时失效。
        </Text>
        <View style={styles.modalActionsAlt}>
          <TouchableOpacity style={styles.modalCancel} onPress={onCancel}>
            <Text style={styles.modalCancelText}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalConfirm} onPress={onConfirm}>
            <Text style={styles.modalConfirmText}>确认离队</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

type WarehouseModalProps = {
  visible: boolean;
  onClose: () => void;
  wallet: typeof teamSummary.wallet;
};

const WarehouseModal = ({ visible, onClose, wallet }: WarehouseModalProps) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.modalMask}>
      <View style={styles.warehouseCard}>
        <Text style={styles.modalTitleAlt}>团队仓库</Text>
        <View style={styles.walletRow}>
          <View style={styles.walletChip}>
            <Text style={styles.walletLabel}>ARC</Text>
            <Text style={styles.walletValue}>{wallet.arc}</Text>
          </View>
          <View style={styles.walletChip}>
            <Text style={styles.walletLabel}>矿石</Text>
            <Text style={styles.walletValue}>{wallet.stones}</Text>
          </View>
        </View>
        <ScrollView style={styles.warehouseList} showsVerticalScrollIndicator={false}>
          <View style={styles.warehouseGrid}>
            {teamWarehouseItems.map((item, index) => (
              <View key={item?.id ?? `slot-${index}`} style={styles.warehouseCell}>
                {item ? (
                  <>
                    <View style={styles.warehouseIconWrap}>
                      {item.icon ? (
                        <Image source={item.icon} style={styles.warehouseIcon as ImageStyle} />
                      ) : (
                        <Text style={styles.warehousePlaceholder}>{item.name.charAt(0)}</Text>
                      )}
                      {item.shortLabel ? (
                        <View style={styles.warehouseBadge}>
                          <Text style={styles.warehouseBadgeText}>{item.shortLabel}</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.warehouseName}>{item.name}</Text>
                    <Text style={styles.warehouseQty}>x{item.amount}</Text>
                  </>
                ) : (
                  <View style={styles.warehouseEmptyBox}>
                    <Text style={styles.warehouseEmptyPlus}>+</Text>
                    <Text style={styles.warehouseEmpty}>空槽</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.modalConfirm} onPress={onClose}>
          <Text style={styles.modalConfirmText}>关闭</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

type NoticeModalProps = {
  visible: boolean;
  notice: string;
  onClose: () => void;
};

const NoticeModal = ({ visible, notice, onClose }: NoticeModalProps) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.modalMask}>
      <View style={styles.noticeCard}>
        <Text style={styles.modalTitleAlt}>团队公告</Text>
        <Text style={styles.noticeText}>{notice || '暂无公告'}</Text>
        <TouchableOpacity style={styles.modalConfirm} onPress={onClose}>
          <Text style={styles.modalConfirmText}>我知道了</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const getOnlineDotStyle = (status: 'online' | 'offline') => ({
  width: 6,
  height: 6,
  borderRadius: 3,
  marginRight: 4,
  backgroundColor: status === 'online' ? '#22c55e' : 'rgba(148,163,184,0.7)',
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: '#020617' },
  container: { flex: 1 },
  contentContainer: { paddingTop: 16, gap: 24 },
  horizontalMargin: { marginHorizontal: 16 },
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
  teamAvatarText: { ...typography.heading, color: '#FFFFFF' },
  headerTextBlock: { flex: 1, gap: 4 },
  headerTitle: { ...typography.heading, color: '#FFFFFF' },
  headerSubtitle: { ...typography.body, color: 'rgba(255,255,255,0.75)' },
  chatButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.5)',
    backgroundColor: 'rgba(0,255,255,0.12)',
  },
  chatButtonText: { color: '#33F5FF', fontWeight: '600' },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  progressLabel: { ...typography.caption, color: 'rgba(255,255,255,0.7)' },
  progressValue: { ...typography.caption, color: '#FFFFFF' },
  progressTrack: {
    marginTop: 6,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: '#33F5FF' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E5F2FF',
    marginHorizontal: 16,
    marginTop: 8,
  },
  teamFuncSection: { marginTop: 16, gap: 4 },
  teamFuncRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 12,
  },
  teamFuncCard: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    backgroundColor: 'rgba(15,23,42,0.96)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.35)',
    shadowColor: '#38bdf8',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  teamFuncHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  teamFuncTitle: { color: '#E5F2FF', fontSize: 15, fontWeight: '600' },
  teamFuncArrow: { color: '#38BDF8', fontSize: 18, fontWeight: '500' },
  teamFuncSubtitle: { color: 'rgba(148,163,184,0.9)', fontSize: 12 },
  memberSection: { marginTop: 24 },
  memberHeader: { marginHorizontal: 16, marginBottom: 8 },
  memberSubtitle: { fontSize: 12, color: 'rgba(148,163,184,0.9)' },
  memberCard: {
    marginHorizontal: 16,
    borderRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: 'rgba(15,23,42,0.98)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.3)',
  },
  memberListScroll: { maxHeight: 320, marginBottom: 12 },
  memberRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 4 },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberAvatarText: { color: '#E5F2FF', fontWeight: '600', fontSize: 16 },
  memberInfo: { flex: 1 },
  memberName: { color: '#E5F2FF', fontSize: 14, fontWeight: '500' },
  memberMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  roleTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(129,140,248,0.6)',
    marginRight: 8,
  },
  roleTagText: { color: 'rgba(199,210,254,0.9)', fontSize: 10 },
  onlineText: { color: 'rgba(148,163,184,0.9)', fontSize: 11 },
  intelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(15,118,110,0.9)',
  },
  intelLabel: { color: 'rgba(226,252,236,0.9)', fontSize: 11, marginRight: 4 },
  intelValue: { color: '#ECFEFF', fontWeight: '600', fontSize: 12 },
  memberActionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  inviteButton: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#0ea5e9',
  },
  inviteButtonText: { color: '#F9FAFB', fontSize: 15, fontWeight: '600' },
  leaveButton: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#f97373',
    backgroundColor: 'transparent',
  },
  leaveButtonText: { color: '#fca5a5', fontSize: 15, fontWeight: '500' },
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
  modalTitle: { ...typography.subtitle, color: '#FFFFFF' },
  modalInput: {
    minHeight: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 12,
    color: '#FFFFFF',
    textAlignVertical: 'top',
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  modalButton: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 999, borderWidth: 1 },
  modalGhost: { borderColor: 'rgba(255,255,255,0.3)' },
  modalPrimary: { borderColor: '#00E5FF', backgroundColor: 'rgba(0,229,255,0.1)' },
  modalGhostText: { ...typography.subtitle, color: '#FFFFFF' },
  modalPrimaryText: { ...typography.subtitle, color: '#00E5FF' },
  modalMask: { flex: 1, backgroundColor: 'rgba(15,23,42,0.8)', alignItems: 'center', justifyContent: 'center' },
  modalCardAlt: { width: '80%', borderRadius: 20, padding: 20, backgroundColor: 'rgba(15,23,42,0.98)' },
  modalTitleAlt: { color: '#E5F2FF', fontSize: 16, fontWeight: '600', marginBottom: 8 },
  modalDesc: { color: 'rgba(148,163,184,0.95)', fontSize: 13, lineHeight: 18 },
  modalActionsAlt: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 },
  modalCancel: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    backgroundColor: 'rgba(15,23,42,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.7)',
  },
  modalCancelText: { color: 'rgba(148,163,184,0.95)', fontSize: 13 },
  modalConfirm: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: '#f97373' },
  modalConfirmText: { color: '#FEF2F2', fontSize: 13, fontWeight: '600' },
  walletRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 8,
  },
  walletChip: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(2,6,23,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.35)',
  },
  walletLabel: { color: 'rgba(148,163,184,0.9)', fontSize: 12 },
  walletValue: { color: '#E5F2FF', fontSize: 16, fontWeight: '600' },
  warehouseCard: {
    width: '88%',
    borderRadius: 24,
    padding: 20,
    backgroundColor: 'rgba(15,23,42,0.98)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.4)',
  },
  warehouseList: { maxHeight: 280, marginVertical: 8 },
  warehouseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  warehouseCell: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    padding: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(5,8,18,0.85)',
  },
  warehouseIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(56,189,248,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  warehouseIcon: { width: 46, height: 46 },
  warehousePlaceholder: { color: '#7FFBFF', fontSize: 16, fontWeight: '700' },
  warehouseBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(229,242,255,0.6)',
    backgroundColor: 'rgba(15,23,42,0.95)',
  },
  warehouseBadgeText: { color: '#E5F2FF', fontSize: 10, fontWeight: '700' },
  warehouseName: { color: '#E5F2FF', fontSize: 13, textAlign: 'center' },
  warehouseQty: { color: '#38BDF8', fontSize: 12, marginTop: 4 },
  warehouseEmptyBox: { alignItems: 'center', justifyContent: 'center', gap: 6 },
  warehouseEmptyPlus: { color: '#E5F2FF', fontSize: 22, fontWeight: '800' },
  warehouseEmpty: { color: 'rgba(148,163,184,0.6)', fontSize: 12 },
  noticeCard: {
    width: '80%',
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'rgba(15,23,42,0.98)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.35)',
  },
  noticeText: { color: 'rgba(229,242,255,0.9)', fontSize: 14, lineHeight: 20, marginVertical: 8 },
});

export default TeamScreen;
