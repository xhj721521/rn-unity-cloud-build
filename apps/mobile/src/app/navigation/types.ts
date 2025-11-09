export type RootTabParamList = {
  Home: undefined;
  Trials: undefined;
  Explore: undefined;
  OnChainData: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  Leaderboard: undefined;
  Forge: undefined;
  Marketplace: undefined;
  EventShop: undefined;
  BlindBox: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  MyTeam: { initialTab?: 'members' | 'announcements' | 'chat' } | undefined;
  TeamChat: { initialTab?: 'members' | 'announcements' | 'chat' } | undefined;
  MyInventory: undefined;
  MyInvites: undefined;
  Wallet: undefined;
  Member: undefined;
  Reports: undefined;
  Highlights: undefined;
  KYC: undefined;
  Settings: undefined;
};
