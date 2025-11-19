import React from 'react';
import { Image, Text, View } from 'react-native';

const colorFromName = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) {
    h = name.charCodeAt(i) + ((h << 5) - h);
  }
  const hue = Math.abs(h) % 360;
  return `hsl(${hue}, 60%, 28%)`;
};

type AvatarProps = {
  uri?: string;
  name: string;
  size?: number;
};

export const Avatar = ({ uri, name, size = 40 }: AvatarProps) => {
  if (uri) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  }
  const bg = colorFromName(name || 'N');
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#EAF2FF', fontWeight: '700' }}>{(name?.[0] ?? 'N').toUpperCase()}</Text>
    </View>
  );
};

export default Avatar;
