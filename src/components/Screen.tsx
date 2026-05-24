import { PropsWithChildren, ReactNode } from 'react';
import type { Href } from 'expo-router';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { lineWidth, layout, spacing } from '@/src/theme/tokens';

import { AppTopBar, type AppTopBarAction } from './AppTopBar';

type ScreenProps = PropsWithChildren<{
  align?: 'left' | 'center';
  back?: boolean;
  backHref?: Href;
  contentInsetBottom?: number;
  contentPadding?: 'default' | 'flush';
  dismissKeyboardOnTap?: boolean;
  keyboardAware?: boolean;
  overlay?: ReactNode;
  rightActions?: AppTopBarAction[];
  scroll?: boolean;
  subtitle?: string;
  stickyFooterBackground?: 'page' | 'surface';
  stickyFooter?: ReactNode;
  title?: string;
  topBar?: ReactNode;
}>;

export function Screen({
  align,
  back,
  backHref,
  children,
  contentInsetBottom = 0,
  contentPadding = 'default',
  dismissKeyboardOnTap,
  keyboardAware,
  overlay,
  rightActions,
  scroll = true,
  stickyFooterBackground = 'surface',
  stickyFooter,
  subtitle,
  title,
  topBar,
}: ScreenProps) {
  const colors = useThemeColors();
  const header = topBar ?? (title ? <AppTopBar actions={rightActions} align={align} back={back} backHref={backHref} subtitle={subtitle} title={title} /> : null);
  const bottomPadding = stickyFooter ? 122 + contentInsetBottom : layout.screenBottomPadding + contentInsetBottom;
  const stickyFooterBackgroundColor = stickyFooterBackground === 'page' ? colors.surface.canvas : colors.surface.raised;
  const wrapDismiss = (node: ReactNode) =>
    dismissKeyboardOnTap ? (
      <Pressable accessible={false} onPress={Keyboard.dismiss} style={styles.flex}>
        {node}
      </Pressable>
    ) : (
      node
    );

  const body = !scroll ? (
    <View style={StyleSheet.flatten([styles.body, { backgroundColor: colors.surface.canvas }])}>{children}</View>
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
      style={StyleSheet.flatten([styles.body, { backgroundColor: colors.surface.canvas }])}>
      {children}
    </ScrollView>
  );

  const content = (
    <View style={StyleSheet.flatten([styles.safe, { backgroundColor: colors.surface.canvas }])}>
      <SafeAreaView edges={['top']} style={styles.flex}>
        {header}
        {wrapDismiss(body)}
        {stickyFooter ? (
          <SafeAreaView edges={['bottom']} style={StyleSheet.flatten([styles.footerSafe, { backgroundColor: stickyFooterBackgroundColor, borderTopColor: colors.border.subtle }])}>
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
    borderTopWidth: lineWidth.hairline,
  },
});
