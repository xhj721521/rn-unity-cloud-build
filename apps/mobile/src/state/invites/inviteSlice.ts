import { createSlice } from '@reduxjs/toolkit';

export type InviteRecord = {
  id: string;
  invitee: string;
  status: 'pending' | 'accepted' | 'expired';
  reward: string;
  sentAt: string;
};

type InviteState = {
  records: InviteRecord[];
};

const initialState: InviteState = {
  records: [
    {
      id: 'invite-01',
      invitee: 'CipherWave',
      status: 'pending',
      reward: '能量币 x200',
      sentAt: '2025-10-15T09:30:00Z',
    },
    {
      id: 'invite-02',
      invitee: 'GlitchNova',
      status: 'accepted',
      reward: '盲盒券 x1',
      sentAt: '2025-10-12T18:10:00Z',
    },
    {
      id: 'invite-03',
      invitee: 'EchoRider',
      status: 'expired',
      reward: '—',
      sentAt: '2025-10-05T11:45:00Z',
    },
  ],
};

const inviteSlice = createSlice({
  name: 'invites',
  initialState,
  reducers: {},
});

export const inviteReducer = inviteSlice.reducer;
