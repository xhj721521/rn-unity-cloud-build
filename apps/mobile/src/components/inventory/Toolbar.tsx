import React from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import QuickGlyph from '@components/QuickGlyph';
import { palette } from '@theme/colors';
import { typography } from '@theme/typography';

export const InventoryToolbar = () => {
  const handlePlaceholder = () => Alert.alert('提示', '占位功能');
  return (
    <View style={styles.container}>
      <Pressable style={styles.searchBox} onPress={handlePlaceholder}>
        <QuickGlyph id="globe" size={18} />
        <TextInput
          style={styles.searchInput}
          placeholder="搜索仓库"
          placeholderTextColor="rgba(255,255,255,0.4)"
          editable={false}
        />
      </Pressable>
      <Pressable style={styles.sortButton} onPress={handlePlaceholder}>
        <QuickGlyph id="settings" size={18} />
        <Text style={styles.sortText}>排序</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(8,10,24,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: palette.text,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(8,10,24,0.6)',
    paddingHorizontal: 14,
    gap: 6,
  },
  sortText: {
    ...typography.captionCaps,
    color: palette.text,
  },
});
