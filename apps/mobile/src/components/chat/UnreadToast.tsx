import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { translate as t } from '@locale/strings';
import { palette } from '@theme/colors';
import { shape } from '@theme/tokens';
import { typography } from '@theme/typography';

type Props = {
  count: number;
  onPress: () => void;
};

export const UnreadToast = ({ count, onPress }: Props) => {
  if (count <= 0) {
    return null;
  }
  return (
    <View style={styles.container} pointerEvents="box-none">
      <Pressable style={styles.toast} onPress={onPress}>
        <Text style={styles.toastText}>
          {t('chat.new_msgs', { count }, `有 ${count} 条新消息 · 点击查看`)}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 90,
    alignItems: 'center',
  },
  toast: {
    borderRadius: shape.capsuleRadius,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,209,199,0.9)',
  },
  toastText: {
    ...typography.captionCaps,
    color: palette.text,
  },
});
