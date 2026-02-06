// components/atoms/Avatar.tsx - Atomic avatar/image component
import React from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';
import { styles } from '@/constants/styles';
import { Text } from './Text';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square' | 'rounded';

interface AvatarProps {
  source?: ImageSourcePropType | string;
  initials?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  backgroundColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  initials,
  size = 'md',
  shape = 'circle',
  backgroundColor = '#E5E7EB',
}) => {
  const sizes = {
    xs: 24,
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  };

  const borderRadius = {
    circle: sizes[size] / 2,
    square: 0,
    rounded: 8,
  };

  const dimension = sizes[size];

  return (
    <View
      style={[
        styles.avatar,
        {
          width: dimension,
          height: dimension,
          borderRadius: borderRadius[shape],
          backgroundColor,
        }
      ]}
    >
      {source ? (
        <Image
          source={typeof source === 'string' ? { uri: source } : source}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: borderRadius[shape],
          }}
        />
      ) : initials ? (
        <Text
          variant="body"
          color="secondary"
          weight="semibold"
          style={{
            fontSize: dimension / 2.5,
          }}
        >
          {initials}
        </Text>
      ) : null}
    </View>
  );
};