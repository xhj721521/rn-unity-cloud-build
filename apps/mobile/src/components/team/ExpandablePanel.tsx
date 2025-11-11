import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  children: React.ReactNode;
};

export const ExpandablePanel = ({ children }: Props) => (
  <View style={styles.panel}>{children}</View>
);

const styles = StyleSheet.create({
  panel: {
    marginTop: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.24)',
    backgroundColor: 'rgba(5,10,16,0.82)',
    padding: 16,
  },
});

export default ExpandablePanel;
