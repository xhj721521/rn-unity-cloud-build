import React, { forwardRef, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ChatMessage } from '@services/chatTypes';
import { MessageItem } from './MessageItem';
import { palette } from '@theme/colors';
import { typography } from '@theme/typography';
import { useBottomGutter } from '@hooks/useBottomGutter';

type RenderRow =
  | { type: 'divider'; id: string; label: string }
  | { type: 'message'; id: string; message: ChatMessage };

type Props = {
  messages: ChatMessage[];
  currentUserId: string;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  onRetry?: (message: ChatMessage) => void;
  onBottomStateChange?: (atBottom: boolean) => void;
};

export const MessageList = forwardRef<FlatList<RenderRow>, Props>(
  (
    { messages, currentUserId, hasMore, loadingMore, onLoadMore, onRetry, onBottomStateChange },
    ref,
  ) => {
    const lastBottomState = useRef(true);

    const data = useMemo<RenderRow[]>(() => {
      const rows: RenderRow[] = [];
      let lastLabel: string | null = null;
      messages.forEach((message) => {
        const label = formatDateLabel(message.createdAt);
        if (label !== lastLabel) {
          rows.push({ type: 'divider', id: `divider-${message.id}`, label });
          lastLabel = label;
        }
        rows.push({ type: 'message', id: message.id, message });
      });
      return rows;
    }, [messages]);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      if (contentOffset.y <= 24 && hasMore && !loadingMore) {
        onLoadMore();
      }
      const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
      const atBottom = distanceFromBottom < 20;
      if (atBottom !== lastBottomState.current) {
        lastBottomState.current = atBottom;
        onBottomStateChange?.(atBottom);
      }
    };

    const renderItem: FlatListProps<RenderRow>['renderItem'] = ({ item, index }) => {
      if (item.type === 'divider') {
        return (
          <View style={styles.divider}>
            <Text style={styles.dividerText}>{item.label}</Text>
          </View>
        );
      }
      const previous = data[index - 1];
      const showAvatar =
        previous?.type === 'message' ? previous.message.user.id !== item.message.user.id : true;
      return (
        <MessageItem
          message={item.message}
          isSelf={item.message.user.id === currentUserId}
          showAvatar={showAvatar}
          onRetry={onRetry}
        />
      );
    };

    const bottomGutter = useBottomGutter();
    return (
      <FlatList
        ref={ref}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, bottomGutter.contentContainerStyle]}
        contentInset={bottomGutter.contentInset}
        scrollIndicatorInsets={bottomGutter.scrollIndicatorInsets}
        onScroll={handleScroll}
        scrollEventThrottle={32}
        ListHeaderComponent={
          hasMore ? (
            <View style={styles.loader}>
              {loadingMore ? <ActivityIndicator color={palette.sub} size="small" /> : null}
            </View>
          ) : null
        }
      />
    );
  },
);

const formatDateLabel = (timestamp: number) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) {
    return '今天';
  }
  if (isSameDay(date, yesterday)) {
    return '昨天';
  }
  return `${date.getMonth() + 1}-${date.getDate()}`;
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 80,
  },
  divider: {
    alignSelf: 'center',
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(9,12,22,0.6)',
  },
  dividerText: {
    ...typography.caption,
    color: palette.sub,
  },
  loader: {
    paddingVertical: 8,
  },
});
