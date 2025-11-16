export type ActivityStatus = 'ongoing' | 'upcoming' | 'ended';
export type ActivityCategory = 'all' | 'member' | 'challenge' | 'raffle' | 'exchange';

export interface Activity {
  id: string;
  title: string;
  subtitle?: string;
  status: ActivityStatus;
  category: ActivityCategory;
  tags: string[];
  bannerImage: string;
  highlightText?: string;
  bulletPoints?: string[];
  startTime?: string;
  endTime?: string;
  stockText?: string;
  progressRatio?: number;
  rewardPointsPerRun?: number;
  costPointsPerOre?: number;
  ctaText: string;
  ctaType:
    | 'gotoTrial'
    | 'gotoFateMineralExchange'
    | 'gotoRaffle'
    | 'gotoMember'
    | 'gotoTeam'
    | 'openDetail';
  glowColor?: string;
  participated?: boolean;
}

export const activities: Activity[] = [
  {
    id: 'raffle-arc',
    title: '幻像 Arc 盲盒',
    subtitle: '限时注能·稀有掉落概率 +30%',
    status: 'ongoing',
    category: 'raffle',
    tags: ['限时', '掉率提升'],
    highlightText: '内含 Unity 高光粒子套装，有机会开出限定盲盒皮肤。',
    bulletPoints: ['盲盒掉落率整体提升 +30%', '限定装备仅在本期活动中产出', '活动结束后无法再获得同款皮肤'],
    stockText: '库存 42 / 120',
    progressRatio: 42 / 120,
    ctaText: '立即唤醒',
    ctaType: 'gotoRaffle',
    bannerImage: 'https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?q=80&w=800&auto=format',
    participated: true,
  },
  {
    id: 'member-monthly',
    title: '会员中心 · 月度 / 永久一键切换',
    status: 'ongoing',
    category: 'member',
    tags: ['会员专享'],
    highlightText: '当前：月度会员 · 剩余 11 天',
    bulletPoints: ['盲盒掉率 +8%', 'Unity 频道加速', '每周 200 ARC 红利空投'],
    ctaText: '续期',
    ctaType: 'gotoMember',
    bannerImage: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=800&auto=format',
  },
  {
    id: 'team-growth',
    title: '团队拓展·月度席位扩容',
    status: 'ongoing',
    category: 'challenge',
    tags: ['团队', '增益'],
    highlightText: '当前剩余 5 天 · 即将到期',
    bulletPoints: ['团队席位 +15', '训练收益 +12%', '战报优先推送'],
    rewardPointsPerRun: 30,
    ctaText: '去挑战',
    ctaType: 'gotoTrial',
    bannerImage: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=800&auto=format',
    participated: true,
  },
  {
    id: 'fate-ore-exchange',
    title: '命运秘矿兑换 · 积分铸造',
    status: 'ongoing',
    category: 'exchange',
    tags: ['兑换', '命运秘矿'],
    highlightText: '使用命运积分，铸造仅在塔内产出的第 5 矿石。',
    bulletPoints: ['积分来源：命运试炼塔 / 三重命运挑战', '当前兑换比例 100 积分 = 1 单位命运秘矿', '命运秘矿仅可在高级副本与秘矿玩法中消耗'],
    costPointsPerOre: 100,
    ctaText: '去兑换命运秘矿',
    ctaType: 'gotoFateMineralExchange',
    bannerImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format',
  },
  {
    id: 'shareholder-nft',
    title: '股东 NFT 抽签 · 仅限 200 席',
    status: 'upcoming',
    category: 'raffle',
    tags: ['抽签', '限量'],
    bulletPoints: ['报名进度 156 / 200', '持有者享受平台分红与优先内测资格'],
    highlightText: '报名成功后请留意命运战报推送',
    progressRatio: 156 / 200,
    ctaText: '等待开奖',
    ctaType: 'openDetail',
    bannerImage: 'https://images.unsplash.com/photo-1527443224154-dad5e6745661?q=80&w=800&auto=format',
    participated: false,
  },
];
