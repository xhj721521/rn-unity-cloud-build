import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { PlayerInfo } from '@types/market';

type PlayerBadgeProps = {
  player: PlayerInfo;
  sideLabel: '卖家' | '求购方';
  size?: 'sm' | 'md';
};

export const PlayerBadge: React.FC<PlayerBadgeProps> = ({ player, sideLabel, size = 'md' }) => {
  const isSm = size === 'sm';
  const avatarSize = isSm ? 30 : 36;
  const fontSize = isSm ? 12 : 13;

  return (
    <View style={styles.row}>
      {player.avatarUrl ? (
        <Image source={{ uri: player.avatarUrl }} style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]} />
      ) : (
        <View
          style={[
            styles.avatar,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            },
          ]}
        >
          <Text style={styles.avatarText}>{player.nickname?.charAt(0).toUpperCase()}</Text>
        </View>
      )}
      <View style={styles.textCol}>
        <Text style={[styles.nick, { fontSize }]} numberOfLines={1}>
          {player.nickname}
        </Text>
        <Text style={styles.side}>{sideLabel}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    backgroundColor: 'rgba(56,189,248,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: { color: '#7FFBFF', fontWeight: '700' },
  textCol: { flex: 1, minWidth: 0 },
  nick: { color: '#F9FAFB', fontWeight: '600' },
  side: { color: 'rgba(148,163,184,0.85)', fontSize: 11, marginTop: 2 },
});

export default PlayerBadge;
