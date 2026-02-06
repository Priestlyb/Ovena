// components/atoms/Text.tsx - Atomic text component
import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { styles } from '@/constants/styles';

export type TextVariant = 
  | 'h1' | 'h2' | 'h3' | 'h4' 
  | 'body' | 'bodySmall' | 'caption' 
  | 'label' | 'link';

export type TextColor = 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'white';

interface CustomTextProps extends RNTextProps {
  variant?: TextVariant;
  color?: TextColor;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

export const Text: React.FC<CustomTextProps> = ({
  variant = 'body',
  color = 'primary',
  weight = 'regular',
  align = 'left',
  children,
  style,
  ...props
}) => {
  return (
    <RNText
      style={[
        styles.text,
        styles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
        styles[`textColor${color.charAt(0).toUpperCase() + color.slice(1)}`],
        styles[`textWeight${weight.charAt(0).toUpperCase() + weight.slice(1)}`],
        { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};