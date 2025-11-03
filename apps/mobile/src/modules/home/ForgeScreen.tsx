import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScreenContainer } from '@components/ScreenContainer';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';
import { ErrorState } from '@components/ErrorState';
import { useAppDispatch } from '@state/hooks';
import { loadForgeRecipes } from '@state/forge/forgeSlice';
import { useForgeData } from '@services/game/hooks';
import { ForgeCategoryKey, ForgeIngredient, ForgeRecipe } from '@services/game/forgeClient';

const TAB_COPY: Record<
  ForgeCategoryKey,
  {
    label: string;
    helper: string;
  }
> = {
  arc: { label: 'Arc 铸造', helper: '将矿石提炼为 Arc 能量，补充核心储备。' },
  fragment: { label: '碎片铸造', helper: '组合碎片，打造高阶模块与部件。' },
  nft: { label: 'NFT 铸造', helper: '消耗稀有材料，锻造全息伙伴与战衣。' },
};

const DAILY_LIMIT = {
  normal: 50,
  member: 100,
};

const getRarityTag = (rarity: ForgeIngredient['rarity'] | ForgeRecipe['result']['rarity']) => {
  switch (rarity) {
    case 'common':
      return { text: 'COMMON', color: '#9CA3AF' };
    case 'rare':
      return { text: 'RARE', color: '#34D399' };
    case 'epic':
      return { text: 'EPIC', color: '#8B5CF6' };
    case 'legendary':
    default:
      return { text: 'LEGENDARY', color: '#F97316' };
  }
};

export const ForgeScreen = () => {
  const dispatch = useAppDispatch();
  const forgeState = useForgeData();
  const [activeTab, setActiveTab] = useState<ForgeCategoryKey>('arc');

  const recipes = useMemo(() => forgeState.data?.[activeTab] ?? [], [forgeState.data, activeTab]);

  if (forgeState.status === 'idle' || forgeState.status === 'loading') {
    return (
      <ScreenContainer>
        <View style={styles.centerBox}>
          <LoadingPlaceholder label="铸造配方加载中..." />
        </View>
      </ScreenContainer>
    );
  }

  if (forgeState.status === 'failed') {
    return (
      <ScreenContainer>
        <View style={styles.centerBox}>
          <ErrorState
            title="暂时无法载入铸造信息"
            description={forgeState.error}
            onRetry={() => dispatch(loadForgeRecipes())}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.heading}>{TAB_COPY[activeTab].label}</Text>
          <Text style={styles.subHeading}>{TAB_COPY[activeTab].helper}</Text>
        </View>

        <TabRow active={activeTab} onChange={setActiveTab} />

        {activeTab === 'arc' && (
          <View style={styles.limitBanner}>
            <Text style={styles.limitText}>
              今日普通配额 {DAILY_LIMIT.normal} / 50，会员配额 {DAILY_LIMIT.member} / 100
            </Text>
            <Text style={styles.limitHint}>达到上限后需等待服务器 UTC 00:00 重置</Text>
          </View>
        )}

        <View style={styles.recipeList}>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

type TabRowProps = {
  active: ForgeCategoryKey;
  onChange: (key: ForgeCategoryKey) => void;
};

const TabRow = ({ active, onChange }: TabRowProps) => (
  <View style={styles.tabRow}>
    {(Object.keys(TAB_COPY) as ForgeCategoryKey[]).map((key) => {
      const selected = key === active;
      return (
        <Pressable
          key={key}
          style={[styles.tabButton, selected && styles.tabButtonActive]}
          android_ripple={{ color: 'rgba(124, 58, 237, 0.16)' }}
          onPress={() => onChange(key)}
        >
          <Text style={[styles.tabLabel, selected && styles.tabLabelActive]}>
            {TAB_COPY[key].label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

const RecipeCard = ({ recipe }: { recipe: ForgeRecipe }) => {
  const tag = getRarityTag(recipe.result.rarity);

  return (
    <LinearGradient
      colors={['rgba(30, 42, 72, 0.96)', 'rgba(18, 26, 52, 0.92)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.recipeCard}
    >
      <View style={styles.recipeHeader}>
        <View style={styles.recipeTitleRow}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <View style={[styles.rarityTag, { borderColor: tag.color }]}>
            <Text style={[styles.rarityText, { color: tag.color }]}>{tag.text}</Text>
          </View>
        </View>
        <Text style={styles.recipeDesc}>{recipe.description}</Text>
      </View>

      <View style={styles.recipeBody}>
        <View style={styles.ingredients}>
          {recipe.ingredients.map((ingredient) => {
            const ingredientTag = getRarityTag(ingredient.rarity);
            return (
              <View style={styles.ingredientRow} key={ingredient.name}>
                <View style={[styles.ingredientBadge, { borderColor: ingredientTag.color }]}>
                  <Text style={styles.ingredientName}>{ingredient.name}</Text>
                </View>
                <Text style={styles.ingredientQuantity}>× {ingredient.quantity}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.arrowColumn}>
          <Text style={styles.arrowSymbol}>→</Text>
        </View>

        <View style={styles.resultColumn}>
          <Text style={styles.resultName}>{recipe.result.name}</Text>
          <Text style={[styles.resultBadge, { color: tag.color }]}>{tag.text}</Text>
        </View>
      </View>

      <View style={styles.recipeFooter}>
        <View style={styles.metricGroup}>
          <Text style={styles.metricLabel}>Arc 消耗</Text>
          <Text style={styles.metricValue}>{recipe.arcCost}</Text>
        </View>
        <View style={styles.metricGroup}>
          <Text style={styles.metricLabel}>成功率</Text>
          <Text style={[styles.metricValue, recipe.successRate < 70 && styles.metricValueWarning]}>
            {recipe.successRate}%
          </Text>
        </View>
        <Pressable
          style={styles.forgeButton}
          android_ripple={{ color: 'rgba(255, 255, 255, 0.16)' }}
        >
          <Text style={styles.forgeButtonText}>开始铸造</Text>
        </Pressable>
      </View>

      {recipe.notes && <Text style={styles.recipeNote}>{recipe.notes}</Text>}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 48,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 16,
  },
  header: {
    gap: 8,
  },
  heading: {
    color: '#F7FAFF',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  subHeading: {
    color: 'rgba(226, 231, 255, 0.72)',
    fontSize: 14,
    lineHeight: 20,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tabButton: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.4)',
    backgroundColor: 'rgba(24, 28, 54, 0.86)',
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabButtonActive: {
    borderColor: '#7C3AED',
    backgroundColor: 'rgba(124, 58, 237, 0.16)',
  },
  tabLabel: {
    color: 'rgba(226, 231, 255, 0.72)',
    fontSize: 14,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#EFEAFF',
  },
  limitBanner: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(43, 76, 148, 0.32)',
    borderWidth: 1,
    borderColor: 'rgba(99, 144, 255, 0.36)',
    gap: 6,
  },
  limitText: {
    color: '#E5EDFF',
    fontSize: 14,
    fontWeight: '600',
  },
  limitHint: {
    color: 'rgba(226, 231, 255, 0.72)',
    fontSize: 12,
  },
  recipeList: {
    gap: 16,
  },
  recipeCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(18, 22, 44, 0.88)',
    gap: 16,
  },
  recipeHeader: {
    gap: 8,
  },
  recipeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  recipeTitle: {
    flex: 1,
    color: '#F7FAFF',
    fontSize: 16,
    fontWeight: '700',
  },
  rarityTag: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  rarityText: {
    fontSize: 11,
    letterSpacing: 0.6,
    fontWeight: '600',
  },
  recipeDesc: {
    color: 'rgba(226, 231, 255, 0.72)',
    fontSize: 12,
    lineHeight: 18,
  },
  recipeBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ingredients: {
    flex: 1,
    gap: 10,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ingredientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(33, 43, 72, 0.72)',
  },
  ingredientName: {
    color: '#E2E7FF',
    fontSize: 13,
  },
  ingredientQuantity: {
    color: '#F5F7FF',
    fontSize: 13,
    fontWeight: '600',
  },
  arrowColumn: {
    width: 18,
    alignItems: 'center',
  },
  arrowSymbol: {
    color: '#8EA0FF',
    fontSize: 18,
    fontWeight: '700',
  },
  resultColumn: {
    minWidth: 120,
    alignItems: 'flex-start',
    gap: 6,
  },
  resultName: {
    color: '#F7FAFF',
    fontSize: 15,
    fontWeight: '700',
  },
  resultBadge: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  recipeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricGroup: {
    minWidth: 72,
    gap: 4,
  },
  metricLabel: {
    color: 'rgba(226, 231, 255, 0.62)',
    fontSize: 12,
  },
  metricValue: {
    color: '#F7FAFF',
    fontSize: 18,
    fontWeight: '700',
  },
  metricValueWarning: {
    color: '#F97316',
  },
  forgeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
  },
  forgeButtonText: {
    color: '#F5F7FF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  recipeNote: {
    color: 'rgba(226, 231, 255, 0.72)',
    fontSize: 12,
    lineHeight: 18,
  },
});
