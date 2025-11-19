import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ChatMessage } from '@services/chatTypes';

type SocketState = 'disconnected' | 'connecting' | 'connected';

type TeamChatTeamState = {
  messages: ChatMessage[];
  hasMoreBefore: boolean;
  beforeCursor?: number;
  lastSeq: number;
  lastReadSeq: number;
  unreadCount: number;
  mutedUntil?: number;
  socketState: SocketState;
};

type TeamChatStore = {
  teams: Record<string, TeamChatTeamState>;
  bootstrapTeam: (
    teamId: string,
    payload: { messages: ChatMessage[]; hasMoreBefore: boolean; beforeCursor?: number },
  ) => void;
  addOlderMessages: (
    teamId: string,
    payload: { messages: ChatMessage[]; hasMoreBefore: boolean; beforeCursor?: number },
  ) => void;
  appendMessages: (teamId: string, messages: ChatMessage[]) => void;
  addPendingMessage: (teamId: string, message: ChatMessage) => void;
  ackMessage: (teamId: string, clientId: string, serverMessage: ChatMessage) => void;
  markFailed: (teamId: string, clientId: string) => void;
  setLastReadSeq: (teamId: string, seq: number) => void;
  setUnreadCount: (teamId: string, count: number) => void;
  incrementUnread: (teamId: string, delta?: number) => void;
  setMutedUntil: (teamId: string, until?: number) => void;
  setSocketState: (teamId: string, state: SocketState) => void;
  resetTeam: (teamId: string) => void;
};

const defaultTeamState = (): TeamChatTeamState => ({
  messages: [],
  hasMoreBefore: true,
  beforeCursor: undefined,
  lastSeq: 0,
  lastReadSeq: 0,
  unreadCount: 0,
  socketState: 'disconnected',
});

export const useTeamChatStore = create<TeamChatStore>()(
  persist(
    (set, _get) => ({
      teams: {},
      bootstrapTeam: (teamId, payload) =>
        set((state) => ({
          teams: {
            ...state.teams,
            [teamId]: {
              ...defaultTeamState(),
              ...state.teams[teamId],
              messages: uniqueSorted(payload.messages),
              hasMoreBefore: payload.hasMoreBefore,
              beforeCursor: payload.beforeCursor,
              lastSeq: payload.messages.reduce((max, msg) => Math.max(max, msg.seq), 0),
              lastReadSeq: state.teams[teamId]?.lastReadSeq ?? 0,
              unreadCount: state.teams[teamId]?.unreadCount ?? 0,
              socketState: state.teams[teamId]?.socketState ?? 'disconnected',
            },
          },
        })),
      addOlderMessages: (teamId, payload) =>
        set((state) => {
          const current = state.teams[teamId] ?? defaultTeamState();
          const combined = uniqueSorted([...payload.messages, ...current.messages]);
          return {
            teams: {
              ...state.teams,
              [teamId]: {
                ...current,
                messages: combined,
                hasMoreBefore: payload.hasMoreBefore,
                beforeCursor: payload.beforeCursor,
              },
            },
          };
        }),
      appendMessages: (teamId, messages) =>
        set((state) => {
          if (!messages.length) {
            return state;
          }
          const current = state.teams[teamId] ?? defaultTeamState();
          const combined = uniqueSorted([...current.messages, ...messages]);
          const lastSeq = Math.max(current.lastSeq, ...messages.map((message) => message.seq));
          return {
            teams: {
              ...state.teams,
              [teamId]: {
                ...current,
                messages: combined,
                lastSeq,
              },
            },
          };
        }),
      addPendingMessage: (teamId, message) =>
        set((state) => {
          const current = state.teams[teamId] ?? defaultTeamState();
          return {
            teams: {
              ...state.teams,
              [teamId]: {
                ...current,
                messages: uniqueSorted([...current.messages, message]),
              },
            },
          };
        }),
      ackMessage: (teamId, clientId, serverMessage) =>
        set((state) => {
          const current = state.teams[teamId] ?? defaultTeamState();
          const nextMessages = current.messages.map((msg) => {
            if (msg.id === clientId) {
              return {
                ...msg,
                ...serverMessage,
                status: 'sent',
              };
            }
            return msg;
          }) as ChatMessage[];
          const found = current.messages.some((msg) => msg.id === clientId);
          const messages = found
            ? uniqueSorted(nextMessages)
            : uniqueSorted([...nextMessages, serverMessage] as ChatMessage[]);
          return {
            teams: {
              ...state.teams,
              [teamId]: {
                ...current,
                messages,
                lastSeq: Math.max(current.lastSeq, serverMessage.seq),
              },
            },
          };
        }),
      markFailed: (teamId, clientId) =>
        set((state) => {
          const current = state.teams[teamId] ?? defaultTeamState();
          return {
            teams: {
              ...state.teams,
              [teamId]: {
                ...current,
                messages: current.messages.map((msg) =>
                  msg.id === clientId ? { ...msg, status: 'failed' } : msg,
                ),
              },
            },
          };
        }),
      setLastReadSeq: (teamId, seq) =>
        set((state) => {
          const current = state.teams[teamId] ?? defaultTeamState();
          return {
            teams: {
              ...state.teams,
              [teamId]: {
                ...current,
                lastReadSeq: seq,
                unreadCount: 0,
              },
            },
          };
        }),
      setUnreadCount: (teamId, count) =>
        set((state) => {
          const current = state.teams[teamId] ?? defaultTeamState();
          return {
            teams: {
              ...state.teams,
              [teamId]: {
                ...current,
                unreadCount: Math.max(0, count),
              },
            },
          };
        }),
      incrementUnread: (teamId, delta = 1) =>
        set((state) => {
          const current = state.teams[teamId] ?? defaultTeamState();
          return {
            teams: {
              ...state.teams,
              [teamId]: {
                ...current,
                unreadCount: Math.max(0, current.unreadCount + delta),
              },
            },
          };
        }),
      setMutedUntil: (teamId, until) =>
        set((state) => {
          const current = state.teams[teamId] ?? defaultTeamState();
          return {
            teams: {
              ...state.teams,
              [teamId]: {
                ...current,
                mutedUntil: until,
              },
            },
          };
        }),
      setSocketState: (teamId, socketState) =>
        set((state) => {
          const current = state.teams[teamId] ?? defaultTeamState();
          return {
            teams: {
              ...state.teams,
              [teamId]: {
                ...current,
                socketState,
              },
            },
          };
        }),
      resetTeam: (teamId) =>
        set((state) => {
          const teams = { ...state.teams };
          delete teams[teamId];
          return { teams };
        }),
    }),
    {
      name: 'team-chat-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        teams: Object.fromEntries(
          Object.entries(state.teams).map(([teamId, teamState]) => [
            teamId,
            { ...teamState, socketState: 'disconnected' as SocketState },
          ]),
        ),
      }),
    },
  ),
);

const uniqueSorted = (messages: ChatMessage[]): ChatMessage[] => {
  const byId = new Map<string, ChatMessage>();
  messages.forEach((msg) => {
    byId.set(msg.id, msg);
  });
  return Array.from(byId.values()).sort((a, b) => {
    if (a.seq !== b.seq) {
      return a.seq - b.seq;
    }
    return a.createdAt - b.createdAt;
  });
};
