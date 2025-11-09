import { ChatMessage } from './chatTypes';
import { sendTeamMessage } from './chatApi';

type ConnectParams = {
  teamId: string;
  currentUser: ChatMessage['user'];
  onMessage?: (message: ChatMessage) => void;
  onAck?: (clientId: string, message: ChatMessage) => void;
};

export type ChatSocketConnection = {
  sendMessage: (payload: { clientId: string; text: string }) => void;
  disconnect: () => void;
};

export const connectTeamChat = ({
  teamId,
  currentUser,
  onMessage,
  onAck,
}: ConnectParams): ChatSocketConnection => {
  let closed = false;
  const mockInterval = setInterval(() => {
    if (closed) {
      return;
    }
    const timestamp = Date.now();
    const simulated: ChatMessage = {
      id: `sim-${timestamp}`,
      teamId,
      kind: 'text',
      text: '巡逻完成，资源已交付。',
      createdAt: timestamp,
      seq: timestamp,
      user: {
        id: 'scout-bot',
        name: 'AutoScout',
        role: 'member',
      },
    };
    onMessage?.(simulated);
  }, 45000);

  return {
    sendMessage: ({ clientId, text }) => {
      if (closed) {
        return;
      }
      sendTeamMessage(teamId, currentUser, text)
        .then((msg) => {
          if (!closed) {
            onAck?.(clientId, msg);
          }
        })
        .catch(() => {
          if (!closed) {
            onAck?.(clientId, {
              id: clientId,
              teamId,
              user: currentUser,
              kind: 'text',
              text,
              createdAt: Date.now(),
              seq: Date.now(),
              status: 'failed',
            });
          }
        });
    },
    disconnect: () => {
      closed = true;
      clearInterval(mockInterval);
    },
  };
};
