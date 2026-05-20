import { PropsWithChildren, useState } from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';

type NativePressableProps = PropsWithChildren<
  PressableProps & {
    disabled?: boolean;
    minTouch?: number;
    pressedStyle?: ViewStyle;
    style?: PressableProps['style'];
  }
>;

export function NativePressable({ children, disabled, minTouch = 44, pressedStyle, style, ...props }: NativePressableProps) {
  const [pressed, setPressed] = useState(false);
  const baseStyle: StyleProp<ViewStyle> = StyleSheet.flatten([
    styles.base,
    { minHeight: minTouch, minWidth: minTouch },
    typeof style === 'function' ? undefined : style,
    pressed && !disabled && (pressedStyle ?? styles.pressed),
    disabled && styles.disabled,
  ]);

  return (
    <Pressable
      accessibilityRole={props.accessibilityRole ?? 'button'}
      disabled={disabled}
      hitSlop={props.hitSlop ?? 6}
      {...props}
      onPressIn={(event) => {
        setPressed(true);
        props.onPressIn?.(event);
      }}
      onPressOut={(event) => {
        setPressed(false);
        props.onPressOut?.(event);
      }}
      style={baseStyle}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.56,
  },
  pressed: {
    opacity: 0.72,
  },
});
