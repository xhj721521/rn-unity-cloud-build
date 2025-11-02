import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { ScreenContainer } from '@components/ScreenContainer';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';
import { UnityView } from '@bridge/UnityView';
import { useUnityBridge } from '@bridge/useUnityBridge';

const FEATURE_LIST = [
  {
    title: '领域地图',
    description:
      '浏览赛博都市、能源厂与秘境入口，规划探索路线。',
  },
  {
    title: 'NFT 商店',
    description:
      '兑换限时霓虹装备与伙伴，支持链上交易记录。',
  },
  {
    title: '活动副本',
    description:
      '参加周期活动和合作副本，获取稀有奖励。',
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
      <Text style={styles.heading}>探索终端</Text>
      <Text style={styles.subHeading}>
        浏览赛博世界地图，规划下一次冒险。
      </Text>

      <View style={styles.unityWrapper}>
        {isFocused ? <UnityView style={styles.unityView} /> : null}
        {status !== 'ready' || !isFocused ? (
          <View style={styles.overlay}>
            <LoadingPlaceholder
              label={
                status === 'error'
                  ? '探索场景加载失败'
                  : '加载探索世界中...'
              }
            />
          </View>
        ) : null}
      </View>

      <View style={styles.actionList}>
        <ActionButton
          label="巡航地图"
          description="LOAD_MAP：聚焦主城区与秘境入口"
          onPress={() => sendUnityMessage('LOAD_MAP', { focus: 'megacity' })}
        />
        <ActionButton
          label="扫描资源"
          description="SCAN_RESOURCES：展示可收集节点"
          onPress={() => sendUnityMessage('SCAN_RESOURCES', { radius: 500 })}
        />
        <ActionButton
          label="传送至活动副本"
          description="WARP_TO_EVENT：跳转到限时活动区域"
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
          <Text style={styles.logTitle}>Unity 回传</Text>
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
