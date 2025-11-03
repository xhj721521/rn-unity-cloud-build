import { NativeEventEmitter, NativeModules } from 'react-native';

const { UnityBridge } = NativeModules;

export type UnityMessage = {
  type: string;
  payload?: Record<string, unknown>;
};

type UnityModule = {
  initUnity?: () => Promise<void> | void;
  sendMessage?: (type: string, payload?: string) => void;
  postMessage?: (objectName: string, methodName: string, payload?: string) => void;
  setRenderMode?: (mode: 'surface' | 'texture') => void;
  pause?: () => void;
  resume?: () => void;
  setEffectsQuality?: (quality: 'low' | 'medium' | 'high') => void;
};

const unityModule: UnityModule = UnityBridge ?? {
  initUnity: () => Promise.resolve(),
  sendMessage: (type: string, payload?: string) => {
    if (__DEV__) {
      console.log('[UnityBridge mock] sendMessage', type, payload);
    }
  },
  postMessage: (objectName: string, methodName: string, payload?: string) => {
    if (__DEV__) {
      console.log('[UnityBridge mock] postMessage', objectName, methodName, payload);
    }
  },
  setRenderMode: (mode: 'surface' | 'texture') => {
    if (__DEV__) {
      console.log('[UnityBridge mock] setRenderMode', mode);
    }
  },
  pause: () => {
    if (__DEV__) {
      console.log('[UnityBridge mock] pause');
    }
  },
  resume: () => {
    if (__DEV__) {
      console.log('[UnityBridge mock] resume');
    }
  },
  setEffectsQuality: (quality: 'low' | 'medium' | 'high') => {
    if (__DEV__) {
      console.log('[UnityBridge mock] setEffectsQuality', quality);
    }
  },
};

const unityEmitter =
  UnityBridge != null ? new NativeEventEmitter(UnityBridge) : new NativeEventEmitter();

export const initUnity = async () => {
  if (__DEV__) {
    console.log('[UnityBridge] initUnity');
  }
  await unityModule.initUnity?.();
};

export const sendUnityMessage = (type: string, payload?: Record<string, unknown>) => {
  const serializedPayload = payload !== undefined ? JSON.stringify(payload) : undefined;
  unityModule.sendMessage?.(type, serializedPayload);
};

export const postUnityMessage = (
  objectName: string,
  methodName: string,
  payload: Record<string, unknown> | string = '',
) => {
  const serializedPayload = typeof payload === 'string' ? payload : JSON.stringify(payload);
  if (unityModule.postMessage) {
    unityModule.postMessage(objectName, methodName, serializedPayload);
    return;
  }
  sendUnityMessage('UNITY_POST_MESSAGE', {
    objectName,
    methodName,
    payload: serializedPayload,
  });
};

export const setUnityRenderMode = (mode: 'surface' | 'texture') => {
  if (!unityModule.setRenderMode && __DEV__) {
    console.log('[UnityBridge mock] setRenderMode unavailable');
  }
  unityModule.setRenderMode?.(mode);
};

export const pauseUnity = () => {
  unityModule.pause?.();
};

export const resumeUnity = () => {
  unityModule.resume?.();
};

export const setUnityEffectsQuality = (quality: 'low' | 'medium' | 'high') => {
  unityModule.setEffectsQuality?.(quality);
};

type UnityNativeEvent = {
  type?: string;
  payload?: unknown;
};

export const addUnityListener = (handler: (message: UnityMessage) => void): (() => void) => {
  const subscription = unityEmitter.addListener('UnityMessage', (raw: UnityNativeEvent) => {
    let payload = raw?.payload;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        if (__DEV__) {
          console.warn('[UnityBridge] Failed to parse payload string', payload);
        }
      }
    }

    const normalizedPayload =
      payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : undefined;

    handler({
      type: raw?.type ?? 'UNKNOWN',
      payload: normalizedPayload,
    });
  });
  return () => subscription.remove();
};
