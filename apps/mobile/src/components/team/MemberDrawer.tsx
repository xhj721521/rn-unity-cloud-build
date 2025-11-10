import React, { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { MemberEntity } from './MemberCard';
import OutlineCTA from '@components/shared/OutlineCTA';
import { teamTokens } from '@theme/tokens.team';
import { typography } from '@theme/typography';

type Props = {
  member?: MemberEntity | null;
  visible: boolean;
  onClose: () => void;
};

export const MemberDrawer = ({ member, visible, onClose }: Props) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, { duration: 220 });
  }, [visible, progress]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [400, 0]) }],
  }));

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View style={[styles.drawer, containerStyle]}>
        {member ? (
          <>
            <Text style={styles.title}>{member.name}</Text>
            <Text style={styles.subtitle}>本周贡献 {member.contribWeek}</Text>
            <Text style={styles.subtitle}>最近在线：{member.lastSeen}</Text>
            <View style={styles.actions}>
              <OutlineCTA label="设为副官（占位）" onPress={onClose} />
              <OutlineCTA tone="danger" label="移出团队（占位）" onPress={onClose} />
            </View>
          </>
        ) : null}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(2,3,8,0.6)',
  },
  drawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#080B14',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 10,
  },
  title: {
    ...typography.subtitle,
    color: teamTokens.colors.textMain,
  },
  subtitle: {
    ...typography.body,
    color: teamTokens.colors.textSub,
  },
  actions: {
    marginTop: 12,
    gap: 12,
  },
});

export default MemberDrawer;
