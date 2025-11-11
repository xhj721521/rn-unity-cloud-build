import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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

type PanelKey = 'warehouse' | 'notice' | null;

export const TeamScreen = () => {
  const [openPanel, setOpenPanel] = useState<PanelKey>(null);
  const [members] = useState<Member[]>(membersData.members as Member[]);

  const handleTogglePanel = (key: PanelKey) => {
    setOpenPanel((prev) => (prev === key ? null : key));
  };

  const warehouseSlots = useMemo(() => teamWarehouseItems, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      stickyHeaderIndices={[0]}
      nestedScrollEnabled
    >
      <TeamStickyHeader
        name={teamSummary.team.name}
        level={teamSummary.team.level}
        exp={teamSummary.team.exp}
        next={teamSummary.team.next}
      />

      <View style={styles.section}>
        <ActionGrid
          dungeon={teamSummary.raid}
          onOpenMap={() => {}}
          onOpenDungeon={() => {}}
          onToggleWarehouse={() => handleTogglePanel('warehouse')}
          onToggleNotice={() => handleTogglePanel('notice')}
        />

        {openPanel === 'warehouse' ? (
          <ExpandablePanel>
            <WarehouseGrid items={warehouseSlots} />
          </ExpandablePanel>
        ) : null}
        {openPanel === 'notice' ? (
          <ExpandablePanel>
            <AnnouncementPanel text={teamSummary.notice} canEdit />
          </ExpandablePanel>
        ) : null}
      </View>

      <MembersPanel members={members} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05090F',
  },
  content: {
    paddingBottom: 120,
    paddingHorizontal: 16,
    gap: 16,
  },
  section: {
    gap: 10,
  },
});

export default TeamScreen;
