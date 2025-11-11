export type Member = {
  id: string;
  name: string;
  role: 'leader' | 'officer' | 'member';
  online: boolean;
  avatar?: string;
  lastSeen?: string;
  contribWeek?: number;
  intelToday?: number;
};
