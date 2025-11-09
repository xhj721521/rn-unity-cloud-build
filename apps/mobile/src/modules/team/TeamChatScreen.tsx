import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '@components/ScreenContainer';
import { MessageList } from '@components/chat/MessageList';
import { Composer } from '@components/chat/Composer';
import { JoinGate } from '@components/chat/JoinGate';
import { UnreadToast } from '@components/chat/UnreadToast';
import { useTeamChatStore } from '@store/useTeamChatStore';
import { fetchTeamMessages } from '@services/chatApi';
import { ChatMessage } from '@services/chatTypes';
import { connectTeamChat, ChatSocketConnection } from '@services/chatSocket';
import { useAppSelector } from '@state/hooks';
import { palette } from '@theme/colors';
import { typography } from '@theme/typography';
import { TeamTabsBar, TeamTabKey } from '@components/TeamTabsBar';
import { ProfileStackParamList } from '@app/navigation/types';

const TEAM_ID = 'alpha-squad';
const currentUser = {
  id: 'pilot-zero',
  name: 'Pilot Zero',
  role: 'leader' as const,
};

export const TeamChatScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const members = useAppSelector((state) => state.team.members);
  const isInTeam = members.length > 0;
  const teamState = useTeamChatStore((state) => state.teams[TEAM_ID]);
  const bootstrapTeam = useTeamChatStore((state) => state.bootstrapTeam);
  const addOlder = useTeamChatStore((state) => state.addOlderMessages);
  const appendMessages = useTeamChatStore((state) => state.appendMessages);
  const addPendingMessage = useTeamChatStore((state) => state.addPendingMessage);
  const ackMessage = useTeamChatStore((state) => state.ackMessage);
  const markFailed = useTeamChatStore((state) => state.markFailed);
  const setLastReadSeq = useTeamChatStore((state) => state.setLastReadSeq);
  const setUnreadCount = useTeamChatStore((state) => state.setUnreadCount);
  const incrementUnread = useTeamChatStore((state) => state.incrementUnread);
  const setSocketState = useTeamChatStore((state) => state.setSocketState);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const socketRef = useRef<ChatSocketConnection | null>(null);
  const listRef = useRef<FlatList>(null);

  const messages = teamState?.messages ?? [];
  const unread = teamState?.unreadCount ?? 0;
  const hasMoreBefore = teamState?.hasMoreBefore ?? false;
  const mutedUntil = teamState?.mutedUntil;

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const result = await fetchTeamMessages(TEAM_ID, { limit: 24 });
      if (!mounted) {
        return;
      }
      bootstrapTeam(TEAM_ID, {
        messages: result.items,
        hasMoreBefore: Boolean(result.nextBefore),
        beforeCursor: result.nextBefore,
      });
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [bootstrapTeam]);

  useEffect(() => {
    if (!isInTeam) {
      return;
    }
    setSocketState(TEAM_ID, 'connecting');
    const connection = connectTeamChat({
      teamId: TEAM_ID,
      currentUser,
      onMessage: (message) => {
        appendMessages(TEAM_ID, [message]);
        if (message.user.id !== currentUser.id) {
          if (isAtBottom) {
            setLastReadSeq(TEAM_ID, message.seq);
            scrollToBottom();
          } else {
            incrementUnread(TEAM_ID, 1);
          }
        }
      },
      onAck: (clientId, message) => {
        if (message.status === 'failed') {
          markFailed(TEAM_ID, clientId);
        } else {
          ackMessage(TEAM_ID, clientId, message);
          scrollToBottom();
        }
      },
    });
    socketRef.current = connection;
    setSocketState(TEAM_ID, 'connected');
    return () => {
      connection.disconnect();
      socketRef.current = null;
      setSocketState(TEAM_ID, 'disconnected');
    };
  }, [
    appendMessages,
    ackMessage,
    incrementUnread,
    isAtBottom,
    isInTeam,
    markFailed,
    setLastReadSeq,
    setSocketState,
  ]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMoreBefore || loading) {
      return;
    }
    setLoadingMore(true);
    const nextBefore = teamState?.beforeCursor;
    const result = await fetchTeamMessages(TEAM_ID, {
      before: nextBefore,
      limit: 20,
    });
    addOlder(TEAM_ID, {
      messages: result.items,
      hasMoreBefore: Boolean(result.nextBefore),
      beforeCursor: result.nextBefore,
    });
    setLoadingMore(false);
  };

  const handleSend = (text: string) => {
    if (!isInTeam) {
      return;
    }
    const clientId = `tmp-${Date.now()}`;
    const pending: ChatMessage = {
      id: clientId,
      teamId: TEAM_ID,
      user: currentUser,
      kind: 'text',
      text,
      createdAt: Date.now(),
      seq: Date.now(),
      status: 'pending',
    };
    addPendingMessage(TEAM_ID, pending);
    socketRef.current?.sendMessage({ clientId, text });
    scrollToBottom();
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  };

  const handleUnreadPress = () => {
    scrollToBottom();
    const lastSeq = teamState?.lastSeq ?? 0;
    setLastReadSeq(TEAM_ID, lastSeq);
    setUnreadCount(TEAM_ID, 0);
  };

  const headerSubtitle = useMemo(() => {
    const online = Math.max(1, Math.floor(members.length * 0.6));
    return `在线 ${online}`;
  }, [members.length]);

  const handleTabChange = (tab: TeamTabKey) => {
    if (tab === 'chat') {
      return;
    }
    navigation.navigate('MyTeam', {
      initialTab: tab,
    } as never);
  };

  if (!isInTeam) {
    return (
      <ScreenContainer variant="plain" edgeVignette>
        <TeamTabsBar active="chat" onChange={handleTabChange} />
        <JoinGate onJoin={() => navigation.navigate('MyTeam' as never)} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer variant="plain" edgeVignette scrollable={false}>
      <TeamTabsBar active="chat" onChange={handleTabChange} />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>团队聊天</Text>
          <Text style={styles.subtitle}>{headerSubtitle}</Text>
        </View>
        <View style={styles.headerActions}>
          <Text style={styles.actionText}>禁言</Text>
          <Text style={styles.actionText}>举报</Text>
          <Text style={styles.actionText}>设置</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <Text style={styles.loaderText}>加载中...</Text>
        </View>
      ) : (
        <>
          <View style={styles.listWrapper}>
            <MessageList
              ref={listRef}
              messages={messages}
              currentUserId={currentUser.id}
              hasMore={hasMoreBefore}
              loadingMore={loadingMore}
              onLoadMore={handleLoadMore}
              onRetry={(message) => handleSend(message.text)}
              onBottomStateChange={(state) => {
                setIsAtBottom(state);
                if (state) {
                  const lastSeq = teamState?.lastSeq ?? 0;
                  setLastReadSeq(TEAM_ID, lastSeq);
                  setUnreadCount(TEAM_ID, 0);
                }
              }}
            />
            <UnreadToast count={unread} onPress={handleUnreadPress} />
          </View>
          <Composer onSend={handleSend} mutedUntil={mutedUntil} />
        </>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionText: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  title: {
    ...typography.subtitle,
    color: palette.text,
  },
  subtitle: {
    ...typography.caption,
    color: palette.sub,
    marginTop: 4,
  },
  listWrapper: {
    flex: 1,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    ...typography.body,
    color: palette.sub,
  },
});

export default TeamChatScreen;
