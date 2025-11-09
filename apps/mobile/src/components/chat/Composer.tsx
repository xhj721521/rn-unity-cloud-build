import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { translate as t } from '@locale/strings';
import { palette } from '@theme/colors';
import { typography } from '@theme/typography';
import { shape } from '@theme/tokens';

type Props = {
  disabled?: boolean;
  mutedUntil?: number;
  onSend: (text: string) => void;
};

export const Composer = ({ disabled, mutedUntil, onSend }: Props) => {
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || trimmed.length > 300 || disabled || sending) {
      return;
    }
    setSending(true);
    onSend(trimmed);
    setValue('');
    setTimeout(() => setSending(false), 120);
  };

  const mutedText =
    mutedUntil && mutedUntil > Date.now()
      ? t('chat.muted_until', {
          time: new Date(mutedUntil).toLocaleTimeString(),
        })
      : null;

  return (
    <View style={styles.wrapper}>
      {mutedText ? <Text style={styles.mutedText}>{mutedText}</Text> : null}
      <View style={[styles.inputRow, (disabled || !!mutedText) && styles.inputRowDisabled]}>
        <TextInput
          style={styles.input}
          placeholder={t('chat.placeholder', undefined, '发一条团队消息…')}
          placeholderTextColor="rgba(255,255,255,0.32)"
          multiline
          value={value}
          maxLength={300}
          editable={!disabled && !mutedText}
          onChangeText={setValue}
        />
        <Pressable
          style={({ pressed }) => [
            styles.sendButton,
            (disabled || !!mutedText || !value.trim()) && styles.sendButtonDisabled,
            pressed && styles.sendButtonPressed,
          ]}
          onPress={handleSend}
        >
          <Text style={styles.sendText}>{sending ? '...' : '发送'}</Text>
        </Pressable>
      </View>
      <Text style={styles.counter}>{value.length}/300</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(4,5,12,0.92)',
  },
  inputRow: {
    borderRadius: shape.cardRadius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(9,12,22,0.82)',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
  },
  inputRowDisabled: {
    opacity: 0.6,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: palette.text,
    maxHeight: 120,
  },
  sendButton: {
    borderRadius: shape.capsuleRadius,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: palette.primary,
    backgroundColor: 'rgba(0,209,199,0.2)',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonPressed: {
    opacity: 0.8,
  },
  sendText: {
    ...typography.captionCaps,
    color: palette.text,
  },
  counter: {
    ...typography.caption,
    color: palette.sub,
    marginTop: 6,
    textAlign: 'right',
  },
  mutedText: {
    ...typography.caption,
    color: '#FF8AA4',
    marginBottom: 6,
  },
});
