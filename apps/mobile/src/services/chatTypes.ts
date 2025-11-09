export type MsgStatus = 'pending' | 'sent' | 'failed';
export type MsgKind = 'text' | 'system';

export interface ChatUserMeta {
  id: string;
  name: string;
  avatar?: string;
  role?: 'leader' | 'member';
}

export interface ChatMessage {
  id: string;
  teamId: string;
  user: ChatUserMeta;
  kind: MsgKind;
  text: string;
  createdAt: number;
  seq: number;
  status?: MsgStatus;
}

export interface ChatCursor {
  before?: number;
  after?: number;
}
