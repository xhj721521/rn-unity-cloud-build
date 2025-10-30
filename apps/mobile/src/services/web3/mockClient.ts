import { AccountSummary } from './types';

const MOCK_ACCOUNT: AccountSummary = {
  address: '0xF1C3...D42A',
  displayName: 'Pilot Zero',
  level: 12,
  powerScore: 1840,
  tokens: [
    { id: 'tok-energy', name: '\u80fd\u91cf\u5e01', amount: '2,450', type: 'token' },
    { id: 'tok-neon', name: '\u9713\u8679\u788e\u7247', amount: '780', type: 'token' },
  ],
  nfts: [
    { id: 'nft-voidblade', name: '\u865a\u7a7a\u4e4b\u5203', amount: '\u2605', type: 'nft' },
    { id: 'nft-holofox', name: '\u5168\u606f\u72d0\u4f19\u4f34', amount: 'Lv.3', type: 'nft' },
  ],
};

/**
 * \u6a21\u62df\u94fe\u4e0a\u8d26\u6237\u6982\u8981\u67e5\u8be2\u3002
 * \u672a\u6765\u53ef\u5207\u6362\u81f3\u771f\u5b9e\u94fe\u4e0a SDK\uff08ethers.js/viem\uff09\u3002
 */
export const fetchMockAccountSummary = async (): Promise<AccountSummary> => {
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 250));
  return MOCK_ACCOUNT;
};
