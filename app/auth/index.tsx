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

export default function LoginScreen() {
  const params = useLocalSearchParams<{ redirect?: string }>();
  const { palette, t } = useProductSettings();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const emailError = submitted && !isValidEmail(email) ? t('auth.error.email') : '';
  const passwordError = submitted && password.length < 6 ? t('auth.error.password') : '';

  const submit = () => {
    setSubmitted(true);

    if (!isValidEmail(email) || password.length < 6) {
      void notifyWarning();
      toast.show({ message: t('auth.error.fixFields'), title: t('auth.login.blocked'), tone: 'warning' });
      return;
    }

    void notifySuccess();
    router.push(
      `/auth/verify?intent=login&email=${encodeURIComponent(email.trim())}&redirect=${encodeURIComponent(
        typeof params.redirect === 'string' ? params.redirect : '/markets',
      )}`,
    );
  };

  return (
    <AuthShell
      footer={<ActionButton accessibilityLabel={t('auth.login.submit')} label={t('auth.login.submit')} onPress={submit} tone="brand" />}
      kicker={t('auth.login.kicker')}
      step={t('auth.flow.stepLogin')}
      subtitle={t('auth.login.subtitle')}
      title={t('auth.login.title')}>
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
        autoComplete="password"
        error={passwordError}
        icon="secureLock"
        label={t('auth.password')}
        onChangeText={setPassword}
        placeholder={t('auth.passwordPlaceholder')}
        secureTextEntry
        textContentType="password"
        value={password}
      />
      <View style={styles.linkRow}>
        <AuthLink label={t('auth.createAccount')} onPress={() => router.push('/auth/register')} />
        <AuthLink label={t('auth.forgotPassword')} onPress={() => router.push('/auth/forgot-password')} />
      </View>
      <View style={StyleSheet.flatten([styles.divider, { backgroundColor: palette.lineSoft }])} />
      <NativePressable
        accessibilityRole="button"
        onPress={() => {
          void notifyWarning();
          toast.show({ message: t('top.placeholderMessage'), title: t('auth.socialUnavailable'), tone: 'warning' });
        }}
        style={StyleSheet.flatten([styles.socialButton, { backgroundColor: palette.panelHigh, borderColor: palette.lineSoft }])}>
        <AppIcon color={palette.text} name="appApple" size={17} />
        <AppText variant="body">{t('auth.apple')}</AppText>
      </NativePressable>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
  },
  linkRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 14,
  },
});
