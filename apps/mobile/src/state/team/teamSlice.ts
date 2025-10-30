import { createSlice } from '@reduxjs/toolkit';

export type TeamMember = {
  id: string;
  nickname: string;
  role: 'leader' | 'member' | 'support';
  powerScore: number;
  lastActive: string;
};

type TeamState = {
  members: TeamMember[];
};

const initialState: TeamState = {
  members: [
    {
      id: 'alpha',
      nickname: 'PhotonBlade',
      role: 'leader',
      powerScore: 2180,
      lastActive: '2025-10-18T08:32:00Z',
    },
    {
      id: 'beta',
      nickname: 'NeonScout',
      role: 'member',
      powerScore: 1760,
      lastActive: '2025-10-18T06:20:00Z',
    },
    {
      id: 'gamma',
      nickname: 'SynthMedic',
      role: 'support',
      powerScore: 1540,
      lastActive: '2025-10-17T22:15:00Z',
    },
  ],
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {},
});

export const teamReducer = teamSlice.reducer;
