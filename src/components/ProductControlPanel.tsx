import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { localeOptions } from '@/src/i18n/translations';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { themePalettes, type ThemeMode } from '@/src/theme/colors';
import type { AuthStatus, Role } from '@/src/domain/types';

import { NativePressable } from './NativePressable';
import { PhosphorIcon, type PhosphorIconName } from './PhosphorIcon';
import { AppText } from './Typography';

const themeModes = Object.keys(themePalettes) as ThemeMode[];
const roles: Role[] = ['trader', 'partner'];
const authStatuses: AuthStatus[] = ['guest', 'signedIn'];
const webSelectStyle = {
  appearance: 'none',
  background: 'transparent',
  border: 0,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: 13,
  height: '100%',
  outline: 'none',
  width: '100%',
} as const;

export function ProductControlPanel() {
  const [open, setOpen] = useState(false);
  const { authStatus, locale, palette, role, setAuthStatus, setLocale, setRole, setThemeMode, t, themeMode } = useProductSettings();

  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.host}>
      {open ? (
        <View style={StyleSheet.flatten([styles.panel, { backgroundColor: palette.panelHigh, borderColor: palette.line }])}>
          <ScrollView contentContainerStyle={styles.panelContent} showsVerticalScrollIndicator={false}>
            <View style={styles.panelTop}>
              <View>
                <AppText tone="dim" variant="eyebrow">
                  {t('control.console')}
                </AppText>
                <AppText variant="subtitle">{t('control.panel')}</AppText>
              </View>
              <NativePressable accessibilityRole="button" minTouch={44} onPress={() => setOpen(false)} style={styles.iconButton}>
                <PhosphorIcon color={palette.textMuted} name="x" size={16} />
              </NativePressable>
            </View>

            <AuthPreview status={authStatus} />

            {authStatus === 'guest' ? (
              <NativePressable
                accessibilityRole="button"
                minTouch={42}
                onPress={() => {
                  setOpen(false);
                  router.push('/auth/onboarding');
                }}
                style={StyleSheet.flatten([styles.authShortcut, { backgroundColor: palette.text, borderColor: palette.text }])}>
                <AppText style={{ color: palette.panel }} variant="body">
                  {t('auth.openLogin')}
                </AppText>
                <PhosphorIcon color={palette.panel} name="caret-right" size={16} />
              </NativePressable>
            ) : null}

            <View style={styles.formGrid}>
              <ControlSelect
                icon="user"
                label={t('control.accountStatus')}
                onChange={(value) => setAuthStatus(value as AuthStatus)}
                options={authStatuses.map((item) => ({ label: t(`auth.status.${item}`), value: item }))}
                value={authStatus}
              />
              <ControlSelect
                icon="arrows-left-right"
                label={t('control.role')}
                onChange={(value) => setRole(value as Role)}
                options={roles.map((item) => ({ label: item === 'trader' ? t('role.trader') : t('role.partner'), value: item }))}
                value={role}
              />
              <ControlSelect
                icon="sliders-horizontal"
                label={t('control.theme')}
                onChange={(value) => setThemeMode(value as ThemeMode)}
                options={themeModes.map((item) => ({ label: t(`theme.${item}`), value: item }))}
                value={themeMode}
              />
              <ControlSelect
                icon="globe"
                label={t('control.language')}
                onChange={(value) => setLocale(value as typeof locale)}
                options={localeOptions.map((item) => ({ label: item.label, value: item.value }))}
                value={locale}
              />
            </View>
          </ScrollView>
        </View>
      ) : null}

      <NativePressable
        accessibilityLabel={t('control.panel')}
        accessibilityRole="button"
        minTouch={48}
        onPress={() => setOpen((value) => !value)}
        style={StyleSheet.flatten([styles.fab, { backgroundColor: palette.panelHigh, borderColor: palette.brand }])}>
        <PhosphorIcon color={palette.brand} name="sliders-horizontal" size={20} />
      </NativePressable>
    </View>
  );
}

function AuthPreview({ status }: { status: AuthStatus }) {
  const { palette, t } = useProductSettings();
  const iconByStatus: Record<AuthStatus, PhosphorIconName> = {
    guest: 'globe',
    signedIn: 'check',
  };
  const progressByStatus: Record<AuthStatus, number> = {
    guest: 12,
    signedIn: 100,
  };

  return (
    <View style={StyleSheet.flatten([styles.authCard, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
      <View style={styles.authIllustration}>
        <View style={StyleSheet.flatten([styles.orbit, { borderColor: `${palette.brand}55` }])} />
        <View style={StyleSheet.flatten([styles.mailTile, { backgroundColor: `${palette.brand}12`, borderColor: `${palette.brand}66` }])}>
          <PhosphorIcon color={palette.brand} name={iconByStatus[status]} size={18} />
        </View>
      </View>
      <AppText tone="dim" variant="eyebrow">
        {t('auth.controlHint')}
      </AppText>
      <AppText variant="subtitle">{t(`auth.card.${status}.title`)}</AppText>
      <AppText tone="muted" variant="caption">
        {t(`auth.card.${status}.body`)}
      </AppText>
      <View style={StyleSheet.flatten([styles.authProgressTrack, { backgroundColor: palette.panelSoft }])}>
        <View style={StyleSheet.flatten([styles.authProgressFill, { backgroundColor: palette.brand, width: `${progressByStatus[status]}%` }])} />
      </View>
    </View>
  );
}

function ControlSelect({
  icon,
  label,
  onChange,
  options,
  value,
}: {
  icon: PhosphorIconName;
  label: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  value: string;
}) {
  const { palette } = useProductSettings();
  const selected = options.find((item) => item.value === value);

  return (
    <View style={styles.field}>
      <AppText tone="dim" variant="eyebrow">
        {label}
      </AppText>
      <View style={StyleSheet.flatten([styles.selectShell, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
        <View style={StyleSheet.flatten([styles.selectIcon, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
          <PhosphorIcon color={palette.brand} name={icon} size={13} />
        </View>
        <View style={styles.selectValue}>
          {Platform.OS === 'web' ? (
            <select
              aria-label={label}
              onChange={(event) => onChange(event.currentTarget.value)}
              style={{ ...webSelectStyle, color: palette.text }}
              value={value}>
              {options.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          ) : (
            <AppText numberOfLines={1} variant="body">
              {selected?.label ?? value}
            </AppText>
          )}
        </View>
        <PhosphorIcon color={palette.textDim} name="caret-down" size={15} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  host: {
    alignItems: 'flex-end',
    bottom: 82,
    gap: 10,
    position: 'absolute',
    right: 16,
    zIndex: 50,
  },
  iconButton: {
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  field: {
    gap: 6,
  },
  formGrid: {
    gap: 10,
  },
  selectIcon: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  selectShell: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    minHeight: 44,
    paddingHorizontal: 10,
  },
  selectValue: {
    flex: 1,
    height: 42,
    justifyContent: 'center',
    minWidth: 0,
  },
  panel: {
    borderRadius: 16,
    borderWidth: 1,
    maxHeight: 590,
    width: 292,
  },
  panelContent: {
    gap: 12,
    padding: 12,
  },
  panelTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  authCard: {
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
    padding: 12,
  },
  authIllustration: {
    height: 42,
    justifyContent: 'center',
  },
  authProgressFill: {
    borderRadius: 999,
    height: 6,
  },
  authProgressTrack: {
    borderRadius: 999,
    height: 6,
    overflow: 'hidden',
  },
  authShortcut: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: 12,
  },
  mailTile: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    left: 12,
    position: 'absolute',
    width: 46,
  },
  orbit: {
    borderRadius: 999,
    borderWidth: 1,
    height: 38,
    left: 36,
    position: 'absolute',
    width: 74,
  },
});
