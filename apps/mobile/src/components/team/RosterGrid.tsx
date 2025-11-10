import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import MemberCard, { MemberEntity } from './MemberCard';
import SkeletonBlock from '@components/common/SkeletonBlock';
import { teamTokens } from '@theme/tokens.team';

type Props = {
  members: MemberEntity[];
  loading?: boolean;
  onPressMember?: (member: MemberEntity) => void;
};

const ITEM_GAP = teamTokens.layout.gapGrid;

export const RosterGrid = ({ members, loading, onPressMember }: Props) => {
  if (loading) {
    return (
      <View testID="rosterGrid">
        <SkeletonBlock height={112} />
        <SkeletonBlock height={112} />
        <SkeletonBlock height={112} />
      </View>
    );
  }

  return (
    <FlatList
      testID="rosterGrid"
      data={members}
      keyExtractor={(item) => item.id}
      numColumns={3}
      columnWrapperStyle={styles.column}
      contentContainerStyle={styles.content}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View style={styles.cardWrapper}>
          <MemberCard member={item} onPress={onPressMember} />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    gap: ITEM_GAP,
  },
  column: {
    gap: ITEM_GAP,
  },
  cardWrapper: {
    flex: 1,
    minWidth: 0,
  },
});

export default RosterGrid;
