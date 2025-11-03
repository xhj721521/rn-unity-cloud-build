export type MarketCategoryKey = 'ores' | 'fragments' | 'nfts';

export type MarketListing = {
  id: string;
  seller: string;
  price: number;
  quantity: number;
  updatedAgo: string;
};

export type MarketCategory = {
  key: MarketCategoryKey;
  label: string;
  description: string;
  icon: string;
  highlight?: string;
  listings: MarketListing[];
};

const MOCK_MARKET_DATA: MarketCategory[] = [
  {
    key: 'ores',
    label: '矿石市场',
    description: '原矿与精炼原料集中交易区，适合 Arc 提炼与基础锻造。',
    icon: '⛏️',
    highlight: '今日新增 12 条求购',
    listings: [
      {
        id: 'ores-001',
        seller: 'Pilot_207',
        price: 12.4,
        quantity: 120,
        updatedAgo: '2 分钟前',
      },
      {
        id: 'ores-002',
        seller: 'NanoForge',
        price: 11.9,
        quantity: 300,
        updatedAgo: '7 分钟前',
      },
      {
        id: 'ores-003',
        seller: '星熔工坊',
        price: 13.6,
        quantity: 80,
        updatedAgo: '12 分钟前',
      },
    ],
  },
  {
    key: 'fragments',
    label: '碎片市场',
    description: '高阶碎片与模块在此集散，可直接用于铸造中级装备。',
    icon: '🧩',
    highlight: '稀有碎片均价 +6.5%',
    listings: [
      {
        id: 'frag-001',
        seller: 'BeaconLab',
        price: 86,
        quantity: 24,
        updatedAgo: '5 分钟前',
      },
      {
        id: 'frag-002',
        seller: 'Aurora',
        price: 92,
        quantity: 10,
        updatedAgo: '9 分钟前',
      },
    ],
  },
  {
    key: 'nfts',
    label: 'NFT 交易所',
    description: '全息伙伴、战衣与尖端装备的拍卖区，支持即时成交与求购。',
    icon: '🪐',
    highlight: '本周已成交 37 件传奇装备',
    listings: [
      {
        id: 'nft-001',
        seller: 'EchoVerse',
        price: 540,
        quantity: 1,
        updatedAgo: '15 分钟前',
      },
      {
        id: 'nft-002',
        seller: 'ArcGuild',
        price: 620,
        quantity: 2,
        updatedAgo: '25 分钟前',
      },
    ],
  },
];

export const fetchMarketplaceData = async (): Promise<MarketCategory[]> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_MARKET_DATA), 280);
  });
