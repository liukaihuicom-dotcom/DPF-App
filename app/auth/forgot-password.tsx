import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '@/src/components/ActionButton';
import { AuthLink, AuthShell, AuthTextField } from '@/src/components/AuthShell';
import { PhosphorIcon } from '@/src/components/PhosphorIcon';
import { AppText } from '@/src/components/Typography';
import { useToast } from '@/src/feedback/Toast';
import { notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';

function isValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value.trim());
}

export default function ForgotPasswordScreen() {
  const { palette, t } = useProductSettings();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);
  const emailError = submitted && !isValidEmail(email) ? t('auth.error.email') : '';

  const submit = () => {
    setSubmitted(true);

    if (!isValidEmail(email)) {
      void notifyWarning();
      toast.show({ message: t('auth.error.fixFields'), title: t('auth.reset.blocked'), tone: 'warning' });
      return;
    }

    setSent(true);
    void notifySuccess();
    toast.show({ message: t('auth.reset.successBody'), title: t('auth.reset.successTitle'), tone: 'success' });
  };

  return (
    <AuthShell
      footer={<ActionButton accessibilityLabel={sent ? t('auth.backToLogin') : t('auth.reset.submit')} label={sent ? t('auth.backToLogin') : t('auth.reset.submit')} onPress={sent ? () => router.replace('/auth') : submit} tone="brand" />}
      kicker={t('auth.reset.kicker')}
      step={t('auth.flow.stepReset')}
      subtitle={t('auth.reset.subtitle')}
      title={t('auth.reset.title')}>
      {sent ? (
        <View style={StyleSheet.flatten([styles.sentCard, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
          <View style={StyleSheet.flatten([styles.sentIcon, { backgroundColor: `${palette.brand}12`, borderColor: `${palette.brand}66` }])}>
            <PhosphorIcon color={palette.brand} name="envelope-open" size={18} />
          </View>
          <View style={styles.flex}>
            <AppText variant="subtitle">{t('auth.reset.sentTitle')}</AppText>
            <AppText numberOfLines={3} tone="muted" variant="caption">
              {t('auth.reset.sentBody', { email })}
            </AppText>
          </View>
        </View>
      ) : (
        <AuthTextField
          autoComplete="email"
          error={emailError}
          icon="envelope-open"
          keyboardType="email-address"
          label={t('auth.email')}
          onChangeText={setEmail}
          placeholder={t('auth.emailPlaceholder')}
          textContentType="emailAddress"
          value={email}
        />
      )}
      <View style={styles.centerLink}>
        <AuthLink label={t('auth.backToLogin')} onPress={() => router.replace('/auth')} />
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  centerLink: {
    alignItems: 'center',
  },
  flex: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  sentCard: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  sentIcon: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
});
