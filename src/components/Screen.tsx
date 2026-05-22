import { PropsWithChildren, ReactNode } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePalette } from '@/src/settings/ProductSettings';
import { layout, spacing } from '@/src/theme/tokens';

import { AppTopBar, type AppTopBarAction } from './AppTopBar';

type ScreenProps = PropsWithChildren<{
  align?: 'left' | 'center';
  back?: boolean;
  contentInsetBottom?: number;
  contentPadding?: 'default' | 'flush';
  dismissKeyboardOnTap?: boolean;
  keyboardAware?: boolean;
  overlay?: ReactNode;
  rightActions?: AppTopBarAction[];
  scroll?: boolean;
  subtitle?: string;
  stickyFooter?: ReactNode;
  title?: string;
  topBar?: ReactNode;
}>;

export function Screen({
  align,
  back,
  children,
  contentInsetBottom = 0,
  contentPadding = 'default',
  dismissKeyboardOnTap,
  keyboardAware,
  overlay,
  rightActions,
  scroll = true,
  stickyFooter,
  subtitle,
  title,
  topBar,
}: ScreenProps) {
  const palette = useThemePalette();
  const header = topBar ?? (title ? <AppTopBar actions={rightActions} align={align} back={back} subtitle={subtitle} title={title} /> : null);
  const bottomPadding = stickyFooter ? 122 + contentInsetBottom : layout.screenBottomPadding + contentInsetBottom;
  const wrapDismiss = (node: ReactNode) =>
    dismissKeyboardOnTap ? (
      <Pressable accessible={false} onPress={Keyboard.dismiss} style={styles.flex}>
        {node}
      </Pressable>
    ) : (
      node
    );

  const body = !scroll ? (
    <View style={StyleSheet.flatten([styles.body, { backgroundColor: palette.bg }])}>{children}</View>
  ) : (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        contentPadding === 'flush' && styles.contentFlush,
        { paddingBottom: bottomPadding },
      ]}
      contentInsetAdjustmentBehavior="never"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={StyleSheet.flatten([styles.body, { backgroundColor: palette.bg }])}>
      {children}
    </ScrollView>
  );

  const content = (
    <View style={StyleSheet.flatten([styles.safe, { backgroundColor: palette.bg }])}>
      <SafeAreaView edges={['top']} style={styles.flex}>
        {header}
        {wrapDismiss(body)}
        {stickyFooter ? (
          <SafeAreaView edges={['bottom']} style={StyleSheet.flatten([styles.footerSafe, { backgroundColor: palette.panelHigh, borderTopColor: palette.lineSoft }])}>
            <View style={styles.footer}>{stickyFooter}</View>
          </SafeAreaView>
        ) : null}
      </SafeAreaView>
      {overlay}
    </View>
  );

  if (keyboardAware) {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        {content}
      </KeyboardAvoidingView>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    position: 'relative',
  },
  body: {
    flex: 1,
  },
  content: {
    gap: layout.screenGap,
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.xs,
  },
  contentFlush: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  flex: {
    flex: 1,
  },
  footer: {
    gap: spacing.sm,
    paddingBottom: 18,
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.md,
  },
  footerSafe: {
    borderTopWidth: 1,
  },
});
