import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { translate as t } from '@locale/strings';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';
import { shape } from '@theme/tokens';

type Props = {
  onJoin: () => void;
};

export const JoinGate = ({ onJoin }: Props) => (
  <View style={styles.wrapper}>
    <Text style={styles.title}>{t('chat.title', undefined, '团队聊天')}</Text>
    <Text style={styles.body}>{t('chat.join_required', undefined, '加入团队后才能聊天')}</Text>
    <Pressable style={styles.button} onPress={onJoin}>
      <Text style={styles.buttonText}>{t('chat.join_now', undefined, '加入团队')}</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: shape.cardRadius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(9,12,24,0.8)',
    padding: 24,
    alignItems: 'center',
    marginTop: 32,
  },
  title: {
    ...typography.subtitle,
    color: palette.text,
  },
  body: {
    ...typography.body,
    color: palette.sub,
    textAlign: 'center',
    marginVertical: 12,
  },
  button: {
    borderRadius: shape.capsuleRadius,
    borderWidth: 1,
    borderColor: palette.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,209,199,0.2)',
  },
  buttonText: {
    ...typography.captionCaps,
    color: palette.text,
  },
});
