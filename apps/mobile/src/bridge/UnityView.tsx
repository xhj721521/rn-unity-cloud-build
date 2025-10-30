import React from 'react';
import { requireNativeComponent, StyleSheet, View, ViewProps } from 'react-native';

type UnityViewProps = ViewProps & {
  fullscreen?: boolean;
};

const NativeUnityView = (() => {
  try {
    return requireNativeComponent<UnityViewProps>('UnityView');
  } catch (error) {
    return null;
  }
})();

export const UnityView = (props: UnityViewProps) => {
  if (NativeUnityView) {
    return <NativeUnityView {...props} />;
  }

  return <View {...props} style={[styles.fallback, props.style]} />;
};

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: '#14142E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#24244F',
  },
});
