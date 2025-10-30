export type ChainAsset = {
  id: string;
  name: string;
  amount: string;
  type: 'token' | 'nft';
};

export type AccountSummary = {
  address: string;
  displayName: string;
  level: number;
  powerScore: number;
  tokens: ChainAsset[];
  nfts: ChainAsset[];
};
