import React, { useMemo } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { translate as t } from '@locale/strings';
import { palette } from '@theme/colors';

type Props = {
  messages: Array<{ id: string; user: string; body: string }>;
};

export const ChatDock = ({ messages }: Props) => {
  const { height } = useWindowDimensions();
  const collapsed = 56;
  const expanded = height * 0.6;
  const animated = useMemo(() => new Animated.Value(collapsed), [collapsed]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
          const next = Math.min(expanded, Math.max(collapsed, expanded - gesture.dy));
          animated.setValue(next);
        },
        onPanResponderRelease: (_, gesture) => {
          const currentValue =
            typeof (animated as any).__getValue === 'function'
              ? (animated as any).__getValue()
              : collapsed;
          const shouldExpand = gesture.vy < 0 || currentValue > (collapsed + expanded) / 2;
          Animated.spring(animated, {
            toValue: shouldExpand ? expanded : collapsed,
            useNativeDriver: false,
          }).start();
        },
      }),
    [animated, collapsed, expanded],
  );

  return (
    <Animated.View
      style={[styles.container, { height: animated }]}
      {...panResponder.panHandlers}
      testID="chatDock"
    >
      <View style={styles.handle} />
      <Text style={styles.title}>
        {t('chat.title', '队内聊天')} · {messages.length}
      </Text>
      <View style={styles.list}>
        {messages.map((msg) => (
          <View key={msg.id} style={styles.message}>
            <Text style={styles.msgUser}>{msg.user}</Text>
            <Text style={styles.msgBody}>{msg.body}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(6,8,20,0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignSelf: 'center',
    marginBottom: 8,
  },
  title: {
    color: palette.text,
    fontWeight: '700',
  },
  list: {
    marginTop: 12,
    gap: 8,
  },
  message: {
    borderRadius: 12,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  msgUser: {
    color: palette.text,
    fontWeight: '600',
  },
  msgBody: {
    color: palette.sub,
    marginTop: 2,
  },
});

export default ChatDock;
