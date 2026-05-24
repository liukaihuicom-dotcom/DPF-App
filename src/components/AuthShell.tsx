import { router } from 'expo-router';
import { PropsWithChildren, ReactNode } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInputProps, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { layout, lineWidth, radius, size, spacing, typography } from '@/src/theme/tokens';
import { impactLight } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { localeOptions, type Locale } from '@/src/i18n/translations';

import { AppIcon } from './AppIcon';
import { NativePressable } from './NativePressable';
import type { AppIconName } from './AppIcon';
import { bottomSheetPresets, useBottomSheet } from './BottomSheet';
import { FlagIcon } from './FlagIcon';
import { HeaderIconButton } from './HeaderIconButton';
import { TextField } from './TextField';
import { AppText } from './Typography';

type AuthShellProps = PropsWithChildren<{
  descriptionAction?: ReactNode;
  closeToLaunch?: boolean;
  footer?: ReactNode;
  kicker?: string;
  onBackPress?: () => void;
  progressStep?: number;
  progressTotal?: number;
  rightAction?: ReactNode;
  step?: string;
  subtitle: string;
  title: string;
}>;

type AuthTextFieldProps = TextInputProps & {
  containerStyle?: React.ComponentProps<typeof TextField>['containerStyle'];
  error?: string;
  helperText?: string;
  icon?: AppIconName;
  label: string;
  labelHidden?: React.ComponentProps<typeof TextField>['labelHidden'];
  rightSlot?: ReactNode;
  shape?: React.ComponentProps<typeof TextField>['shape'];
  sizePreset?: React.ComponentProps<typeof TextField>['sizePreset'];
};

export function AuthShell({
  children,
  closeToLaunch,
  descriptionAction,
  footer,
  kicker: _kicker,
  onBackPress,
  progressStep,
  progressTotal = 3,
  rightAction,
  step: _step,
  subtitle,
  title,
}: AuthShellProps) {
  const { palette, resolvedThemeMode, t } = useProductSettings();
  const backgroundColor = resolvedThemeMode === 'lightBroker' ? palette.panel : palette.bg;

  const body = (
    <SafeAreaView edges={['top']} style={StyleSheet.flatten([styles.safe, { backgroundColor }])}>
      <View style={styles.topBar}>
        <HeaderIconButton
          accessibilityLabel={closeToLaunch ? t('common.cancel') : t('top.back')}
          icon={closeToLaunch ? 'icon.system.close' : 'icon.system.back'}
          onPress={() => {
            void impactLight();
            if (onBackPress) {
              onBackPress();
              return;
            }

            if (closeToLaunch) {
              router.replace('/launch');
              return;
            }

            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/launch');
            }
          }}
          tone="default"
        />
        {rightAction ? <View style={styles.rightAction}>{rightAction}</View> : <View style={styles.topSpacer} />}
      </View>

      <ScrollView
        contentContainerStyle={StyleSheet.flatten([styles.content, { paddingBottom: footer ? 118 : spacing.xl }])}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {progressStep ? <AuthProgressBar current={progressStep} total={progressTotal} /> : null}
        <View style={styles.hero}>
          <AppText style={styles.titleText} variant="displayXl">
            {title}
          </AppText>
          <AppText numberOfLines={3} style={styles.subtitleText} tone="muted" variant="bodyLg">
            {subtitle}
          </AppText>
          {descriptionAction}
        </View>
        <View style={styles.form}>{children}</View>
      </ScrollView>

      {footer ? (
        <SafeAreaView edges={['bottom']} style={StyleSheet.flatten([styles.footerSafe, { backgroundColor }])}>
          <View style={styles.footer}>{footer}</View>
        </SafeAreaView>
      ) : null}
    </SafeAreaView>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0} style={styles.flex}>
      <Pressable accessible={false} onPress={Keyboard.dismiss} style={styles.flex}>
        {body}
      </Pressable>
    </KeyboardAvoidingView>
  );
}

function AuthProgressBar({ current, total }: { current: number; total: number }) {
  const { palette } = useProductSettings();
  const normalizedCurrent = Math.max(1, Math.min(current, total));

  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ max: total, min: 1, now: normalizedCurrent }} style={styles.progressRow}>
      {Array.from({ length: total }, (_, index) => (
        <View
          key={index}
          style={StyleSheet.flatten([
            styles.progressSegment,
            {
              backgroundColor: index < normalizedCurrent ? palette.text : palette.lineSoft,
            },
          ])}
        />
      ))}
    </View>
  );
}

export function AuthTextField({ containerStyle, error, helperText, icon, label, labelHidden, rightSlot, shape, sizePreset, style, ...props }: AuthTextFieldProps) {
  return (
    <TextField
      autoCapitalize="none"
      containerStyle={containerStyle}
      error={error}
      helperText={helperText}
      icon={icon}
      inputStyle={StyleSheet.flatten([styles.authInputText, style])}
      label={label}
      labelHidden={labelHidden}
      rightSlot={rightSlot}
      shape={shape}
      sizePreset={sizePreset}
      {...props}
    />
  );
}

export function AuthInlineSwitch({ description, label, onPress }: { description?: string; label: string; onPress: () => void }) {
  return (
    <NativePressable accessibilityRole="button" minTouch={36} onPress={onPress} style={styles.inlineSwitch}>
      <AppText numberOfLines={1} style={styles.authLinkText} tone="brand" variant="caption">
        {label}
      </AppText>
      {description ? (
        <AppText numberOfLines={2} tone="dim" variant="microLabel">
          {description}
        </AppText>
      ) : null}
    </NativePressable>
  );
}

export function AuthLink({
  description,
  label,
  onPress,
  style,
  tone = 'link',
}: {
  description?: string;
  label: string;
  onPress: () => void;
  style?: React.ComponentProps<typeof NativePressable>['style'];
  tone?: React.ComponentProps<typeof AppText>['tone'];
}) {
  return (
    <NativePressable accessibilityRole="button" minTouch={36} onPress={onPress} style={StyleSheet.flatten([styles.linkButton, style])}>
      <AppText numberOfLines={1} style={styles.authLinkText} tone={tone} variant="caption">
        {label}
      </AppText>
      {description ? (
        <AppText numberOfLines={2} tone="dim" variant="microLabel">
          {description}
        </AppText>
      ) : null}
    </NativePressable>
  );
}

export function AuthLanguageAction() {
  const { locale, setLocale, t } = useProductSettings();
  const bottomSheet = useBottomSheet();
  const selectLocale = (nextLocale: Locale) => {
    setLocale(nextLocale);
    bottomSheet.hide();
  };
  const openLanguageSheet = () => {
    bottomSheet.show(bottomSheetPresets.selection({
      content: <AuthLanguageSheetContent onSelect={selectLocale} selectedLocale={locale} />,
      title: t('auth.language.selectTitle'),
    }));
  };

  return (
    <HeaderIconButton
      accessibilityLabel={t('auth.language.open')}
      icon="icon.market.global"
      onPress={openLanguageSheet}
      variant="ghost"
    />
  );
}

function AuthLanguageSheetContent({
  onSelect,
  selectedLocale,
}: {
  onSelect: (locale: Locale) => void;
  selectedLocale: Locale;
}) {
  return (
    <View style={styles.languageList}>
      {localeOptions.map((option) => {
        const active = option.value === selectedLocale;

        return (
          <NativePressable
            accessibilityLabel={option.label}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            key={option.value}
            minTouch={44}
            onPress={() => onSelect(option.value)}
            style={styles.languageRow}>
            <FlagIcon code={option.flag} size={30} />
            <AppText numberOfLines={1} style={styles.languageName} variant={active ? 'titleMd' : 'bodyLg'}>
              {option.label}
            </AppText>
            {active ? <AppIcon name="icon.status.check" /> : null}
          </NativePressable>
        );
      })}
    </View>
  );
}

export function AuthDescriptionAction({
  actionLabel,
  label,
  onPress,
}: {
  actionLabel: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.descriptionActionRow}>
      {label ? (
        <AppText numberOfLines={1} style={styles.descriptionActionLabelText} tone="muted" variant="bodyLg">
          {label}
        </AppText>
      ) : null}
      <NativePressable
        accessibilityLabel={`${label}${actionLabel}`}
        accessibilityRole="button"
        minTouch={32}
        onPress={onPress}
        style={styles.descriptionActionLink}>
        <AppText numberOfLines={1} style={styles.descriptionActionText} tone="link" variant="bodyLg">
          {actionLabel}
        </AppText>
      </NativePressable>
    </View>
  );
}

const styles = StyleSheet.create({
  authInputText: {
    ...typography.bodyLg,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null),
  },
  authLinkText: {
    ...typography.bodyMd,
  },
  content: {
    gap: spacing.lg,
    paddingHorizontal: layout.screenPaddingX,
  },
  descriptionActionLink: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  descriptionActionLabelText: {
    ...typography.bodyLg,
  },
  descriptionActionText: {
    ...typography.bodyLg,
    textDecorationLine: 'underline',
  },
  descriptionActionRow: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    columnGap: spacing.xxs,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
    rowGap: spacing.none,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  footer: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.sm,
  },
  footerSafe: {},
  form: {
    gap: spacing.md,
  },
  hero: {
    paddingTop: spacing.sm,
  },
  inlineSwitch: {
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    gap: 2,
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  linkButton: {
    alignItems: 'center',
    gap: 2,
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  languageList: {
    gap: spacing.xs,
  },
  languageName: {
    flex: 1,
    minWidth: 0,
  },
  languageRow: {
    alignItems: 'center',
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: size.input.countryRowMinHeight,
    paddingHorizontal: spacing.none,
  },
  progressRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  progressSegment: {
    borderRadius: radius.full,
    flex: 1,
    height: spacing.xs,
  },
  rightAction: {
    alignItems: 'center',
    minWidth: 44,
  },
  safe: {
    flex: 1,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 58,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  topSpacer: {
    width: 44,
  },
  titleText: {
    minWidth: 0,
  },
  subtitleText: {
    marginTop: spacing.xs,
    minWidth: 0,
  },
});
