import { AccountSummary } from './types';

const MOCK_ACCOUNT: AccountSummary = {
  address: '0xF1C3...D42A',
  displayName: 'Pilot Zero',
  level: 12,
  powerScore: 1840,
  tokens: [
    { id: 'tok-energy', name: '能量币', amount: '2,450', type: 'token' },
    { id: 'tok-neon', name: '霓虹碎片', amount: '780', type: 'token' },
  ],
  nfts: [
    { id: 'nft-voidblade', name: '虚空之刃', amount: '★', type: 'nft' },
    { id: 'nft-holofox', name: '全息狐伙伴', amount: 'Lv.3', type: 'nft' },
  ],
};

/**
 * 模拟链上账户概要查询。
 * 未来可切换至真实链上 SDK（ethers.js/viem）。
 */
export const fetchMockAccountSummary = async (): Promise<AccountSummary> => {
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 250));
  return MOCK_ACCOUNT;
};
