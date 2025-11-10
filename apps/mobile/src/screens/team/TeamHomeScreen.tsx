import React, { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { ScreenContainer } from '@components/ScreenContainer';
import TeamActionStrip from '@components/team/TeamActionStrip';
import RosterFilterBar, { RosterFilterKey } from '@components/team/RosterFilterBar';
import RosterGrid from '@components/team/RosterGrid';
import MemberDrawer from '@components/team/MemberDrawer';
import RaidWideCard from '@components/team/RaidWideCard';
import MapHalfCard from '@components/team/MapHalfCard';
import VaultDonateHalfCard from '@components/team/VaultDonateHalfCard';
import ChatDock from '@components/team/ChatDock';
import teamSummary from '@mock/team.summary.json';
import teamMembers from '@mock/team.members.json';
import { MemberEntity } from '@components/team/MemberCard';
import { translate as t } from '@locale/strings';
import { useBottomGutter } from '@hooks/useBottomGutter';

export const TeamHomeScreen = () => {
  const [filter, setFilter] = useState<RosterFilterKey>('all');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MemberEntity | null>(null);

  const bottomGutter = useBottomGutter();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const members: MemberEntity[] = useMemo(
    () =>
      teamMembers.members.map((m) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        online: m.online,
        lastSeen: m.lastSeen,
        contribWeek: m.contribWeek,
      })),
    [],
  );

  const filtered = useMemo(() => {
    return members.filter((member) => {
      if (keyword && !member.name.toLowerCase().includes(keyword.toLowerCase())) {
        return false;
      }
      switch (filter) {
        case 'online':
          return member.online;
        case 'offline':
          return !member.online;
        case 'leader':
          return member.role === 'leader';
        case 'officer':
          return member.role === 'officer';
        default:
          return true;
      }
    });
  }, [members, keyword, filter]);

  const handleLeave = () => {
    Alert.alert(t('team.leave', '离队'), t('team.leave.note', '离开需费用，且24小时不参与分配'));
  };

  return (
    <>
      <ScreenContainer variant="plain" scrollable>
        <View style={[styles.page, { paddingBottom: bottomGutter.paddingBottom + 200 }]}>
          <TeamActionStrip
            name={teamSummary.team.name}
            level={teamSummary.team.level}
            online={teamSummary.team.online}
            cap={teamSummary.team.cap}
            onInvite={() => Alert.alert('邀请入口', '占位功能')}
            onLeave={handleLeave}
          />
          <RosterFilterBar
            value={filter}
            onChange={setFilter}
            keyword={keyword}
            onKeywordChange={setKeyword}
          />
          <RosterGrid members={filtered} loading={loading} onPressMember={setSelected} />

          <View style={styles.battleStack}>
            <RaidWideCard
              name={teamSummary.raid.name}
              difficulty={teamSummary.raid.difficulty}
              cleared={teamSummary.raid.cleared}
              total={teamSummary.raid.total}
              endsIn={teamSummary.raid.endsIn}
              attemptsLeft={teamSummary.raid.attemptsLeft}
              onEnter={() => Alert.alert('副本', '占位功能')}
            />
            <View style={styles.halfRow}>
              <View style={styles.halfCard}>
                <MapHalfCard
                  opened={teamSummary.maps.opened}
                  quota={teamSummary.maps.quota}
                  ticket={teamSummary.maps.ticket}
                  canOpen
                  onOpen={() => Alert.alert('开图', '占位功能')}
                />
              </View>
              <View style={styles.halfCard}>
                <VaultDonateHalfCard
                  arc={teamSummary.wallet.arc}
                  stones={teamSummary.wallet.stones}
                  oValues={[
                    teamSummary.wallet.o1,
                    teamSummary.wallet.o2,
                    teamSummary.wallet.o3,
                    teamSummary.wallet.o4,
                    teamSummary.wallet.o5,
                  ]}
                  onDonate={(amount) => Alert.alert('捐献', `占位 +${amount}`)}
                  onDonateNow={() => Alert.alert('捐献', '占位功能')}
                />
              </View>
            </View>
          </View>
        </View>
      </ScreenContainer>
      <ChatDock
        messages={[
          { id: 'm1', user: 'Aegis', body: '今晚 21:00 集合，准备副本。' },
          { id: 'm2', user: 'Nova', body: '收到，盲盒券已备齐。' },
        ]}
      />
      <MemberDrawer visible={!!selected} member={selected} onClose={() => setSelected(null)} />
    </>
  );
};

const styles = StyleSheet.create({
  page: {
    gap: 16,
  },
  battleStack: {
    gap: 12,
  },
  halfRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCard: {
    flex: 1,
  },
});

export default TeamHomeScreen;
