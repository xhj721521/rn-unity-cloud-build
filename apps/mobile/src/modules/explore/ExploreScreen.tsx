import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { ScreenContainer } from '@components/ScreenContainer';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';
import { UnityView } from '@bridge/UnityView';
import { useUnityBridge } from '@bridge/useUnityBridge';

const FEATURE_LIST = [
  {
    title: '\u9886\u57df\u5730\u56fe',
    description:
      '\u6d4f\u89c8\u8d5b\u535a\u90fd\u5e02\u3001\u80fd\u6e90\u5382\u4e0e\u79d8\u5883\u5165\u53e3\uff0c\u89c4\u5212\u63a2\u7d22\u8def\u7ebf\u3002',
  },
  {
    title: 'NFT \u5546\u5e97',
    description:
      '\u5151\u6362\u9650\u65f6\u9713\u8679\u88c5\u5907\u4e0e\u4f19\u4f34\uff0c\u652f\u6301\u94fe\u4e0a\u4ea4\u6613\u8bb0\u5f55\u3002',
  },
  {
    title: '\u6d3b\u52a8\u526f\u672c',
    description:
      '\u53c2\u52a0\u5468\u671f\u6d3b\u52a8\u548c\u5408\u4f5c\u526f\u672c\uff0c\u83b7\u53d6\u7a00\u6709\u5956\u52b1\u3002',
  },
];

export const ExploreScreen = () => {
  const { status, bootstrapUnity, requestScene, sendUnityMessage, lastMessage } = useUnityBridge({
    defaultSceneName: 'ExploreHub',
  });
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    if (status === 'idle') {
      bootstrapUnity('ExploreHub').catch(() => null);
    } else if (status === 'ready') {
      requestScene('ExploreHub');
    }
  }, [status, bootstrapUnity, requestScene, isFocused]);

  return (
    <ScreenContainer>
      <Text style={styles.heading}>\u63a2\u7d22\u7ec8\u7aef</Text>
      <Text style={styles.subHeading}>
        \u6d4f\u89c8\u8d5b\u535a\u4e16\u754c\u5730\u56fe\uff0c\u89c4\u5212\u4e0b\u4e00\u6b21\u5192\u9669\u3002
      </Text>

      <View style={styles.unityWrapper}>
        {isFocused ? <UnityView style={styles.unityView} /> : null}
        {status !== 'ready' || !isFocused ? (
          <View style={styles.overlay}>
            <LoadingPlaceholder
              label={
                status === 'error'
                  ? '\u63a2\u7d22\u573a\u666f\u52a0\u8f7d\u5931\u8d25'
                  : '\u52a0\u8f7d\u63a2\u7d22\u4e16\u754c\u4e2d...'
              }
            />
          </View>
        ) : null}
      </View>

      <View style={styles.actionList}>
        <ActionButton
          label="\u5de1\u822a\u5730\u56fe"
          description="LOAD_MAP\uff1a\u805a\u7126\u4e3b\u57ce\u533a\u4e0e\u79d8\u5883\u5165\u53e3"
          onPress={() => sendUnityMessage('LOAD_MAP', { focus: 'megacity' })}
        />
        <ActionButton
          label="\u626b\u63cf\u8d44\u6e90"
          description="SCAN_RESOURCES\uff1a\u5c55\u793a\u53ef\u6536\u96c6\u8282\u70b9"
          onPress={() => sendUnityMessage('SCAN_RESOURCES', { radius: 500 })}
        />
        <ActionButton
          label="\u4f20\u9001\u81f3\u6d3b\u52a8\u526f\u672c"
          description="WARP_TO_EVENT\uff1a\u8df3\u8f6c\u5230\u9650\u65f6\u6d3b\u52a8\u533a\u57df"
          onPress={() => sendUnityMessage('WARP_TO_EVENT', { eventId: 'event-alpha' })}
        />
      </View>

      <View style={styles.featureList}>
        {FEATURE_LIST.map((item) => (
          <View style={styles.featureCard} key={item.title}>
            <Text style={styles.featureTitle}>{item.title}</Text>
            <Text style={styles.featureDesc}>{item.description}</Text>
          </View>
        ))}
      </View>

      {lastMessage ? (
        <View style={styles.logBox}>
          <Text style={styles.logTitle}>Unity \u56de\u4f20</Text>
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
  heading: {
    color: '#F6F8FF',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 10,
  },
  subHeading: {
    color: '#8D92A3',
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
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
  actionList: {
    gap: 12,
    marginBottom: 24,
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
  featureList: {
    marginBottom: 24,
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#12122B',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1F1F42',
  },
  featureTitle: {
    color: '#F6F8FF',
    fontSize: 16,
    fontWeight: '600',
  },
  featureDesc: {
    color: '#B7B9C7',
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
  logBox: {
    marginTop: 16,
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
