import { NativeEventEmitter, NativeModules } from 'react-native';

const { UnityBridge } = NativeModules;

export type UnityMessage = {
  type: string;
  payload?: Record<string, unknown>;
};

type UnityModule = {
  initUnity?: () => Promise<void> | void;
  sendMessage?: (type: string, payload?: string) => void;
};

const unityModule: UnityModule = UnityBridge ?? {
  initUnity: () => Promise.resolve(),
  sendMessage: (type: string, payload?: string) => {
    if (__DEV__) {
      console.log('[UnityBridge mock] sendMessage', type, payload);
    }
  },
};

const unityEmitter =
  UnityBridge != null
    ? new NativeEventEmitter(UnityBridge)
    : new NativeEventEmitter();

export const initUnity = async () => {
  if (__DEV__) {
    console.log('[UnityBridge] initUnity');
  }
  await unityModule.initUnity?.();
};

export const sendUnityMessage = (
  type: string,
  payload?: Record<string, unknown>,
) => {
  const serializedPayload =
    payload !== undefined ? JSON.stringify(payload) : undefined;
  unityModule.sendMessage?.(type, serializedPayload);
};

type UnityNativeEvent = {
  type?: string;
  payload?: unknown;
};

export const addUnityListener = (
  handler: (message: UnityMessage) => void,
): (() => void) => {
  const subscription = unityEmitter.addListener(
    'UnityMessage',
    (raw: UnityNativeEvent) => {
      let payload = raw?.payload;
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch {
          if (__DEV__) {
            console.warn(
              '[UnityBridge] Failed to parse payload string',
              payload,
            );
          }
        }
      }

      const normalizedPayload =
        payload && typeof payload === 'object'
          ? (payload as Record<string, unknown>)
          : undefined;

      handler({
        type: raw?.type ?? 'UNKNOWN',
        payload: normalizedPayload,
      });
    },
  );
  return () => subscription.remove();
};
