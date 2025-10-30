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
      <Text style={styles.title}>\u8bd5\u70bc\u573a</Text>
      <Text style={styles.caption}>
        \u8fde\u63a5 Unity \u5f15\u64ce\uff0c\u51c6\u5907\u8fdb\u5165 3D \u573a\u666f\u3002
      </Text>

      <View style={styles.unityWrapper}>
        {isFocused ? <UnityView style={styles.unityView} /> : null}
        {status !== 'ready' || !isFocused ? (
          <View style={styles.overlay}>
            <LoadingPlaceholder
              label={
                status === 'error'
                  ? 'Unity \u521d\u59cb\u5316\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5'
                  : '3D \u573a\u666f\u52a0\u8f7d\u4e2d...'
              }
            />
          </View>
        ) : null}
      </View>

      <View style={styles.actionRow}>
        <ActionButton
          label="\u5f00\u542f\u6218\u6597"
          description="\u5411 Unity \u53d1\u9001 START_COMBAT \u6307\u4ee4"
          onPress={() =>
            sendUnityMessage('START_COMBAT', {
              loadout: 'default',
              difficulty: 'normal',
            })
          }
        />
        <ActionButton
          label="\u6682\u505c"
          description="\u53d1\u9001 PAUSE"
          onPress={() => sendUnityMessage('PAUSE')}
        />
      </View>

      {lastMessage ? (
        <View style={styles.logBox}>
          <Text style={styles.logTitle}>\u6700\u540e\u4e8b\u4ef6</Text>
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
