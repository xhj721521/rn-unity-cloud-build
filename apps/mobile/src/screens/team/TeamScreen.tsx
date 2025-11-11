import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import TeamStickyHeader from '@components/team/TeamStickyHeader';
import ActionGrid from '@components/team/ActionGrid';
import ExpandablePanel from '@components/team/ExpandablePanel';
import WarehouseGrid from '@components/team/WarehouseGrid';
import AnnouncementPanel from '@components/team/AnnouncementPanel';
import MembersPanel from '@components/team/MembersPanel';
import { teamWarehouseItems } from '@mock/teamWarehouse';
import teamSummary from '@mock/team.summary.json';
import membersData from '@mock/team.members.json';
import { Member } from '@mock/team.members';
import { typography } from '@theme/typography';

type PanelKey = 'warehouse' | 'notice' | null;

export const TeamScreen = () => {
  const [openPanel, setOpenPanel] = useState<PanelKey>(null);
  const [chatVisible, setChatVisible] = useState(false);
  const [chatDraft, setChatDraft] = useState('');
  const [members] = useState<Member[]>(membersData.members as Member[]);
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight?.() ?? 0;
  const bottomPadding = tabBarHeight + insets.bottom + 80;

  const normalizedMembers = useMemo(
    () =>
      members.map((member) => ({
        ...member,
        intelToday: member.intelToday ?? member.contribWeek ?? 0,
      })),
    [members],
  );

  const handleTogglePanel = (key: PanelKey) => {
    setOpenPanel((prev) => (prev === key ? null : key));
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#030610', '#071424']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.body, { paddingBottom: bottomPadding }]}>
        <View style={styles.commandCard}>
          <TeamStickyHeader
            name={teamSummary.team.name}
            level={teamSummary.team.level}
            exp={teamSummary.team.exp}
            next={teamSummary.team.next}
            membersOnline={teamSummary.team.online}
            memberCap={teamSummary.team.cap}
            onPressChat={() => setChatVisible(true)}
          />
          <ActionGrid
            dungeon={teamSummary.raid}
            onOpenMap={() => {}}
            onOpenDungeon={() => {}}
            onToggleWarehouse={() => handleTogglePanel('warehouse')}
            onToggleNotice={() => handleTogglePanel('notice')}
          />
        </View>

        <View style={styles.section}>
          {openPanel === 'warehouse' ? (
            <ExpandablePanel>
              <WarehouseGrid items={teamWarehouseItems} />
            </ExpandablePanel>
          ) : null}
          {openPanel === 'notice' ? (
            <ExpandablePanel>
              <AnnouncementPanel text={teamSummary.notice} canEdit />
            </ExpandablePanel>
          ) : null}
        </View>

        <MembersPanel members={normalizedMembers} style={styles.membersPanel} />
      </View>

      <ChatComposer
        visible={chatVisible}
        value={chatDraft}
        onChange={setChatDraft}
        onClose={() => setChatVisible(false)}
      />
    </View>
  );
};

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
    backgroundColor: '#030610',
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 16,
  },
  commandCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.25)',
    backgroundColor: 'rgba(5,9,15,0.92)',
    padding: 16,
    gap: 16,
  },
  section: {
    gap: 12,
  },
  membersPanel: {
    flex: 1,
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
});

export default TeamScreen;
