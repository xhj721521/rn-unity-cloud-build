import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MarketAsset } from '@schemas/market';
import EnergyItemIcon from '@components/items/EnergyItemIcon';
import { marketAssetToDesc, marketAssetToText, resolveMarketVisual } from './utils';

type AssetBadgeProps = {
  asset: MarketAsset;
};

export const AssetBadge: React.FC<AssetBadgeProps> = ({ asset }) => {
  const title = marketAssetToText(asset);
  const desc = marketAssetToDesc(asset);
  const visual = resolveMarketVisual(asset);

  return (
    <View style={styles.row}>
      {visual ? (
        <EnergyItemIcon visual={visual} size={54} />
      ) : (
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>{title.charAt(0)}</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.desc} numberOfLines={1}>
          {desc}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(56,189,248,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { color: '#7FFBFF', fontWeight: '700' },
  title: { color: '#F9FAFB', fontSize: 14, fontWeight: '600' },
  desc: { color: 'rgba(148,163,184,0.85)', fontSize: 12, marginTop: 2 },
});

export default AssetBadge;
