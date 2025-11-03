import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { ScreenContainer } from '@components/ScreenContainer';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';
import { UnityView } from '@bridge/UnityView';
import { useUnityBridge } from '@bridge/useUnityBridge';

export const TrialsScreen = () => {
  const { status, bootstrapUnity, lastMessage, sendUnityMessage, requestScene } = useUnityBridge({
    defaultSceneName: 'TrialsArena',
  });
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    if (status === 'idle') {
      bootstrapUnity('TrialsArena').catch(() => null);
    } else if (status === 'ready') {
      requestScene('TrialsArena');
    }
  }, [status, bootstrapUnity, requestScene, isFocused]);

  return (
    <ScreenContainer>
      <Text style={styles.title}>试炼场</Text>
      <Text style={styles.caption}>连接 Unity 引擎，准备进入 3D 场景。</Text>

      <View style={styles.unityWrapper}>
        {isFocused ? <UnityView style={styles.unityView} /> : null}
        {status !== 'ready' || !isFocused ? (
          <View style={styles.overlay}>
            <LoadingPlaceholder
              label={status === 'error' ? 'Unity 初始化失败，请稍后重试' : '3D 场景加载中...'}
            />
          </View>
        ) : null}
      </View>

      <View style={styles.actionRow}>
        <ActionButton
          label="开启战斗"
          description="向 Unity 发送 START_COMBAT 指令"
          onPress={() =>
            sendUnityMessage('START_COMBAT', {
              loadout: 'default',
              difficulty: 'normal',
            })
          }
        />
        <ActionButton
          label="暂停"
          description="发送 PAUSE"
          onPress={() => sendUnityMessage('PAUSE')}
        />
      </View>

      {lastMessage ? (
        <View style={styles.logBox}>
          <Text style={styles.logTitle}>最后事件</Text>
          <Text style={styles.logText}>{JSON.stringify(lastMessage, null, 2)}</Text>
        </View>
      ) : null}
    </ScreenContainer>
  );
};

const ActionButton = ({
  label,
  description,
  onPress,
}: {
  label: string;
  description: string;
  onPress: () => void;
}) => (
  <Pressable style={styles.actionButton} onPress={onPress}>
    <Text style={styles.actionLabel}>{label}</Text>
    <Text style={styles.actionDescription}>{description}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  title: {
    color: '#F6F8FF',
    fontSize: 24,
    fontWeight: '700',
  },
  caption: {
    color: '#8D92A3',
    fontSize: 14,
    marginTop: 6,
    marginBottom: 18,
  },
  unityWrapper: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1F1F42',
    backgroundColor: '#050515',
    marginBottom: 20,
  },
  unityView: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 5, 21, 0.85)',
  },
  actionRow: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#12122B',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#24244F',
  },
  actionLabel: {
    color: '#7A5CFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionDescription: {
    color: '#8D92A3',
    fontSize: 12,
    marginTop: 4,
  },
  logBox: {
    marginTop: 24,
    backgroundColor: '#0F0F1A',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#24244F',
  },
  logTitle: {
    color: '#F6F8FF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  logText: {
    color: '#B7B9C7',
    fontFamily: 'Courier',
    fontSize: 11,
    lineHeight: 16,
  },
});
