import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '@/src/components/ActionButton';
import { AuthLink, AuthShell, AuthTextField } from '@/src/components/AuthShell';
import { NativePressable } from '@/src/components/NativePressable';
import { AppIcon } from '@/src/components/AppIcon';
import { AppText } from '@/src/components/Typography';
import { useToast } from '@/src/feedback/Toast';
import { notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';

function isValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value.trim());
}

export default function RegisterScreen() {
  const params = useLocalSearchParams<{ redirect?: string }>();
  const { palette, t } = useProductSettings();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [riskAccepted, setRiskAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const emailError = submitted && !isValidEmail(email) ? t('auth.error.email') : '';
  const passwordError = submitted && password.length < 6 ? t('auth.error.password') : '';
  const confirmError = submitted && password !== confirmPassword ? t('auth.error.confirmPassword') : '';
  const riskError = submitted && !riskAccepted ? t('auth.error.risk') : '';

  const submit = () => {
    setSubmitted(true);

    if (!isValidEmail(email) || password.length < 6 || password !== confirmPassword || !riskAccepted) {
      void notifyWarning();
      toast.show({ message: t('auth.error.fixFields'), title: t('auth.register.blocked'), tone: 'warning' });
      return;
    }

    void notifySuccess();
    router.push(
      `/auth/verify?intent=register&email=${encodeURIComponent(email.trim())}&redirect=${encodeURIComponent(
        typeof params.redirect === 'string' ? params.redirect : '/markets',
      )}`,
    );
  };

  return (
    <AuthShell
      footer={<ActionButton accessibilityLabel={t('auth.register.submit')} label={t('auth.register.submit')} onPress={submit} tone="brand" />}
      kicker={t('auth.register.kicker')}
      step={t('auth.flow.stepRegister')}
      subtitle={t('auth.register.subtitle')}
      title={t('auth.register.title')}>
      <AuthTextField
        autoComplete="email"
        error={emailError}
        icon="emailMessage"
        keyboardType="email-address"
        label={t('auth.email')}
        onChangeText={setEmail}
        placeholder={t('auth.emailPlaceholder')}
        textContentType="emailAddress"
        value={email}
      />
      <AuthTextField
        autoComplete="new-password"
        error={passwordError}
        icon="secureLock"
        label={t('auth.password')}
        onChangeText={setPassword}
        placeholder={t('auth.passwordPlaceholder')}
        secureTextEntry
        textContentType="newPassword"
        value={password}
      />
      <AuthTextField
        autoComplete="new-password"
        error={confirmError}
        icon="statusVerified"
        label={t('auth.confirmPassword')}
        onChangeText={setConfirmPassword}
        placeholder={t('auth.confirmPasswordPlaceholder')}
        secureTextEntry
        textContentType="newPassword"
        value={confirmPassword}
      />
      <AuthTextField
        autoCapitalize="characters"
        icon="promoTicket"
        label={t('auth.inviteCode')}
        onChangeText={setInviteCode}
        placeholder={t('auth.inviteCodePlaceholder')}
        value={inviteCode}
      />
      <NativePressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: riskAccepted }}
        minTouch={44}
        onPress={() => setRiskAccepted((value) => !value)}
        style={StyleSheet.flatten([styles.riskRow, { backgroundColor: palette.panel, borderColor: riskError ? palette.danger : palette.lineSoft }])}>
        <View style={StyleSheet.flatten([styles.checkbox, { backgroundColor: riskAccepted ? palette.text : palette.panelHigh, borderColor: riskAccepted ? palette.text : palette.line }])}>
          {riskAccepted ? <AppIcon color={palette.panel} name="checkMark" size={12} /> : null}
        </View>
        <AppText numberOfLines={3} tone="muted" variant="caption">
          {t('auth.riskAccept')}
        </AppText>
      </NativePressable>
      {riskError ? (
        <AppText tone="danger" variant="caption">
          {riskError}
        </AppText>
      ) : null}
      <View style={styles.centerLink}>
        <AuthLink label={t('auth.haveAccount')} onPress={() => router.replace('/auth')} />
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  centerLink: {
    alignItems: 'center',
  },
  checkbox: {
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  riskRow: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 58,
    padding: 12,
  },
});
