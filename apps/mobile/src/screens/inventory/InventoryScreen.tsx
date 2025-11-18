import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { ScreenContainer } from "@components/ScreenContainer";
import { CategoryChips } from "@components/inventory/CategoryChips";
import { InventoryToolbar } from "@components/inventory/Toolbar";
import InventorySlotCard from "@components/inventory/InventorySlotCard";
import { inventoryItems as visualInventoryItems } from "@mock/inventory";
import { InventoryEntry, InventoryItem, InventoryKind } from "@types/inventory";
import { typography } from "@theme/typography";
import { palette } from "@theme/colors";

type CategoryKey = "all" | "ore" | "mapShard" | "nft" | "other";

const CATEGORY_OPTIONS: Array<{ key: CategoryKey; label: string }> = [
  { key: "all", label: "全部" },
  { key: "ore", label: "矿石" },
  { key: "mapShard", label: "地图碎片" },
  { key: "nft", label: "NFT" },
  { key: "other", label: "其他" },
];

const CAPACITY: Record<CategoryKey, number> = {
  all: 120,
  ore: 60,
  mapShard: 60,
  nft: 80,
  other: 50,
};

const kindMap: Record<Exclude<CategoryKey, "all">, InventoryKind> = {
  ore: "ore",
  mapShard: "mapShard",
  nft: "nft",
  other: "other",
};

export const InventoryScreen = () => {
  const [category, setCategory] = useState<CategoryKey>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"amountDesc" | "amountAsc">("amountDesc");
  const { width } = useWindowDimensions();

  const normalized = useMemo(() => visualInventoryItems.map((item) => {
    const typeKey = item.type === "mapshard" ? "mapShard" : (item.type as CategoryKey);
    const kind = kindMap[typeKey] ?? "other";
    return {
      id: item.id,
      name: item.name,
      type: kind,
      isTeam: item.isTeam,
      tier: item.tier,
      visualCategory: item.visualCategory as any,
      visualKey: item.visualKey,
      visual: item.visual as any,
      icon: item.icon,
      amount: item.amount ?? 0,
      rarity:
        item.rarity === "legend" || item.rarity === "mythic"
          ? "legendary"
          : (item.rarity as InventoryItem["rarity"]),
    } as InventoryItem;
  }), []);
  const gap = 10;
  const columns = 4;
  const horizontalPadding = 32; // 16 * 2
  const itemSize = Math.floor((width - horizontalPadding - gap * (columns - 1)) / columns);

  const { data, usedSlots, totalSlots } = useMemo(() => {
    const total = CAPACITY[category] ?? 100;
    const currentKind = category === "all" ? undefined : kindMap[category];
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
        type: currentKind ?? "other",
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
      <Text style={styles.heading}>仓库</Text>
      <Text style={styles.subHeading}>所有资源与 NFT 均在此管理</Text>
      <CategoryChips options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
      <InventoryToolbar search={search} onSearchChange={setSearch} onPressSort={toggleSort} />

      <View style={styles.capacityRow}>
        <Text style={styles.capacityText}>已使用 {usedSlots} / {totalSlots} 仓位</Text>
        <Text style={styles.capacityHint}>分类：{category === "all" ? "全部" : CATEGORY_OPTIONS.find((c) => c.key === category)?.label}</Text>
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
