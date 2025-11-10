import React from 'react';
import { Pressable, PressableProps, StyleSheet, Switch, Text, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import QuickGlyph, { QuickGlyphId } from '@components/QuickGlyph';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';
import { getBadgeToneStyle, NeonBadgeTone } from '@theme/neon';

export type SettingRowVariant =
  | 'value'
  | 'badge'
  | 'switch'
  | 'chevron'
  | 'external'
  | 'disabled'
  | 'radio';

type SettingRowProps = {
  icon?: QuickGlyphId;
  title: string;
  subtitle?: string;
  value?: string;
  badgeText?: string;
  badgeTone?: NeonBadgeTone;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  variant?: SettingRowVariant;
  disabled?: boolean;
  style?: ViewStyle;
  onPress?: PressableProps['onPress'];
  onLongPress?: PressableProps['onLongPress'];
  tone?: 'default' | 'danger';
  selected?: boolean; // for radio
};

export const SettingRow = ({
  icon,
  title,
  subtitle,
  value,
  badgeText,
  badgeTone = 'pending',
  switchValue,
  onSwitchChange,
  variant = 'value',
  disabled,
  style,
  onPress,
  onLongPress,
  tone = 'default',
  selected = false,
}: SettingRowProps) => {
  const isDisabled = disabled || variant === 'disabled';
  const showPressable = variant !== 'switch' || !!onPress;
  const content = (
    <View style={styles.rowBody}>
      {icon ? (
        <View style={styles.iconHolder}>
          <QuickGlyph id={icon} size={24} />
        </View>
      ) : null}
      <View style={styles.textColumn}>
        <Text style={[styles.title, tone === 'danger' && styles.dangerTitle]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.rightContainer}>{renderRight()}</View>
    </View>
  );

  function renderRight() {
    switch (variant) {
      case 'value':
        return value ? (
          <Text style={styles.value} numberOfLines={1}>
            {value}
          </Text>
        ) : null;
      case 'badge':
        return <Badge text={badgeText} tone={badgeTone} />;
      case 'switch':
        return (
          <Switch
            value={!!switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: 'rgba(255,255,255,0.18)', true: 'rgba(0,255,209,0.4)' }}
            thumbColor={switchValue ? '#00FFD1' : '#B7BCD6'}
          />
        );
      case 'chevron':
        return (
          <View style={styles.chevronRight}>
            {value ? (
              <Text style={[styles.value, styles.valueTight]} numberOfLines={1}>
                {value}
              </Text>
            ) : null}
            <ChevronIcon />
          </View>
        );
      case 'external':
        return <ExternalIcon />;
      case 'disabled':
        return <Badge text={badgeText} tone="soon" />;
      case 'radio':
        return <Radio isActive={selected} />;
      default:
        return null;
    }
  }

  if (!showPressable) {
    return <View style={[styles.row, style, isDisabled && styles.disabled]}>{content}</View>;
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        pressed && !isDisabled && { opacity: 0.8 },
        style,
        isDisabled && styles.disabled,
      ]}
      onPress={isDisabled ? undefined : onPress}
      onLongPress={isDisabled ? undefined : onLongPress}
    >
      {content}
    </Pressable>
  );
};

const Badge = ({ text, tone }: { text?: string; tone: NeonBadgeTone }) => {
  const style = getBadgeToneStyle(tone);
  if (!text) {
    return null;
  }
  return (
    <View style={[styles.badge, { backgroundColor: style.background, borderColor: style.border }]}>
      <Text style={[styles.badgeText, { color: style.text }]} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
};

const ChevronIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Path d="M6 4L12 9L6 14" stroke="#8CA9D7" strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const ExternalIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Path
      d="M7 4H14V11"
      stroke="#7BD7FF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M14 4L5 13" stroke="#7BD7FF" strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const Radio = ({ isActive }: { isActive: boolean }) => (
  <View style={[styles.radio, isActive && styles.radioActive]}>
    {isActive ? <View style={styles.radioDot} /> : null}
  </View>
);

const styles = StyleSheet.create({
  row: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(5,8,20,0.65)',
  },
  rowBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconHolder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,255,209,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
  },
  rightContainer: {
    minWidth: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    ...typography.body,
    color: palette.text,
  },
  dangerTitle: {
    color: '#FF7C8F',
  },
  subtitle: {
    ...typography.caption,
    color: palette.sub,
    marginTop: 2,
  },
  value: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  valueTight: {
    marginRight: 6,
  },
  chevronRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  badgeText: {
    ...typography.captionCaps,
  },
  disabled: {
    opacity: 0.5,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: '#00FFD1',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00FFD1',
  },
});

export default SettingRow;
