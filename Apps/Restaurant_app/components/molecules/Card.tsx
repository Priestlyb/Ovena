// components/molecules/Card.tsx - Molecule card component
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { styles } from '@/constants/styles';

export type CardVariant = 'elevated' | 'outlined' | 'filled';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  padding = 'md',
  onPress,
}) => {
  const paddingSizes = {
    none: 0,
    sm: 12,
    md: 16,
    lg: 20,
  };

  const content = (
    <View
      style={[
        styles.card,
        styles[`card${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
        { padding: paddingSizes[padding] }
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};