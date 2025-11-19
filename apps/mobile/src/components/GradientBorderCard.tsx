import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  children: React.ReactNode;
  colors?: string[];
  radius?: number;
  stroke?: number;
  style?: ViewStyle;
};

export default function GradientBorderCard({
  children,
  colors = ['#365DFF', '#6FE3FF'],
  radius = 16,
  stroke = 1,
  style,
}: Props) {
  return (
    <View style={[{ borderRadius: radius }, style]}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: radius }}>
        <View style={{ margin: stroke, borderRadius: radius - stroke, backgroundColor: '#121A2C', overflow: 'hidden' }}>
          <View style={styles.innerGlow} />
          {children}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  innerGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
});
