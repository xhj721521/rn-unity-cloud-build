import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BadgeChip from '@components/shared/BadgeChip';
import OutlineCTA from '@components/shared/OutlineCTA';
import { teamTokens } from '@theme/tokens.team';
import { typography } from '@theme/typography';
import { translate as t } from '@locale/strings';

type Props = {
  name: string;
  level: number;
  online: number;
  cap: number;
  onInvite?: () => void;
  onLeave?: () => void;
  testID?: string;
};

export const TeamActionStrip = ({ name, level, online, cap, onInvite, onLeave, testID }: Props) => {
  return (
    <View style={styles.container} testID={testID ?? 'teamActionStrip'}>
      <View style={styles.nameColumn}>
        <Text style={styles.teamName} numberOfLines={1}>
          {name}
        </Text>
        <BadgeChip label={`Lv.${level}`} tone="default" />
      </View>
      <BadgeChip
        label={t('team.online', { count: online, cap }, '在线 {count}/{cap}')}
        tone={online > 0 ? 'online' : 'offline'}
      />
      <View style={styles.actions}>
        <OutlineCTA label={t('team.invite', '邀请')} onPress={onInvite} />
        <OutlineCTA
          label={t('team.leave', '离队')}
          tone="danger"
          onPress={onLeave}
          style={styles.leaveBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
  },
  nameColumn: {
    flex: 1,
    gap: 4,
  },
  teamName: {
    ...typography.subtitle,
    color: teamTokens.colors.textMain,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  leaveBtn: {
    minWidth: 64,
  },
});

export default TeamActionStrip;
