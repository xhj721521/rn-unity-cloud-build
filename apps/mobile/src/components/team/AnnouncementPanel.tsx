import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';

type Props = {
  text?: string;
  canEdit?: boolean;
};

export const AnnouncementPanel = ({ text, canEdit }: Props) => {
  const [value, setValue] = useState(text ?? '暂无公告');
  const [editing, setEditing] = useState(false);

  return (
    <View style={styles.container}>
      {editing ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          multiline
          placeholder="输入公告内容…"
          placeholderTextColor="rgba(255,255,255,0.35)"
        />
      ) : (
        <Text style={styles.text}>{value}</Text>
      )}
      {canEdit ? (
        <Pressable
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
          onPress={() => setEditing((prev) => !prev)}
        >
          <Text style={styles.buttonText}>{editing ? '保存' : '编辑'}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  text: {
    ...typography.body,
    color: palette.text,
    lineHeight: 20,
  },
  input: {
    minHeight: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    padding: 12,
    color: palette.text,
    textAlignVertical: 'top',
  },
  button: {
    alignSelf: 'flex-end',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.4)',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  buttonText: {
    ...typography.captionCaps,
    color: palette.primary,
  },
});

export default AnnouncementPanel;
