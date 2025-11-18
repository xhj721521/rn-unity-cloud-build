import { ImageSourcePropType } from 'react-native';
import { oreIcons } from '@assets/ores';
import { mapShardIcons } from '@assets/mapshards';
import { mapNftIcons } from '@assets/mapnfts';
import { ItemCategory, ItemVisualConfig } from './itemVisualConfig';

export function resolveIconSource(config: ItemVisualConfig): ImageSourcePropType {
  switch (config.category) {
    case ItemCategory.Ore:
      return oreIcons[config.iconKey as keyof typeof oreIcons];
    case ItemCategory.PersonalMapShard:
    case ItemCategory.TeamMapShard:
      return mapShardIcons[config.iconKey as keyof typeof mapShardIcons];
    case ItemCategory.PersonalMapNft:
    case ItemCategory.TeamMapNft:
      return mapNftIcons[config.iconKey as keyof typeof mapNftIcons];
    default:
      return oreIcons.t1;
  }
}
