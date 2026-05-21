import { ReactNode } from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';

import { useThemePalette } from '@/src/settings/ProductSettings';

import { PhosphorIcon, type PhosphorIconName } from './PhosphorIcon';
import { AppText } from './Typography';

export type TextFieldProps = Omit<TextInputProps, 'style'> & {
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  icon?: PhosphorIconName | ReactNode;
  inputStyle?: StyleProp<TextStyle>;
  label: string;
  labelHidden?: boolean;
  shellStyle?: StyleProp<ViewStyle>;
};

export function TextField({
  containerStyle,
  disabled,
  editable,
  error,
  helperText,
  icon,
  inputStyle,
  label,
  labelHidden,
  multiline,
  placeholderTextColor,
  shellStyle,
  ...props
}: TextFieldProps) {
  const palette = useThemePalette();
  const fieldEditable = editable !== false && !disabled;
  const iconNode =
    typeof icon === 'string' ? <PhosphorIcon color={error ? palette.danger : palette.textDim} name={icon as PhosphorIconName} size={15} /> : icon ?? null;

  return (
    <View style={StyleSheet.flatten([styles.wrap, containerStyle])}>
      {labelHidden ? null : (
        <AppText tone="muted" variant="caption">
          {label}
        </AppText>
      )}
      <View
        style={StyleSheet.flatten([
          styles.shell,
          multiline && styles.shellMultiline,
          {
            backgroundColor: disabled ? palette.panelSoft : palette.panel,
            borderColor: error ? palette.danger : palette.lineSoft,
          },
          shellStyle,
        ])}>
        {iconNode}
        <TextInput
          accessibilityLabel={props.accessibilityLabel ?? label}
          editable={fieldEditable}
          multiline={multiline}
          placeholderTextColor={placeholderTextColor ?? palette.textDim}
          selectionColor={palette.brand}
          style={StyleSheet.flatten([
            styles.input,
            multiline && styles.inputMultiline,
            { color: disabled ? palette.textDim : palette.text },
            inputStyle,
          ])}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...props}
        />
      </View>
      {error ? (
        <AppText tone="danger" variant="caption">
          {error}
        </AppText>
      ) : helperText ? (
        <AppText tone="muted" variant="caption">
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 46,
    minWidth: 0,
    padding: 0,
  },
  inputMultiline: {
    minHeight: 68,
    paddingTop: 0,
  },
  shell: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  shellMultiline: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  wrap: {
    gap: 7,
  },
});
