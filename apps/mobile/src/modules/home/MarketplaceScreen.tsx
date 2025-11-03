import React, { useMemo, useState } from 'react';
import { FlatList, ListRenderItem, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScreenContainer } from '@components/ScreenContainer';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';
import { ErrorState } from '@components/ErrorState';
import { useAppDispatch } from '@state/hooks';
import { loadMarketplaceData } from '@state/market/marketSlice';
import { useMarketplaceData } from '@services/game/hooks';
import { MarketCategory } from '@services/game/marketClient';

const FILTERS = ['价格', '数量', '最新', '稀有度'];

const renderCategoryItem: ListRenderItem<MarketCategory> = ({ item }) => (
  <CategorySection category={item} />
);

const ItemSeparator = () => <View style={styles.separator} />;

const keyExtractor = (item: MarketCategory) => item.key;

export const MarketplaceScreen = () => {
  const dispatch = useAppDispatch();
  const marketState = useMarketplaceData();
  const [filter, setFilter] = useState(FILTERS[0]);

  const categories = useMemo(() => marketState.data ?? [], [marketState.data]);

  if (marketState.status === 'idle' || marketState.status === 'loading') {
    return (
      <ScreenContainer>
        <View style={styles.centerBox}>
          <LoadingPlaceholder label="集市行情加载中..." />
        </View>
      </ScreenContainer>
    );
  }

  if (marketState.status === 'failed') {
    return (
      <ScreenContainer>
        <View style={styles.centerBox}>
          <ErrorState
            title="暂时无法连接集市"
            description={marketState.error}
            onRetry={() => dispatch(loadMarketplaceData())}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Text style={styles.heading}>集市坊</Text>
        <Text style={styles.subHeading}>链上实时价格脉冲，采购矿石、碎片与全息装备。</Text>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((item) => {
          const selected = item === filter;
          return (
            <Pressable
              key={item}
              style={[styles.filterChip, selected && styles.filterChipActive]}
              android_ripple={{ color: 'rgba(96, 165, 250, 0.2)' }}
              onPress={() => setFilter(item)}
            >
              <Text style={[styles.filterLabel, selected && styles.filterLabelActive]}>{item}</Text>
            </Pressable>
          );
        })}
        <Pressable style={styles.askButton} android_ripple={{ color: 'rgba(15, 23, 42, 0.2)' }}>
          <Text style={styles.askButtonText}>发布求购</Text>
        </Pressable>
      </View>

      <FlatList
        data={categories}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        renderItem={renderCategoryItem}
        ItemSeparatorComponent={ItemSeparator}
        showsVerticalScrollIndicator={false}
      />

      <Pressable
        style={styles.floatingButton}
        android_ripple={{ color: 'rgba(255, 255, 255, 0.24)' }}
      >
        <Text style={styles.floatingButtonText}>我要上架</Text>
      </Pressable>
    </ScreenContainer>
  );
};

const CategorySection = ({ category }: { category: MarketCategory }) => (
  <LinearGradient
    colors={['rgba(34, 40, 74, 0.94)', 'rgba(18, 24, 52, 0.92)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.categoryCard}
  >
    <View style={styles.categoryHeader}>
      <View style={styles.categoryTitleRow}>
        <Text style={styles.categoryIcon}>{category.icon}</Text>
        <Text style={styles.categoryTitle}>{category.label}</Text>
      </View>
      {category.highlight && (
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{category.highlight}</Text>
        </View>
      )}
    </View>
    <Text style={styles.categoryDesc}>{category.description}</Text>

    <View style={styles.listHeader}>
      <Text style={styles.listHeaderLabel}>卖家</Text>
      <Text style={styles.listHeaderLabel}>价格（Arc）</Text>
      <Text style={styles.listHeaderLabel}>数量</Text>
      <Text style={[styles.listHeaderLabel, styles.listHeaderRight]}>更新时间</Text>
    </View>

    <View style={styles.listBody}>
      {category.listings.map((listing, index) => (
        <View key={listing.id} style={[styles.listRow, index % 2 === 1 && styles.listRowAlt]}>
          <Text style={styles.listSeller}>{listing.seller}</Text>
          <Text style={styles.listPrice}>{listing.price.toFixed(2)}</Text>
          <Text style={styles.listQuantity}>{listing.quantity}</Text>
          <Text style={styles.listTime}>{listing.updatedAgo}</Text>
        </View>
      ))}
    </View>

    <View style={styles.categoryActions}>
      <Pressable style={styles.actionButton} android_ripple={{ color: 'rgba(15, 23, 42, 0.24)' }}>
        <Text style={styles.actionButtonText}>浏览全部挂单</Text>
      </Pressable>
      <Pressable
        style={styles.actionButtonSecondary}
        android_ripple={{ color: 'rgba(96, 165, 250, 0.2)' }}
      >
        <Text style={styles.actionButtonSecondaryText}>查看成交记录</Text>
      </Pressable>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 48,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 8,
  },
  heading: {
    color: '#F7FAFF',
    fontSize: 22,
    fontWeight: '700',
  },
  subHeading: {
    color: 'rgba(226, 231, 255, 0.72)',
    fontSize: 14,
    lineHeight: 20,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    paddingHorizontal: 20,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(128, 140, 248, 0.38)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(24, 28, 52, 0.86)',
  },
  filterChipActive: {
    borderColor: '#60A5FA',
    backgroundColor: 'rgba(37, 99, 235, 0.22)',
  },
  filterLabel: {
    color: 'rgba(226, 231, 255, 0.72)',
    fontSize: 12,
  },
  filterLabelActive: {
    color: '#F7FAFF',
    fontWeight: '600',
  },
  askButton: {
    marginLeft: 'auto',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F97316',
  },
  askButtonText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 120,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  categoryCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 18,
    gap: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryTitle: {
    color: '#F7FAFF',
    fontSize: 18,
    fontWeight: '700',
  },
  categoryDesc: {
    color: 'rgba(226, 231, 255, 0.72)',
    fontSize: 13,
    lineHeight: 20,
  },
  categoryBadge: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(95, 205, 255, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.16)',
  },
  categoryBadgeText: {
    color: '#BAE6FD',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(21, 30, 54, 0.82)',
    borderRadius: 12,
  },
  listHeaderLabel: {
    flex: 1,
    color: 'rgba(226, 231, 255, 0.6)',
    fontSize: 12,
  },
  listHeaderRight: {
    textAlign: 'right',
  },
  listBody: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginTop: 8,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(14, 22, 42, 0.82)',
  },
  listRowAlt: {
    backgroundColor: 'rgba(18, 28, 52, 0.86)',
  },
  listSeller: {
    flex: 1,
    color: '#F7FAFF',
    fontSize: 13,
    fontWeight: '600',
  },
  listPrice: {
    flex: 1,
    color: '#34D399',
    fontSize: 13,
    fontWeight: '700',
  },
  listQuantity: {
    flex: 1,
    color: '#E5EDFF',
    fontSize: 13,
    fontWeight: '600',
  },
  listTime: {
    flex: 1,
    color: 'rgba(226, 231, 255, 0.6)',
    fontSize: 12,
    textAlign: 'right',
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: '#60A5FA',
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
  },
  actionButtonSecondary: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.6)',
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionButtonSecondaryText: {
    color: '#BFDBFE',
    fontSize: 13,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  floatingButtonText: {
    color: '#F8FAFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
