import React from 'react';
import {
  Platform,
  StyleSheet,
  UIManager,
  View,
  ViewProps,
  requireNativeComponent,
} from 'react-native';
import { shape } from '@theme/tokens';

type UnityViewProps = ViewProps & {
  fullscreen?: boolean;
};

const UNITY_VIEW_NAME = 'UnityView';

const isUnityViewAvailable =
  Platform.OS === 'android' && UIManager.getViewManagerConfig(UNITY_VIEW_NAME) != null;

const NativeUnityView = isUnityViewAvailable
  ? requireNativeComponent<UnityViewProps>(UNITY_VIEW_NAME)
  : null;

export const UnityView = (props: UnityViewProps) => {
  if (NativeUnityView) {
    return <NativeUnityView {...props} />;
  }

  return <View {...props} style={[styles.fallback, props.style]} />;
};

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: '#14142E',
    borderRadius: shape.blockRadius,
    borderWidth: 1,
    borderColor: '#24244F',
  },
});
