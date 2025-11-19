import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Avatar from './Avatar';
import DoubleFrameCard from './DoubleFrameCard';
import TechTexture from './TechTexture';
import IconCrown from './IconCrown';
import { BoardType, RankItem } from '../types';
import { fmt, isTop3 } from '../utils';
import { T } from '../tokens';
import { fonts } from '../typography';
import { translate as t } from '../locale/strings';

type Props = {
  type: BoardType;
  item: RankItem;
  width: number;
  enableTexture?: boolean;
};

const metaByType = (type: BoardType, item: RankItem) => {
  if (type === 'invite') {
    return {
      cat: t('lb.invite'),
      primary: t('lb.card.invite.primary', { count: item.primaryValue }),
      secondary: t('lb.card.invite.secondary', { score: fmt(item.score) }),
      cta: t('lb.cta.invite'),
    };
  }
  if (type === 'team') {
    return {
      cat: t('lb.team'),
      primary: t('lb.card.team.primary', { score: fmt(item.primaryValue) }),
      secondary: t('lb.card.team.secondary', { count: item.secondaryValue ?? 0 }),
      cta: t('lb.cta.boost'),
    };
  }
  return {
    cat: t('lb.wealth'),
    primary: t('lb.card.mining.primary', { count: fmt(item.primaryValue) }),
    secondary: t('lb.card.mining.secondary', { score: fmt(item.score) }),
    cta: t('lb.cta.detail'),
  };
};

const RankCard: React.FC<Props> = ({ type, item, width, enableTexture }) => {
  const meta = metaByType(type, item);
  return (
    <DoubleFrameCard rank={item.rank} width={width}>
      {enableTexture && <TechTexture opacity={isTop3(item.rank) ? 0.06 : 0.03} />}
      <View style={styles.cardInner}>
        <View style={styles.header}>
          <Text style={[fonts.meta, styles.rankIndex]}>{`NO.${String(item.rank).padStart(2, '0')}`}</Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{meta.cat}</Text>
          </View>
          {isTop3(item.rank) ? (
            <View style={{ marginLeft: 4 }}>
              <IconCrown size={16} />
            </View>
          ) : null}
        </View>

        <View style={styles.middle}>
          <Avatar name={item.nickname} uri={item.avatarUrl} />
          <View style={{ marginLeft: 8, flex: 1 }}>
            <Text numberOfLines={2} style={styles.name}>
              {item.nickname}
            </Text>
            {!!item.badge && (
              <Text numberOfLines={1} style={styles.badgeText}>
                {item.badge}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.bottom}>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={styles.primary}>
              {meta.primary}
            </Text>
            <Text numberOfLines={1} style={styles.secondary}>
              {meta.secondary}
            </Text>
          </View>
          <Pressable style={styles.cta}>
            <Text style={styles.ctaText}>{meta.cta}</Text>
          </Pressable>
        </View>
      </View>
    </DoubleFrameCard>
  );
};

const styles = StyleSheet.create({
  cardInner: { flex: 1, padding: 12, gap: 8 },
  header: { flexDirection: 'row', alignItems: 'center' },
  rankIndex: { color: '#97B7FF', fontWeight: '700' },
  tag: {
    marginLeft: 'auto',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#1A2440',
  },
  tagText: { ...fonts.meta, color: T.color.textMeta, fontSize: 11 },
  middle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { ...fonts.body, fontSize: 15, fontWeight: '700' },
  badgeText: { ...fonts.meta, marginTop: 2 },
  bottom: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  primary: { ...fonts.body, fontSize: 15, fontWeight: '700' },
  secondary: { ...fonts.meta, marginTop: 2 },
  cta: {
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: '#173056',
    justifyContent: 'center',
  },
  ctaText: { color: T.color.primary, fontSize: 12, fontWeight: '700' },
});

export default RankCard;
