import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type PrimaryCTAProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
  style?: ViewStyle;
};

export const PrimaryCTA = ({ label, onPress, disabled, testID, style }: PrimaryCTAProps) => {
  return (
    <Pressable
      testID={testID}
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.wrapper,
        style,
        disabled && styles.disabled,
        pressed && !disabled ? { opacity: 0.9 } : null,
      ]}
    >
      <LinearGradient
        colors={['#20E0E8', '#E8C26A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  label: {
    color: '#05060C',
    fontWeight: '700',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default PrimaryCTA;
