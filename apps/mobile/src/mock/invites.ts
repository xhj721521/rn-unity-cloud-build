export type InviteStatus = 'pending' | 'joined' | 'expired';
export type InviteSource = 'link' | 'qrcode' | 'share';

export type InviteRecord = {
  id: string;
  nickname: string;
  datetime: string;
  source: InviteSource;
  status: InviteStatus;
  reward?: string;
};

const now = new Date();
const daysAgo = (days: number, hours = 12) => {
  const date = new Date(now);
  date.setDate(now.getDate() - days);
  date.setHours(hours, (days * 7) % 60, 0, 0);
  return date.toISOString();
};

export const MOCK_INVITES: InviteRecord[] = [
  {
    id: 'inv-1001',
    nickname: '星尘Alpha',
    datetime: daysAgo(1, 10),
    source: 'link',
    status: 'joined',
    reward: '能量币 ×200',
  },
  {
    id: 'inv-1002',
    nickname: '霓虹旅人',
    datetime: daysAgo(2, 15),
    source: 'qrcode',
    status: 'pending',
  },
  {
    id: 'inv-1003',
    nickname: '冷光Beta',
    datetime: daysAgo(4, 18),
    source: 'share',
    status: 'expired',
  },
  {
    id: 'inv-1004',
    nickname: 'Trinity',
    datetime: daysAgo(0, 21),
    source: 'link',
    status: 'joined',
    reward: '盲盒券 ×1',
  },
  {
    id: 'inv-1005',
    nickname: '量子回声',
    datetime: daysAgo(7, 9),
    source: 'share',
    status: 'joined',
    reward: '能量币 ×120',
  },
  {
    id: 'inv-1006',
    nickname: '黑曜Mark',
    datetime: daysAgo(3, 11),
    source: 'link',
    status: 'pending',
  },
  {
    id: 'inv-1007',
    nickname: 'Nova-77',
    datetime: daysAgo(9, 13),
    source: 'qrcode',
    status: 'expired',
  },
  {
    id: 'inv-1008',
    nickname: '极地频段',
    datetime: daysAgo(5, 8),
    source: 'share',
    status: 'joined',
    reward: '能量币 ×80',
  },
  {
    id: 'inv-1009',
    nickname: '蓝焰Delta',
    datetime: daysAgo(6, 16),
    source: 'link',
    status: 'pending',
  },
  {
    id: 'inv-1010',
    nickname: '银色回路',
    datetime: daysAgo(12, 19),
    source: 'share',
    status: 'expired',
  },
  {
    id: 'inv-1011',
    nickname: 'Phantom-β',
    datetime: daysAgo(0, 9),
    source: 'qrcode',
    status: 'joined',
    reward: '能量币 ×260',
  },
  {
    id: 'inv-1012',
    nickname: '数据浪潮',
    datetime: daysAgo(14, 7),
    source: 'link',
    status: 'joined',
  },
  {
    id: 'inv-1013',
    nickname: 'Violet-IO',
    datetime: daysAgo(11, 20),
    source: 'share',
    status: 'pending',
  },
];
