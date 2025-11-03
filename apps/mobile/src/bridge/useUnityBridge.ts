import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  UnityMessage,
  addUnityListener,
  initUnity,
  pauseUnity,
  postUnityMessage,
  resumeUnity,
  sendUnityMessage,
  setUnityEffectsQuality,
  setUnityRenderMode,
} from './unityBridge';

export type UnityStatus = 'idle' | 'initializing' | 'ready' | 'error';

type UseUnityBridgeOptions = {
  defaultSceneName?: string;
};

let unityInitialized = false;
let activeSceneName: string | null = null;

export const useUnityBridge = (options: UseUnityBridgeOptions = {}) => {
  const defaultSceneName = options.defaultSceneName ?? 'PlaceholderScene';
  const [status, setStatus] = useState<UnityStatus>(unityInitialized ? 'ready' : 'idle');
  const [lastMessage, setLastMessage] = useState<UnityMessage | null>(null);

  useEffect(() => {
    const unsubscribe = addUnityListener((message) => {
      if (message.type === 'SCENE_READY') {
        setStatus('ready');
        const payloadRecord = message.payload as Record<string, unknown> | undefined;
        const sceneField = payloadRecord?.sceneName;
        if (typeof sceneField === 'string') {
          activeSceneName = sceneField;
        }
      } else if (message.type === 'ERROR') {
        setStatus('error');
      }
      setLastMessage(message);
    });

    return unsubscribe;
  }, []);

  const sendInitScene = useCallback((sceneName: string) => {
    setStatus('initializing');
    activeSceneName = sceneName;
    // TODO: add timeout watchdog to revert status when SCENE_READY is not received within expected window.
    sendUnityMessage('INIT_SCENE', { sceneName });
  }, []);

  const bootstrapUnity = useCallback(
    async (sceneName?: string) => {
      const targetScene = sceneName ?? defaultSceneName;
      if (unityInitialized && activeSceneName === targetScene && status === 'ready') {
        return;
      }

      if (!unityInitialized) {
        setStatus('initializing');
        try {
          await initUnity();
          unityInitialized = true;
          setUnityRenderMode('texture');
        } catch (error) {
          console.warn('[UnityBridge] init failed', error);
          setStatus('error');
          return;
        }
      }

      sendInitScene(targetScene);
    },
    [defaultSceneName, sendInitScene, status],
  );

  const requestScene = useCallback(
    (sceneName: string) => {
      if (!unityInitialized) {
        bootstrapUnity(sceneName).catch(() => null);
        return;
      }

      if (activeSceneName === sceneName) {
        return;
      }
      // TODO: handle retry/backoff when Unity does not respond with SCENE_READY or returns ERROR.
      sendInitScene(sceneName);
    },
    [bootstrapUnity, sendInitScene],
  );

  const value = useMemo(
    () => ({
      status,
      lastMessage,
      bootstrapUnity,
      requestScene,
      sendUnityMessage,
      postUnityMessage,
      pauseUnity,
      resumeUnity,
      setUnityEffectsQuality,
    }),
    [
      status,
      lastMessage,
      bootstrapUnity,
      requestScene,
      sendUnityMessage,
      postUnityMessage,
      pauseUnity,
      resumeUnity,
      setUnityEffectsQuality,
    ],
  );

  return value;
};
