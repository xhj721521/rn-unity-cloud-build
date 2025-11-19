import {
  categoryLabel,
  kindLabel,
  MarketAsset,
  MapKind,
  oreLabels,
  personalMapLabels,
  teamMapLabels,
} from '@schemas/market';

export const marketAssetToText = (asset: MarketAsset): string => {
  const category = asset.category;
  switch (category) {
    case 'ore':
      return `${oreLabels[asset.tier]}`;
    case 'fragment':
      return `${kindLabel[asset.kind]}地图碎片 · ${mapName(asset.kind, asset.mapId)}`;
    case 'mapNft':
      return `${kindLabel[asset.kind]}地图 NFT · ${mapName(asset.kind, asset.mapId)}`;
    default:
      return categoryLabel[category];
  }
};

export const marketAssetToDesc = (asset: MarketAsset): string => {
  switch (asset.category) {
    case 'ore':
      return '可交易 · 可合成 · 可锻造';
    case 'fragment':
      return asset.kind === 'personal' ? '个人地图 · 可合成拓展' : '团队地图 · 可合成拓展';
    case 'mapNft':
      return asset.kind === 'personal' ? '个人地图 NFT · 稀有出货' : '团队地图 NFT · 稀有出货';
    default:
      return '';
  }
};

export const mapName = (kind: MapKind, mapId: string) => {
  return kind === 'personal'
    ? personalMapLabels[mapId as keyof typeof personalMapLabels]
    : teamMapLabels[mapId as keyof typeof teamMapLabels];
};
