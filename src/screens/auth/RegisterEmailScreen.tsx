import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { isValidEmail, safeRedirect } from '@/src/auth/authFlow';
import { ActionButton } from '@/src/components/ActionButton';
import { AuthDescriptionAction, AuthLanguageAction, AuthShell, AuthTextField } from '@/src/components/AuthShell';
import { AuthContactConfirmDialog, AuthErrorSheet } from '@/src/components/AuthFlowControls';
import { notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';

export default function RegisterEmailScreen() {
  const params = useLocalSearchParams<{ redirect?: string }>();
  const { t } = useProductSettings();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const redirect = safeRedirect(typeof params.redirect === 'string' ? params.redirect : undefined);
  const trimmedEmail = email.trim();
  const emailError = submitted && !isValidEmail(email) ? t('auth.error.email') : '';
  const canSubmit = isValidEmail(email);

  const submit = () => {
    setSubmitted(true);

    if (!isValidEmail(email)) {
      void notifyWarning();
      setErrorOpen(true);
      return;
    }

    setConfirmOpen(true);
  };

  const confirmEmail = () => {
    setConfirmOpen(false);
    void notifySuccess();
    router.push(`/auth/register-email-code?email=${encodeURIComponent(trimmedEmail)}&redirect=${encodeURIComponent(String(redirect))}` as never);
  };

  return (
    <AuthShell
      closeToLaunch
      descriptionAction={
        <AuthDescriptionAction
          actionLabel={t('auth.register.loginAction')}
          label={t('auth.register.haveAccountPrefix')}
          onPress={() => router.replace('/auth' as never)}
        />
      }
      footer={<ActionButton disabled={!canSubmit} label={t('auth.action.continue')} onPress={submit} tone="brand" variant="filled" />}
      progressStep={1}
      rightAction={<AuthLanguageAction />}
      subtitle={t('auth.register.emailEntrySubtitle')}
      title={t('auth.register.emailEntryTitle')}>
      <AuthTextField
        autoFocus
        autoComplete="email"
        error={emailError}
        keyboardType="email-address"
        label={t('auth.email')}
        onChangeText={setEmail}
        placeholder={t('auth.emailPlaceholder')}
        textContentType="emailAddress"
        value={email}
      />
      <AuthErrorSheet body={t('auth.error.fixFields')} onClose={() => setErrorOpen(false)} open={errorOpen} title={t('auth.register.blocked')} />
      <AuthContactConfirmDialog
        channel="email"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmEmail}
        open={confirmOpen}
        target={trimmedEmail}
      />
    </AuthShell>
  );
}
