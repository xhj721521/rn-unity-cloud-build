export type ForgeCategoryKey = 'arc' | 'fragment' | 'nft';

export type ForgeIngredient = {
  name: string;
  quantity: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
};

export type ForgeRecipe = {
  id: string;
  title: string;
  description: string;
  ingredients: ForgeIngredient[];
  result: {
    name: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  };
  arcCost: number;
  successRate: number;
  notes?: string;
};

export type ForgeRecipesResponse = Record<ForgeCategoryKey, ForgeRecipe[]>;

const MOCK_FORGE_RECIPES: ForgeRecipesResponse = {
  arc: [
    {
      id: 'arc-01',
      title: '高纯 Arc 精炼',
      description: '以标准矿石组合稳定产出 Arc 能量。',
      ingredients: [
        { name: '辉耀矿晶', quantity: 3, rarity: 'rare' },
        { name: '量子粉末', quantity: 6, rarity: 'common' },
      ],
      result: { name: 'Arc × 15', rarity: 'rare' },
      arcCost: 0,
      successRate: 92,
      notes: '今日普通配额：50 / 50',
    },
    {
      id: 'arc-02',
      title: '超导 Arc 脉冲',
      description: '转化稀有矿源，高产但存在失败风险。',
      ingredients: [
        { name: '霓虹矿核', quantity: 2, rarity: 'epic' },
        { name: '冷凝碎屑', quantity: 8, rarity: 'common' },
      ],
      result: { name: 'Arc × 40', rarity: 'epic' },
      arcCost: 5,
      successRate: 68,
      notes: '失败返还 30% 材料',
    },
  ],
  fragment: [
    {
      id: 'fragment-01',
      title: '守护者装甲碎片',
      description: '兼容前排单位的防御型碎片组件。',
      ingredients: [
        { name: '钛合金碎块', quantity: 5, rarity: 'rare' },
        { name: '黑曜端口', quantity: 1, rarity: 'epic' },
      ],
      result: { name: '守护者装甲碎片', rarity: 'epic' },
      arcCost: 12,
      successRate: 80,
    },
    {
      id: 'fragment-02',
      title: '音脉模块',
      description: '提升音波系装备的增幅模块。',
      ingredients: [
        { name: '音律结晶', quantity: 3, rarity: 'rare' },
        { name: '共振电容', quantity: 2, rarity: 'rare' },
      ],
      result: { name: '音脉增幅器', rarity: 'rare' },
      arcCost: 8,
      successRate: 94,
    },
  ],
  nft: [
    {
      id: 'nft-01',
      title: '全息狐伙伴',
      description: '召唤忠诚的全息伙伴协助探索。',
      ingredients: [
        { name: '灵感碎片', quantity: 4, rarity: 'epic' },
        { name: '幻相晶片', quantity: 2, rarity: 'epic' },
        { name: '星辉残页', quantity: 1, rarity: 'legendary' },
      ],
      result: { name: '全息狐伙伴 NFT', rarity: 'legendary' },
      arcCost: 36,
      successRate: 55,
      notes: '失败返还 50% Arc 与稀有材料',
    },
    {
      id: 'nft-02',
      title: '光栅战衣',
      description: '打造提升敏捷属性的定制战衣。',
      ingredients: [
        { name: '纤维束缚', quantity: 6, rarity: 'rare' },
        { name: '相位网格', quantity: 2, rarity: 'epic' },
      ],
      result: { name: '光栅战衣 NFT', rarity: 'epic' },
      arcCost: 24,
      successRate: 72,
    },
  ],
};

export const fetchForgeRecipes = async (): Promise<ForgeRecipesResponse> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_FORGE_RECIPES), 240);
  });
