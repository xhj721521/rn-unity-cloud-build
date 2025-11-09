import React, { useEffect, useMemo, useState } from 'react';
import { ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Polyline, Stop } from 'react-native-svg';
import { ScreenContainer } from '@components/ScreenContainer';
import NeonCard from '@components/NeonCard';
import RipplePressable from '@components/RipplePressable';
import QuickGlyph from '@components/QuickGlyph';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';
import { ErrorState } from '@components/ErrorState';
import { useMarketplaceData } from '@services/game/hooks';
import { MarketCategory, MarketCategoryKey } from '@services/game/marketClient';
import { useAppDispatch } from '@state/hooks';
import { loadMarketplaceData } from '@state/market/marketSlice';
import { translate as t } from '@locale/strings';
import { palette } from '@theme/colors';
import { spacing, shape } from '@theme/tokens';
import { typography } from '@theme/typography';
import { PRESS_SCALE } from '@theme/metrics';

type CategoryFilter = 'all' | 'ore' | 'shard' | 'nft';
type MarketMode = 'trade' | 'auction';
type TradeSortKey = 'price' | 'qty' | 'latest' | 'liquidity' | 'rarity';
type AuctionSortKey = 'ending' | 'current' | 'latest' | 'hot';

type StatTickerItem = {
  key: string;
  label: string;
  value: string;
  trend?: number;
};

type AuctionLot = {
  id: string;
  title: string;
  current: number;
  endsAt: number;
  tag: string;
  bidders: number;
  hot?: boolean;
  image?: ImageSourcePropType;
};

const CATEGORY_OPTIONS: Array<{ key: CategoryFilter; label: string }> = [
  { key: 'all', label: t('market.filter.all', undefined, '全部') },
  { key: 'ore', label: t('market.filter.ore', undefined, '矿石') },
  { key: 'shard', label: t('market.filter.shard', undefined, '碎片') },
  { key: 'nft', label: t('market.filter.nft', undefined, 'NFT') },
];

const TRADE_SORT_OPTIONS: Array<{ key: TradeSortKey; label: string }> = [
  { key: 'price', label: t('market.sort.price', undefined, '价格') },
  { key: 'qty', label: t('market.sort.qty', undefined, '数量') },
  { key: 'latest', label: t('market.sort.latest', undefined, '最新') },
  { key: 'liquidity', label: t('market.sort.liquidity', undefined, '流动性') },
  { key: 'rarity', label: t('market.sort.rarity', undefined, '稀有度') },
];

const AUCTION_SORT_OPTIONS: Array<{ key: AuctionSortKey; label: string }> = [
  { key: 'ending', label: t('market.sort.ending', undefined, '即将结束') },
  { key: 'current', label: t('market.sort.current', undefined, '当前价') },
  { key: 'latest', label: t('market.sort.latest', undefined, '最新') },
  { key: 'hot', label: t('market.sort.hot', undefined, '热度') },
];

const SPARKLINE_DATA: Record<MarketCategoryKey, number[]> = {
  ores: [28, 32, 30, 34, 36, 35, 37, 42],
  fragments: [72, 75, 73, 78, 82, 88, 84, 87],
  nfts: [420, 430, 440, 460, 455, 470, 490, 510],
};

const HERO_LOT: AuctionLot = {
  id: 'hero-lot',
  title: '量子流光战衣 · Ω',
  current: 820,
  endsAt: Date.now() + 1000 * 60 * 42,
  tag: '传奇',
  bidders: 86,
  hot: true,
  image: require('../../assets/cards/card_market.webp'),
};

const GRID_AUCTIONS: AuctionLot[] = [
  {
    id: 'lot-1',
    title: '全息猎隼 · S3',
    current: 540,
    endsAt: Date.now() + 1000 * 60 * 16,
    tag: '史诗',
    bidders: 42,
  },
  {
    id: 'lot-2',
    title: '巡航机兵核心',
    current: 610,
    endsAt: Date.now() + 1000 * 60 * 54,
    tag: '传奇',
    bidders: 51,
    hot: true,
  },
  {
    id: 'lot-3',
    title: '星陨臂铠 · MkII',
    current: 420,
    endsAt: Date.now() + 1000 * 60 * 72,
    tag: '稀有',
    bidders: 27,
  },
  {
    id: 'lot-4',
    title: '灵能芯片 · Δ',
    current: 680,
    endsAt: Date.now() + 1000 * 60 * 24,
    tag: '传奇',
    bidders: 65,
  },
  {
    id: 'lot-5',
    title: '幻影飞翼',
    current: 510,
    endsAt: Date.now() + 1000 * 60 * 33,
    tag: '史诗',
    bidders: 33,
  },
  {
    id: 'lot-6',
    title: '星辉随身灯塔',
    current: 360,
    endsAt: Date.now() + 1000 * 60 * 95,
    tag: '稀有',
    bidders: 21,
  },
];

const NFT_SPOTLIGHTS = [
  { id: 'spot-1', title: '巡航机兵核心', floor: '610 ARC', delta: 8.2 },
  { id: 'spot-2', title: '幻影飞翼', floor: '510 ARC', delta: -2.6 },
  { id: 'spot-3', title: '灵能芯片 · Δ', floor: '680 ARC', delta: 5.4 },
];

const TICKER_PRESETS: Record<CategoryFilter, StatTickerItem[]> = {
  all: [
    {
      key: 'new',
      label: t('market.ticker.newListings', undefined, '今日新增挂单'),
      value: '+48',
      trend: 12.4,
    },
    {
      key: 'avg',
      label: t('market.ticker.avgChange', undefined, '均价涨跌'),
      value: '+6.2%',
      trend: 6.2,
    },
    {
      key: 'instant',
      label: t('market.ticker.instantDeals', undefined, '即时成交'),
      value: '32 单',
      trend: 4.1,
    },
  ],
  ore: [
    {
      key: 'new',
      label: t('market.ticker.newListings', undefined, '今日新增挂单'),
      value: '+18',
      trend: 4.8,
    },
    {
      key: 'avg',
      label: t('market.ticker.avgChange', undefined, '均价涨跌'),
      value: '+2.1%',
      trend: 2.1,
    },
    {
      key: 'instant',
      label: t('market.ticker.instantDeals', undefined, '即时成交'),
      value: '12 单',
      trend: 1.8,
    },
  ],
  shard: [
    {
      key: 'new',
      label: t('market.ticker.newListings', undefined, '今日新增挂单'),
      value: '+9',
      trend: 3.2,
    },
    {
      key: 'avg',
      label: t('market.ticker.avgChange', undefined, '均价涨跌'),
      value: '+7.4%',
      trend: 7.4,
    },
    {
      key: 'instant',
      label: t('market.ticker.instantDeals', undefined, '即时成交'),
      value: '8 单',
      trend: 2.6,
    },
  ],
  nft: [
    {
      key: 'new',
      label: t('market.ticker.newListings', undefined, '今日新增挂单'),
      value: '+6',
      trend: 5.1,
    },
    {
      key: 'avg',
      label: t('market.ticker.avgChange', undefined, '均价涨跌'),
      value: '+9.8%',
      trend: 9.8,
    },
    {
      key: 'instant',
      label: t('market.ticker.instantDeals', undefined, '即时成交'),
      value: '4 单',
      trend: 3.5,
    },
  ],
};

const TRADE_CATEGORY_MAP: Record<CategoryFilter, MarketCategoryKey[]> = {
  all: ['ores', 'fragments'],
  ore: ['ores'],
  shard: ['fragments'],
  nft: [],
};

const MarketBackground = () => (
  <View style={StyleSheet.absoluteFill}>
    <View style={styles.backgroundGradient} />
    <View style={styles.backgroundGlow} />
  </View>
);

export const MarketplaceScreen = () => {
  const dispatch = useAppDispatch();
  const marketState = useMarketplaceData();

  const [category, setCategory] = useState<CategoryFilter>('all');
  const [tradeSort, setTradeSort] = useState<TradeSortKey>('price');
  const [auctionSort, setAuctionSort] = useState<AuctionSortKey>('ending');

  const mode: MarketMode = category === 'nft' ? 'auction' : 'trade';

  useEffect(() => {
    if (mode === 'trade' && !TRADE_SORT_OPTIONS.find((opt) => opt.key === tradeSort)) {
      setTradeSort('price');
    }
    if (mode === 'auction' && !AUCTION_SORT_OPTIONS.find((opt) => opt.key === auctionSort)) {
      setAuctionSort('ending');
    }
  }, [mode, tradeSort, auctionSort]);

  const sections = useMemo(() => {
    if (!marketState.data || mode !== 'trade') {
      return [];
    }
    const keys = TRADE_CATEGORY_MAP[category];
    return marketState.data.filter((item) => keys.includes(item.key));
  }, [category, marketState.data, mode]);

  const nftCategory = useMemo(
    () => marketState.data?.find((item) => item.key === 'nfts'),
    [marketState.data],
  );

  const tickers = useMemo(() => TICKER_PRESETS[category], [category]);

  if (marketState.status === 'idle' || marketState.status === 'loading') {
    return (
      <ScreenContainer variant="plain" background={<MarketBackground />} edgeVignette>
        <View style={styles.centerBox}>
          <LoadingPlaceholder label={t('common.loading', undefined, '加载中...')} />
        </View>
      </ScreenContainer>
    );
  }

  if (marketState.status === 'failed') {
    return (
      <ScreenContainer variant="plain" background={<MarketBackground />} edgeVignette>
        <View style={styles.centerBox}>
          <ErrorState
            title={t('market.error.title', undefined, '暂时无法连接集市')}
            description={marketState.error}
            onRetry={() => dispatch(loadMarketplaceData())}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <View style={styles.root}>
      <ScreenContainer variant="plain" scrollable edgeVignette background={<MarketBackground />}>
        <View style={styles.header}>
          <Text style={styles.heading}>{t('market.title', undefined, '集市')}</Text>
          <Text style={styles.subHeading}>
            {t('market.subtitle', undefined, '链上实时价格脉冲 · 采购矿石/碎片/竞拍 NFT')}
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {CATEGORY_OPTIONS.map((option) => {
            const active = option.key === category;
            return (
              <RipplePressable
                key={option.key}
                style={[styles.categoryChip, active && styles.categoryChipActive]}
                onPress={() => setCategory(option.key)}
              >
                <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]}>
                  {option.label}
                </Text>
              </RipplePressable>
            );
          })}
        </ScrollView>

        <View style={styles.sortRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sortScroll}
          >
            {(mode === 'trade' ? TRADE_SORT_OPTIONS : AUCTION_SORT_OPTIONS).map((option) => {
              const active =
                mode === 'trade' ? option.key === tradeSort : option.key === auctionSort;
              return (
                <RipplePressable
                  key={option.key}
                  style={[styles.sortChip, active && styles.sortChipActive]}
                  onPress={() =>
                    mode === 'trade'
                      ? setTradeSort(option.key as TradeSortKey)
                      : setAuctionSort(option.key as AuctionSortKey)
                  }
                >
                  <Text style={[styles.sortLabel, active && styles.sortLabelActive]}>
                    {option.label}
                  </Text>
                </RipplePressable>
              );
            })}
          </ScrollView>
          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
          >
            <Text style={styles.actionButtonText}>
              {mode === 'trade'
                ? t('market.trade.quickAsk', undefined, '发布求购')
                : t('market.auction.primaryCta', undefined, '发起拍卖')}
            </Text>
          </Pressable>
        </View>

        <StatTickerRow tickers={tickers} />

        {mode === 'trade' ? (
          <>
            {category === 'all' && nftCategory ? <NftSpotlightStrip /> : null}
            {sections.map((section) => (
              <MarketSection
                key={section.key}
                category={section}
                sparkline={SPARKLINE_DATA[section.key]}
              />
            ))}
          </>
        ) : (
          <AuctionView heroLot={HERO_LOT} lots={GRID_AUCTIONS} nftCategory={nftCategory} />
        )}
      </ScreenContainer>
      <FloatingCTA variant={mode} />
    </View>
  );
};

const StatTickerRow = ({ tickers }: { tickers: StatTickerItem[] }) => (
  <View style={styles.tickerRow}>
    {tickers.map((ticker) => (
      <View key={ticker.key} style={styles.tickerCard}>
        <Text style={styles.tickerLabel}>{ticker.label}</Text>
        <Text style={styles.tickerValue}>{ticker.value}</Text>
        {typeof ticker.trend === 'number' && (
          <Text
            style={[
              styles.tickerTrend,
              ticker.trend >= 0 ? styles.tickerTrendUp : styles.tickerTrendDown,
            ]}
          >
            {ticker.trend >= 0 ? '+' : ''}
            {ticker.trend.toFixed(1)}%
          </Text>
        )}
      </View>
    ))}
  </View>
);

const MarketSection = ({
  category,
  sparkline,
}: {
  category: MarketCategory;
  sparkline: number[];
}) => {
  const listings = category.listings.slice(0, 2);
  return (
    <NeonCard
      overlayColor="rgba(10,14,30,0.78)"
      borderColors={['rgba(125,240,255,0.6)', 'rgba(138,92,255,0.6)']}
      glowColor="rgba(125,240,255,0.18)"
      contentPadding={20}
      style={styles.marketCard}
    >
      <View style={styles.marketHeader}>
        <View>
          <View style={styles.marketTitleRow}>
            <Text style={styles.marketIcon}>{category.icon}</Text>
            <Text style={styles.marketTitle}>{category.label}</Text>
          </View>
          <Text style={styles.marketDesc} numberOfLines={2}>
            {category.description}
          </Text>
        </View>
        <View style={styles.sparklineBlock}>
          <Sparkline data={sparkline} />
          {category.highlight ? (
            <Text style={styles.marketHighlight}>{category.highlight}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.tableHeading}>{t('market.section.seller', undefined, '卖家')}</Text>
        <Text style={styles.tableHeading}>
          {t('market.section.price', undefined, '价格 (ARC)')}
        </Text>
        <Text style={styles.tableHeading}>{t('market.section.qty', undefined, '数量')}</Text>
        <Text style={[styles.tableHeading, styles.tableHeadingRight]}>
          {t('market.section.updated', undefined, '更新时间')}
        </Text>
      </View>

      <View style={styles.tableBody}>
        {listings.length === 0 ? (
          <View style={styles.emptyRow}>
            <Text style={styles.emptyRowText}>
              {t('market.section.empty', undefined, '暂无挂单，稍后再来')}
            </Text>
          </View>
        ) : (
          listings.map((listing) => (
            <View key={listing.id} style={styles.tableRow}>
              <Text style={styles.rowSeller} numberOfLines={1}>
                {listing.seller}
              </Text>
              <Text style={styles.rowPrice}>{formatArc(listing.price)}</Text>
              <Text style={styles.rowQty}>{listing.quantity}</Text>
              <Text style={styles.rowUpdated}>{listing.updatedAgo}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.marketActions}>
        <RipplePressable style={styles.primaryGlass}>
          <Text style={styles.primaryGlassText}>
            {t('market.trade.viewAll', undefined, '浏览全部挂单')}
          </Text>
        </RipplePressable>
        <RipplePressable style={styles.secondaryGlass}>
          <Text style={styles.secondaryGlassText}>
            {t('market.trade.viewHistory', undefined, '查看成交记录')}
          </Text>
        </RipplePressable>
      </View>
    </NeonCard>
  );
};

const Sparkline = ({ data }: { data: number[] }) => {
  const width = 120;
  const height = 48;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const normalized = (value - min) / range;
      const y = height - normalized * height;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <Svg width={width} height={height}>
      <Defs>
        <SvgLinearGradient id="spark-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#00D1C7" />
          <Stop offset="100%" stopColor="#8A5CFF" />
        </SvgLinearGradient>
      </Defs>
      <Polyline
        points={points}
        fill="none"
        stroke="url(#spark-line)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const NftSpotlightStrip = () => (
  <View style={styles.spotlightCard}>
    <View style={styles.spotlightHeader}>
      <QuickGlyph id="blindbox" size={20} />
      <Text style={styles.spotlightTitle}>{t('market.nft.focus', undefined, 'NFT 焦点')}</Text>
      <Text style={styles.spotlightBadge}>{t('market.nft.pulse', undefined, '热度脉冲')}</Text>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {NFT_SPOTLIGHTS.map((item) => (
        <View key={item.id} style={styles.spotlightPill}>
          <Text style={styles.spotlightName} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.spotlightFloor}>{item.floor}</Text>
          <Text
            style={[
              styles.spotlightTrend,
              item.delta >= 0 ? styles.tickerTrendUp : styles.tickerTrendDown,
            ]}
          >
            {item.delta >= 0 ? '+' : ''}
            {item.delta.toFixed(1)}%
          </Text>
        </View>
      ))}
    </ScrollView>
  </View>
);

const AuctionView = ({
  heroLot,
  lots,
  nftCategory,
}: {
  heroLot: AuctionLot;
  lots: AuctionLot[];
  nftCategory?: MarketCategory;
}) => (
  <View style={styles.auctionWrapper}>
    <HeroLot lot={heroLot} />
    <View style={styles.auctionGrid}>
      {lots.map((lot) => (
        <AuctionLotCard key={lot.id} lot={lot} />
      ))}
    </View>
    {nftCategory ? <Text style={styles.auctionHint}>{nftCategory.description}</Text> : null}
  </View>
);

const HeroLot = ({ lot }: { lot: AuctionLot }) => (
  <NeonCard
    backgroundSource={lot.image}
    overlayColor="rgba(6,8,18,0.72)"
    borderColors={['#8A5CFF', '#00D1C7']}
    glowColor="rgba(138,92,255,0.35)"
    contentPadding={22}
    style={styles.heroLot}
  >
    <Text style={styles.heroLabel}>{t('market.auction.focus', undefined, '本周焦点拍品')}</Text>
    <Text style={styles.heroTitle}>{lot.title}</Text>
    <View style={styles.heroMeta}>
      <View>
        <Text style={styles.heroMetaLabel}>
          {t('market.auction.current', undefined, '当前竞价')}
        </Text>
        <Text style={styles.heroPrice}>{formatArc(lot.current)} ARC</Text>
      </View>
      <View>
        <Text style={styles.heroMetaLabel}>
          {t('market.auction.endsIn', { time: formatCountdown(lot.endsAt) }, '剩余 {time}')}
        </Text>
        <Text style={styles.heroEnds}>{formatCountdown(lot.endsAt)}</Text>
      </View>
    </View>
    <View style={styles.heroFooter}>
      <Text style={styles.heroTag}>{lot.tag}</Text>
      <Text style={styles.heroBidders}>{lot.bidders} bidders</Text>
      <RipplePressable style={styles.heroButton}>
        <Text style={styles.heroButtonText}>{t('market.auction.bid', undefined, '立即出价')}</Text>
      </RipplePressable>
    </View>
  </NeonCard>
);

const AuctionLotCard = ({ lot }: { lot: AuctionLot }) => (
  <NeonCard
    overlayColor="rgba(6,10,20,0.76)"
    borderColors={['rgba(96,205,255,0.7)', 'rgba(138,92,255,0.5)']}
    glowColor={lot.hot ? 'rgba(255,105,180,0.3)' : 'rgba(0,0,0,0)'}
    contentPadding={16}
    style={styles.auctionCard}
  >
    <View style={styles.auctionCardHeader}>
      <Text style={styles.auctionTag}>{lot.tag}</Text>
      {lot.hot ? <Text style={styles.auctionHot}>HOT</Text> : null}
    </View>
    <Text style={styles.auctionTitle} numberOfLines={2}>
      {lot.title}
    </Text>
    <View style={styles.auctionMetaRow}>
      <Text style={styles.auctionMetaLabel}>
        {t('market.auction.current', undefined, '当前竞价')}
      </Text>
      <Text style={styles.auctionMetaValue}>{formatArc(lot.current)} ARC</Text>
    </View>
    <Text style={styles.auctionCountdown}>{formatCountdown(lot.endsAt)}</Text>
    <RipplePressable style={styles.heroButton}>
      <Text style={styles.heroButtonText}>{t('market.auction.bid', undefined, '立即出价')}</Text>
    </RipplePressable>
  </NeonCard>
);

const FloatingCTA = ({ variant }: { variant: MarketMode }) => (
  <View pointerEvents="box-none" style={styles.floatingSlot}>
    <Pressable
      style={({ pressed }) => [styles.floatingButton, pressed && styles.floatingButtonPressed]}
    >
      <Text style={styles.floatingText}>
        {variant === 'trade'
          ? t('market.trade.floating', undefined, '我要上架')
          : t('market.auction.floating', undefined, '发起拍卖')}
      </Text>
    </Pressable>
  </View>
);

const formatArc = (value: number) =>
  new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2 }).format(value);

const formatCountdown = (timestamp: number) => {
  const diff = Math.max(0, timestamp - Date.now());
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#03010B',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#040312',
  },
  backgroundGlow: {
    position: 'absolute',
    top: -120,
    right: -60,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(88,82,255,0.3)',
  },
  header: {
    marginBottom: spacing.cardGap,
  },
  heading: {
    ...typography.heading,
    color: palette.text,
  },
  subHeading: {
    ...typography.body,
    color: palette.sub,
    marginTop: 8,
  },
  categoryRow: {
    gap: 10,
    paddingVertical: spacing.cardGap,
  },
  categoryChip: {
    borderRadius: shape.capsuleRadius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: 'rgba(9,12,22,0.6)',
  },
  categoryChipActive: {
    borderColor: palette.primary,
    backgroundColor: 'rgba(0,209,199,0.2)',
  },
  categoryLabel: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  categoryLabelActive: {
    color: palette.text,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.cardGap,
    marginBottom: spacing.section,
  },
  sortScroll: {
    gap: 10,
    paddingRight: 4,
  },
  sortChip: {
    borderRadius: shape.capsuleRadius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(7,10,18,0.6)',
    marginRight: 10,
  },
  sortChipActive: {
    borderColor: palette.accent,
    backgroundColor: 'rgba(138,92,255,0.22)',
  },
  sortLabel: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  sortLabelActive: {
    color: palette.text,
  },
  actionButton: {
    borderRadius: shape.capsuleRadius,
    borderWidth: 1,
    borderColor: 'rgba(138,92,255,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(10,14,30,0.85)',
  },
  actionButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: PRESS_SCALE }],
  },
  actionButtonText: {
    ...typography.captionCaps,
    color: palette.text,
  },
  tickerRow: {
    flexDirection: 'row',
    gap: spacing.cardGap,
    marginBottom: spacing.section,
  },
  tickerCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    backgroundColor: 'rgba(6,8,18,0.7)',
  },
  tickerLabel: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  tickerValue: {
    ...typography.subtitle,
    color: palette.text,
    marginTop: 8,
  },
  tickerTrend: {
    ...typography.captionCaps,
    marginTop: 6,
  },
  tickerTrendUp: {
    color: '#2EE36F',
  },
  tickerTrendDown: {
    color: palette.accent,
  },
  marketCard: {
    marginBottom: spacing.section,
  },
  marketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 16,
  },
  marketTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  marketIcon: {
    fontSize: 20,
  },
  marketTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  marketDesc: {
    ...typography.body,
    color: palette.sub,
    marginTop: 6,
    maxWidth: 200,
  },
  sparklineBlock: {
    alignItems: 'flex-end',
  },
  marketHighlight: {
    ...typography.captionCaps,
    color: palette.primary,
    marginTop: 6,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(9,12,22,0.65)',
  },
  tableHeading: {
    flex: 1,
    ...typography.captionCaps,
    color: palette.sub,
  },
  tableHeadingRight: {
    textAlign: 'right',
  },
  tableBody: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginTop: 10,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'rgba(6,8,16,0.7)',
  },
  rowSeller: {
    flex: 1,
    ...typography.body,
    color: palette.text,
  },
  rowPrice: {
    flex: 1,
    ...typography.numeric,
    color: palette.primary,
  },
  rowQty: {
    flex: 1,
    ...typography.body,
    color: palette.text,
  },
  rowUpdated: {
    flex: 1,
    ...typography.caption,
    color: palette.muted,
    textAlign: 'right',
  },
  emptyRow: {
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  emptyRowText: {
    ...typography.caption,
    color: palette.sub,
  },
  marketActions: {
    flexDirection: 'row',
    gap: spacing.cardGap,
    marginTop: 16,
  },
  primaryGlass: {
    flex: 1,
    borderRadius: shape.capsuleRadius,
    borderWidth: 1,
    borderColor: 'rgba(125,240,255,0.6)',
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryGlassText: {
    ...typography.captionCaps,
    color: palette.text,
  },
  secondaryGlass: {
    flex: 1,
    borderRadius: shape.capsuleRadius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryGlassText: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  spotlightCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    backgroundColor: 'rgba(6,8,18,0.72)',
    marginBottom: spacing.section,
  },
  spotlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  spotlightTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  spotlightBadge: {
    ...typography.captionCaps,
    color: palette.primary,
    marginLeft: 'auto',
  },
  spotlightPill: {
    width: 180,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 12,
    marginRight: 12,
  },
  spotlightName: {
    ...typography.body,
    color: palette.text,
  },
  spotlightFloor: {
    ...typography.caption,
    color: palette.sub,
    marginTop: 6,
  },
  spotlightTrend: {
    ...typography.captionCaps,
    marginTop: 6,
  },
  auctionWrapper: {
    gap: spacing.section,
  },
  heroLot: {
    marginBottom: spacing.section,
  },
  heroLabel: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  heroTitle: {
    ...typography.title,
    color: palette.text,
    marginTop: 8,
  },
  heroMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  heroMetaLabel: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  heroPrice: {
    ...typography.heading,
    color: palette.text,
    marginTop: 6,
  },
  heroEnds: {
    ...typography.subtitle,
    color: palette.primary,
    marginTop: 6,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },
  heroTag: {
    ...typography.captionCaps,
    color: palette.text,
  },
  heroBidders: {
    ...typography.caption,
    color: palette.sub,
  },
  heroButton: {
    marginLeft: 'auto',
    borderRadius: shape.capsuleRadius,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    backgroundColor: 'rgba(9,12,22,0.8)',
  },
  heroButtonText: {
    ...typography.captionCaps,
    color: palette.text,
  },
  auctionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.cardGap,
    justifyContent: 'space-between',
  },
  auctionCard: {
    width: '48%',
  },
  auctionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  auctionTag: {
    ...typography.captionCaps,
    color: palette.primary,
  },
  auctionHot: {
    ...typography.captionCaps,
    color: '#FF8AA4',
  },
  auctionTitle: {
    ...typography.subtitle,
    color: palette.text,
    minHeight: 44,
  },
  auctionMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  auctionMetaLabel: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  auctionMetaValue: {
    ...typography.body,
    color: palette.text,
  },
  auctionCountdown: {
    ...typography.captionCaps,
    color: palette.primary,
    marginVertical: 8,
  },
  auctionHint: {
    ...typography.caption,
    color: palette.sub,
  },
  floatingSlot: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
    paddingHorizontal: spacing.pageHorizontal,
  },
  floatingButton: {
    borderRadius: shape.capsuleRadius,
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: 'rgba(0,209,199,0.32)',
    borderWidth: 1,
    borderColor: palette.primary,
  },
  floatingButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: PRESS_SCALE }],
  },
  floatingText: {
    ...typography.subtitle,
    color: palette.text,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
