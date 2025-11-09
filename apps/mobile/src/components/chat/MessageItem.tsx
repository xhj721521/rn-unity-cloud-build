import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChatMessage } from '@services/chatTypes';
import { palette } from '@theme/colors';
import { typography } from '@theme/typography';
import { shape } from '@theme/tokens';

type Props = {
  message: ChatMessage;
  isSelf: boolean;
  showAvatar?: boolean;
  onRetry?: (message: ChatMessage) => void;
};

export const MessageItem = ({ message, isSelf, showAvatar = true, onRetry }: Props) => {
  if (message.kind === 'system') {
    return (
      <View style={styles.systemRow}>
        <Text style={styles.systemText}>{message.text}</Text>
      </View>
    );
  }

  const bubbleStyle = [
    styles.bubble,
    isSelf ? styles.bubbleSelf : styles.bubblePeer,
    { alignSelf: isSelf ? 'flex-end' : 'flex-start' },
  ];

  return (
    <View style={[styles.row, isSelf && styles.rowSelf]}>
      {!isSelf && showAvatar ? (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{message.user.name.slice(0, 1)}</Text>
        </View>
      ) : (
        <View style={styles.avatarPlaceholder} />
      )}
      <View style={styles.content}>
        <View style={styles.metaRow}>
          <Text style={styles.name}>{message.user.name}</Text>
          <Text style={styles.time}>{formatTime(message.createdAt)}</Text>
        </View>
        <View style={bubbleStyle}>
          <Text style={styles.messageText}>{message.text}</Text>
        </View>
        {message.status === 'failed' && (
          <Pressable style={styles.retryButton} onPress={() => onRetry?.(message)}>
            <Text style={styles.retryText}>发送失败 · 点击重试</Text>
          </Pressable>
        )}
        {message.status === 'pending' && <Text style={styles.pendingText}>发送中…</Text>}
      </View>
    </View>
  );
};

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 14,
    marginRight: 8,
  },
  rowSelf: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,209,199,0.24)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarPlaceholder: {
    width: 36,
    marginRight: 8,
  },
  avatarText: {
    ...typography.subtitle,
    color: palette.text,
  },
  content: {
    maxWidth: '80%',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  name: {
    ...typography.captionCaps,
    color: palette.text,
  },
  time: {
    ...typography.caption,
    color: palette.sub,
  },
  bubble: {
    borderRadius: shape.cardRadius,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  bubbleSelf: {
    backgroundColor: 'rgba(0,209,199,0.12)',
    borderColor: 'rgba(0,209,199,0.6)',
  },
  bubblePeer: {
    backgroundColor: 'rgba(9,12,22,0.85)',
    borderColor: 'rgba(255,255,255,0.12)',
  },
  messageText: {
    ...typography.body,
    color: palette.text,
    lineHeight: 20,
  },
  systemRow: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  systemText: {
    ...typography.caption,
    color: palette.sub,
  },
  retryButton: {
    marginTop: 6,
  },
  retryText: {
    ...typography.caption,
    color: '#FF8AA4',
  },
  pendingText: {
    ...typography.caption,
    color: palette.sub,
    marginTop: 4,
  },
});
