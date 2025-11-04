import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '@components/ScreenContainer';
import { LoadingPlaceholder } from '@components/LoadingPlaceholder';
import { ErrorState } from '@components/ErrorState';
import { GachaDrop, GachaStage } from '@components/GachaStage';
import { useAccountSummary } from '@services/web3/hooks';
import { useAppDispatch } from '@state/hooks';
import { loadAccountSummary } from '@state/account/accountSlice';
import { useUnityBridge } from '@bridge/useUnityBridge';

const STAGE_COPY = {
  loading: '资源加载中…',
  buttonReady: '开启盲盒',
  buttonLoading: '开启中…',
} as const;

const buildDrop = (payload: Record<string, unknown> | undefined): GachaDrop => {
  const name =
    typeof payload?.name === 'string'
      ? payload.name
      : `盲盒奖励 ${payload?.resultId ?? ''}`;
  return {
    id: String(payload?.resultId ?? Date.now()),
    avatarFallback: name.charAt(0).toUpperCase(),
    name,
    rarity: typeof payload?.rarity === 'string' ? payload.rarity : '未知',
    timestamp: Date.now(),
  };
};

export const BlindBoxScreen = () => {
  const dispatch = useAppDispatch();
  const { height: windowHeight } = useWindowDimensions();
  const { data, loading, error } = useAccountSummary();

  const [recentDrops, setRecentDrops] = useState<GachaDrop[]>([]);
  const [currentResult, setCurrentResult] = useState<GachaDrop | null>(null);
  const [isOpening, setIsOpening] = useState(false);

  const {
    status: unityStatus,
    bootstrapUnity,
    requestScene,
    postUnityMessage,
    pauseUnity,
    resumeUnity,
    setUnityEffectsQuality,
    lastMessage,
  } = useUnityBridge({
    defaultSceneName: 'BlindBoxShowcase',
  });

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      bootstrapUnity();

      return () => {
        if (!isMounted) {
          return;
        }
        pauseUnity();
      };
    }, [bootstrapUnity, pauseUnity]),
  );

  useFocusEffect(
    useCallback(() => {
      resumeUnity();
      requestScene('BlindBoxShowcase');

      return () => {
        pauseUnity();
      };
    }, [pauseUnity, requestScene, resumeUnity]),
  );

  useEffect(() => {
    if (!lastMessage) {
      return;
    }

    if (lastMessage.type === 'GACHA_RESULT') {
      const drop = buildDrop(lastMessage.payload);
      setCurrentResult(drop);
      setRecentDrops((prev) => [drop, ...prev].slice(0, 8));
      setIsOpening(false);
      dispatch(loadAccountSummary());
      return;
    }

    if (lastMessage.type === 'GACHA_ERROR' || lastMessage.type === 'ERROR') {
      setIsOpening(false);
      return;
    }

    if (lastMessage.type === 'PERF_METRIC' || lastMessage.type === 'FPS_UPDATE') {
      const fpsValue = Number(lastMessage.payload?.fps ?? lastMessage.payload?.value);
      if (!Number.isFinite(fpsValue)) {
        return;
      }
      if (fpsValue < 28) {
        setUnityEffectsQuality('low');
      } else if (fpsValue < 45) {
        setUnityEffectsQuality('medium');
      } else {
        setUnityEffectsQuality('high');
      }
    }
  }, [dispatch, lastMessage, setUnityEffectsQuality]);

  const stageHeight = useMemo(() => {
    if (windowHeight < 700) {
      return 260;
    }
    if (windowHeight < 820) {
      return 280;
    }
    return 320;
  }, [windowHeight]);

  const handleOpenStage = useCallback(() => {
    if (unityStatus !== 'ready') {
      return;
    }
    setIsOpening(true);
    setCurrentResult(null);
    postUnityMessage('BoxController', 'Open', '');
  }, [postUnityMessage, unityStatus]);

  const handleDismissResult = useCallback(() => {
    setCurrentResult(null);
  }, []);

  if (loading) {
    return (
      <ScreenContainer variant="plain" edgeVignette>
        <View style={styles.centerBox}>
          <LoadingPlaceholder label="盲盒空间初始化中…" />
        </View>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer variant="plain" edgeVignette>
        <View style={styles.centerBox}>
          <ErrorState
            title="盲盒模块暂不可用"
            description={error}
            onRetry={() => dispatch(loadAccountSummary())}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer variant="plain" edgeVignette>
      <View style={styles.stageWrapper}>
        <GachaStage
          status={unityStatus}
          drops={recentDrops}
          copy={STAGE_COPY}
          isOpening={isOpening}
          onOpen={handleOpenStage}
          currentResult={currentResult ?? undefined}
          onDismissResult={currentResult ? handleDismissResult : undefined}
          stageHeight={stageHeight}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  stageWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
