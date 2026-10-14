import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: any) {
  const { children, onPressIn, style, ...rest } = props ?? {};

  return (
    <Pressable
      {...rest}
      style={style}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPressIn?.(ev);
      }}
    >
      {children}
    </Pressable>
  );
}
