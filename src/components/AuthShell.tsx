import { router } from 'expo-router';
import { PropsWithChildren, ReactNode } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInputProps, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { impactLight } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';

import { NativePressable } from './NativePressable';
import { AppIcon, type AppIconName } from './AppIcon';
import { HeaderIconButton } from './HeaderIconButton';
import { TextField } from './TextField';
import { AppText } from './Typography';

type AuthShellProps = PropsWithChildren<{
  footer?: ReactNode;
  kicker: string;
  step?: string;
  subtitle: string;
  title: string;
}>;

type AuthTextFieldProps = TextInputProps & {
  error?: string;
  helperText?: string;
  icon: AppIconName;
  label: string;
};

export function AuthShell({ children, footer, kicker, step, subtitle, title }: AuthShellProps) {
  const { palette, t } = useProductSettings();

  const body = (
    <SafeAreaView edges={['top']} style={StyleSheet.flatten([styles.safe, { backgroundColor: palette.bg }])}>
      <View style={styles.topBar}>
        <HeaderIconButton
          accessibilityLabel={t('top.back')}
          color={palette.text}
          icon="navigateBack"
          onPress={() => {
            void impactLight();
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/launch');
            }
          }}
          tone="default"
        />
        <View style={StyleSheet.flatten([styles.stepPill, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
          <AppText numberOfLines={1} tone="muted" variant="caption">
            {step ?? t('auth.flow.simulated')}
          </AppText>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={StyleSheet.flatten([styles.content, { paddingBottom: footer ? 124 : 36 }])}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.brandZone}>
          <View style={StyleSheet.flatten([styles.logoMark, { backgroundColor: palette.text, borderColor: palette.text }])}>
            <AppText style={{ color: palette.panel }} variant="subtitle">
              D
            </AppText>
          </View>
          <View style={styles.brandCopy}>
            <AppText tone="dim" variant="eyebrow">
              {kicker}
            </AppText>
            <AppText variant="title">{title}</AppText>
            <AppText numberOfLines={3} tone="muted" variant="body">
              {subtitle}
            </AppText>
          </View>
        </View>

        <View style={StyleSheet.flatten([styles.securityStrip, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
          <View style={StyleSheet.flatten([styles.securityIcon, { backgroundColor: `${palette.brand}12`, borderColor: `${palette.brand}44` }])}>
            <AppIcon color={palette.brand} name="riskShield" size={14} />
          </View>
          <View style={styles.flex}>
            <AppText numberOfLines={1} variant="caption">
              {t('auth.securityTitle')}
            </AppText>
            <AppText numberOfLines={2} tone="muted" variant="caption">
              {t('auth.securityBody')}
            </AppText>
          </View>
        </View>

        <View style={styles.form}>{children}</View>
      </ScrollView>

      {footer ? (
        <SafeAreaView edges={['bottom']} style={StyleSheet.flatten([styles.footerSafe, { backgroundColor: palette.bg, borderTopColor: palette.lineSoft }])}>
          <View style={styles.footer}>{footer}</View>
        </SafeAreaView>
      ) : null}
    </SafeAreaView>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
      <Pressable accessible={false} onPress={Keyboard.dismiss} style={styles.flex}>
        {body}
      </Pressable>
    </KeyboardAvoidingView>
  );
}

export function AuthTextField({ error, helperText, icon, label, style, ...props }: AuthTextFieldProps) {
  return <TextField autoCapitalize="none" error={error} helperText={helperText} icon={icon} inputStyle={style} label={label} {...props} />;
}

export function AuthLink({ label, onPress }: { label: string; onPress: () => void }) {
  const { palette } = useProductSettings();

  return (
    <NativePressable accessibilityRole="button" minTouch={36} onPress={onPress} style={styles.linkButton}>
      <AppText numberOfLines={1} style={{ color: palette.text }} variant="caption">
        {label}
      </AppText>
    </NativePressable>
  );
}

const styles = StyleSheet.create({
  brandCopy: {
    gap: 8,
  },
  brandZone: {
    gap: 18,
    paddingTop: 8,
  },
  content: {
    gap: 18,
    paddingHorizontal: 18,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  footer: {
    gap: 10,
    paddingBottom: 18,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  footerSafe: {
    borderTopWidth: 1,
  },
  form: {
    gap: 16,
  },
  linkButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  logoMark: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  safe: {
    flex: 1,
  },
  securityIcon: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  securityStrip: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 62,
    padding: 12,
  },
  stepPill: {
    borderRadius: 999,
    borderWidth: 1,
    maxWidth: 190,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 58,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
