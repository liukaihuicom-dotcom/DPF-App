import { router, type Href, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '@/src/components/ActionButton';
import { AuthLink, AuthShell, AuthTextField } from '@/src/components/AuthShell';
import { AppIcon } from '@/src/components/AppIcon';
import { AppText } from '@/src/components/Typography';
import { useToast } from '@/src/feedback/Toast';
import { notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';

const DEMO_OTP = '123456';
const RESEND_SECONDS = 30;

function sanitizeOtp(value: string) {
  return value.replace(/\D/g, '').slice(0, 6);
}

function safeRedirect(value: string | undefined) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/';
  }

  return value;
}

export default function VerifyAuthScreen() {
  const params = useLocalSearchParams<{ email?: string; intent?: string; redirect?: string }>();
  const { palette, setAuthStatus, t } = useProductSettings();
  const toast = useToast();
  const [code, setCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const intent = params.intent === 'register' ? 'register' : 'login';
  const email = typeof params.email === 'string' && params.email ? params.email : t('auth.verify.fallbackEmail');
  const redirect = safeRedirect(typeof params.redirect === 'string' ? params.redirect : undefined);
  const codeError = submitted && code !== DEMO_OTP ? (code.length === 6 ? t('auth.verify.errorCode') : t('auth.verify.errorLength')) : '';
  const submitLabel = intent === 'register' ? t('auth.verify.submitRegister') : t('auth.verify.submitLogin');
  const subtitle = useMemo(() => t('auth.verify.subtitle', { email }), [email, t]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return undefined;
    }

    const timer = setTimeout(() => setSecondsLeft((value) => Math.max(value - 1, 0)), 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const submit = () => {
    setSubmitted(true);

    if (code !== DEMO_OTP) {
      void notifyWarning();
      toast.show({ message: t('auth.verify.errorFix'), title: t('auth.verify.blocked'), tone: 'warning' });
      return;
    }

    void notifySuccess();

    if (intent === 'register') {
      toast.show({ message: t('auth.verify.registerSuccessBody'), title: t('auth.verify.successTitle'), tone: 'success' });
      router.replace(`/auth/account-review?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    setAuthStatus('signedIn');
    toast.show({ message: t('auth.login.successBody'), title: t('auth.login.successTitle'), tone: 'success' });
    router.replace(redirect as Href);
  };

  const resend = () => {
    setCode('');
    setSubmitted(false);
    setSecondsLeft(RESEND_SECONDS);
    toast.show({ message: t('auth.verify.resendBody', { code: DEMO_OTP }), title: t('auth.verify.resendTitle'), tone: 'success' });
  };

  return (
    <AuthShell
      footer={<ActionButton accessibilityLabel={submitLabel} label={submitLabel} onPress={submit} tone="brand" />}
      kicker={t('auth.verify.kicker')}
      step={intent === 'register' ? t('auth.flow.stepVerifyRegister') : t('auth.flow.stepVerifyLogin')}
      subtitle={subtitle}
      title={t('auth.verify.title')}>
      <View style={StyleSheet.flatten([styles.noticeCard, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
        <View style={StyleSheet.flatten([styles.noticeIcon, { backgroundColor: palette.panelSoft }])}>
          <AppIcon color={palette.brand} name="riskShield" size={18} />
        </View>
        <View style={styles.flex}>
          <AppText variant="subtitle">{t('auth.verify.demoCodeTitle')}</AppText>
          <AppText tone="muted" variant="caption">
            {t('auth.verify.demoCodeBody', { code: DEMO_OTP })}
          </AppText>
        </View>
      </View>

      <AuthTextField
        autoComplete="one-time-code"
        error={codeError}
        helperText={t('auth.verify.helper')}
        icon="secureLock"
        inputMode="numeric"
        keyboardType="number-pad"
        label={t('auth.verify.code')}
        maxLength={6}
        onChangeText={(value) => {
          setCode(sanitizeOtp(value));
          if (submitted) {
            setSubmitted(false);
          }
        }}
        placeholder={t('auth.verify.placeholder')}
        textContentType="oneTimeCode"
        value={code}
      />

      <View style={styles.linkRow}>
        <AuthLink label={t('auth.verify.clear')} onPress={() => {
          setCode('');
          setSubmitted(false);
        }} />
        {secondsLeft > 0 ? (
          <AppText tone="muted" variant="caption">
            {t('auth.verify.resendCountdown', { seconds: secondsLeft })}
          </AppText>
        ) : (
          <AuthLink label={t('auth.verify.resend')} onPress={resend} />
        )}
      </View>

      <View style={StyleSheet.flatten([styles.securityNote, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
        <AppIcon color={palette.textMuted} name="infoCircle" size={15} />
        <AppText numberOfLines={3} tone="muted" variant="caption">
          {t('auth.verify.securityNote')}
        </AppText>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  linkRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noticeCard: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  noticeIcon: {
    alignItems: 'center',
    borderRadius: 999,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  securityNote: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
});
