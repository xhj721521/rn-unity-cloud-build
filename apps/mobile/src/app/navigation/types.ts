export type MarketStackParamList = {
  MarketHome: undefined;
  MarketListings: { type?: 'ore' | 'shard' | 'nft'; side?: 'sell' | 'buy' | 'all' } | undefined;
  MarketHistory: { type: 'ore' | 'shard' };
  MarketNewOrder: { type: 'ore' | 'shard'; mode: 'buy' | 'sell' };
  MarketNewAuction: undefined;
};

export type RootTabParamList = {
  Home: { screen?: keyof HomeStackParamList } | undefined;
  Market: { screen?: keyof MarketStackParamList } | undefined;
  Trials: undefined;
  Explore: undefined;
  Profile: { screen?: keyof ProfileStackParamList } | undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  Leaderboard: undefined;
  Forge: undefined;
  EventShop: undefined;
  BlindBox: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  MyTeam: { initialTab?: 'members' | 'announcements' | 'chat' } | undefined;
  TeamChat: { initialTab?: 'members' | 'announcements' | 'chat' } | undefined;
  MyInventory: undefined;
  MyInvites: undefined;
  PosterWorkshop: undefined;
  Wallet: undefined;
  Member: undefined;
  Reports: undefined;
  Highlights: undefined;
  KYC: undefined;
  Settings: undefined;
  LanguageSettings: undefined;
  NotificationsSettings: undefined;
  FundsRecord: undefined;
  RaidLobby: undefined;
};
