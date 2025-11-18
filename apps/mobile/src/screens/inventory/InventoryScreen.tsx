import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { ScreenContainer } from "@components/ScreenContainer";
import { CategoryChips } from "@components/inventory/CategoryChips";
import { InventoryToolbar } from "@components/inventory/Toolbar";
import InventorySlotCard from "@components/inventory/InventorySlotCard";
import { inventoryItems, ItemType, UIItem } from "@mock/inventory";
import { getItemVisual, ItemVisualConfig } from "@domain/items/itemVisualConfig";
import { resolveIconSource } from "@domain/items/itemIconResolver";
import { InventoryEntry, InventoryItem, InventoryKind } from "@types/inventory";
import { typography } from "@theme/typography";
import { palette } from "@theme/colors";

const CATEGORY_OPTIONS: Array<{ key: ItemType | "all"; label: string }> = [
  { key: "all", label: "\u5168\u90e8" },
  { key: "ore", label: "\u77ff\u77f3" },
  { key: "mapshard", label: "\u5730\u56fe\u788e\u7247" },
  { key: "minershard", label: "\u77ff\u5de5\u788e\u7247" },
  { key: "nft", label: "NFT" },
  { key: "other", label: "\u5176\u4ed6" },
];

const CAPACITY: Record<ItemType | "all", number> = {
  all: 120,
  ore: 60,
  mapshard: 60,
  minershard: 40,
  nft: 80,
  other: 50,
};

const kindMap: Record<ItemType, InventoryKind> = {
  ore: "ore",
  mapshard: "mapShard",
  minershard: "workerShard",
  nft: "nft",
  other: "other",
};

const deriveVisual = (item: UIItem): ItemVisualConfig | undefined => {
  if (!item.visualCategory || !item.visualKey || !item.tier) return undefined;
  return getItemVisual(item.visualCategory, item.tier, item.visualKey);
};

const normalizeItem = (item: UIItem): InventoryItem => {
  const kind = kindMap[item.type];
  const visual = deriveVisual(item);
  const icon = visual ? resolveIconSource(visual) : item.icon;
  return {
    id: item.id,
    name: visual?.displayName ?? item.name,
    type: kind,
    isTeam: item.isTeam,
    tier: visual?.tier ?? item.tier,
    visualCategory: item.visualCategory,
    visualKey: item.visualKey,
    visual,
    icon,
    amount: item.qty,
    rarity:
      item.rarity === "legend" || item.rarity === "mythic"
        ? "legendary"
        : (item.rarity as InventoryItem["rarity"]),
  };
};

export const InventoryScreen = () => {
  const [category, setCategory] = useState<ItemType | "all">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"amountDesc" | "amountAsc">("amountDesc");
  const { width } = useWindowDimensions();

  const normalized = useMemo(() => inventoryItems.map(normalizeItem), []);
  const gap = 10;
  const columns = 4;
  const horizontalPadding = 32; // 16 * 2
  const itemSize = Math.floor((width - horizontalPadding - gap * (columns - 1)) / columns);

  const { data, usedSlots, totalSlots } = useMemo(() => {
    const total = CAPACITY[category] ?? 100;
    const currentKind = category === "all" ? undefined : kindMap[category as ItemType];
    const filteredBase =
      category === "all" ? normalized : normalized.filter((item) => item.type === currentKind);

    const keyword = search.trim().toLowerCase();
    const filtered = filteredBase.filter((item) =>
      keyword ? item.name.toLowerCase().includes(keyword) : true,
    );

    const sorted = [...filtered].sort((a, b) => (sort === "amountDesc" ? b.amount - a.amount : a.amount - b.amount));

    const used = sorted.length;
    const free = category === "all" ? 0 : Math.max(total - used, 0);

    const entries: InventoryEntry[] = sorted;
    if (free > 0 && category !== "all") {
      entries.push({
        id: `empty-${category}`,
        kind: "emptySummary",
        type: kindMap[category as ItemType],
        freeSlots: free,
      });
    }

    return { data: entries, usedSlots: used, totalSlots: total };
  }, [category, normalized, search, sort]);

  const handlePress = (item: InventoryEntry) => {
    if ((item as any).kind === "emptySummary") return;
    console.log("open item", (item as InventoryItem).id);
  };

  const handleLongPress = (item: InventoryEntry) => {
    console.log("long press", (item as InventoryItem).id);
  };

  const toggleSort = () => setSort((prev) => (prev === "amountDesc" ? "amountAsc" : "amountDesc"));

  return (
    <ScreenContainer variant="plain" edgeVignette>
      <Text style={styles.heading}>\u4ed3\u5e93</Text>
      <Text style={styles.subHeading}>\u6240\u6709\u8d44\u6e90\u4e0e NFT \u5747\u5728\u6b64\u7ba1\u7406</Text>
      <CategoryChips options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
      <InventoryToolbar search={search} onSearchChange={setSearch} onPressSort={toggleSort} />

      <View style={styles.capacityRow}>
        <Text style={styles.capacityText}>\u5df2\u4f7f\u7528 {usedSlots} / {totalSlots} \u4ed3\u4f4d</Text>
        <Text style={styles.capacityHint}>\u5206\u7c7b\uff1a{category === "all" ? "\u5168\u90e8" : CATEGORY_OPTIONS.find((c) => c.key === category)?.label}</Text>
      </View>

      <FlatList
        data={data}
        numColumns={columns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <InventorySlotCard
            item={item}
            size={itemSize}
            onPress={handlePress}
            onLongPress={handleLongPress}
          />
        )}
        columnWrapperStyle={{ gap, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}
        ItemSeparatorComponent={() => <View style={{ height: gap }} />}
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        windowSize={6}
        removeClippedSubviews
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  heading: {
    ...typography.heading,
    fontSize: 22,
    color: palette.text,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  subHeading: {
    ...typography.body,
    color: palette.sub,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  capacityRow: {
    paddingHorizontal: 16,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  capacityText: {
    ...typography.caption,
    color: palette.text,
  },
  capacityHint: {
    ...typography.caption,
    color: "rgba(229,242,255,0.7)",
  },
});

export default InventoryScreen;
