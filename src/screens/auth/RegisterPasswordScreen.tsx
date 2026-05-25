import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { isStrongPassword, safeRedirect } from '@/src/auth/authFlow';
import { ActionButton } from '@/src/components/ActionButton';
import { AuthShell, AuthTextField } from '@/src/components/AuthShell';
import { AuthErrorSheet, AuthLeaveVerifiedStepDialog, PasswordRuleList } from '@/src/components/AuthFlowControls';
import { NativePressable } from '@/src/components/NativePressable';
import { AppIcon } from '@/src/components/AppIcon';
import { notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { REMEMBERED_WEB_DEMO_DEVICE_LABEL, useProductSettings } from '@/src/settings/ProductSettings';

export default function RegisterPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string; phone?: string; redirect?: string }>();
  const { colors, profileAvatarId, setAuthStatus, setLocalPinCode, setPinGateStatus, setPinStatus, setProfileNickname, setRememberedLoginSnapshot, t } = useProductSettings();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const redirect = safeRedirect(typeof params.redirect === 'string' ? params.redirect : undefined);
  const phone = typeof params.phone === 'string' ? params.phone : '';
  const email = typeof params.email === 'string' ? params.email : '';
  const passwordValid = isStrongPassword(password);
  const confirmValid = password === confirmPassword && confirmPassword.length > 0;
  const canSubmit = passwordValid && confirmValid;
  const passwordError = submitted && !passwordValid ? t('auth.error.passwordStrong') : '';
  const confirmError = submitted && !confirmValid ? t('auth.error.confirmPassword') : '';

  const submit = () => {
    setSubmitted(true);

    if (!canSubmit) {
      void notifyWarning();
      setErrorOpen(true);
      return;
    }

    setRememberedLoginSnapshot({
      account: phone || email,
      avatarId: profileAvatarId,
      channel: phone ? 'phone' : 'email',
      deviceLabel: REMEMBERED_WEB_DEMO_DEVICE_LABEL,
      lastLoginAt: new Date().toISOString(),
      lastLoginMethod: 'register',
    });
    setLocalPinCode('');
    setPinGateStatus('unlocked');
    setPinStatus('unset');
    setAuthStatus('signedIn');
    setProfileNickname('');
    void notifySuccess();
    router.replace(redirect);
  };

  const visibilityButton = (
    <NativePressable accessibilityRole="button" minTouch={34} onPress={() => setVisible((value) => !value)}>
      <AppIcon name="icon.system.password_visible" size={18} />
    </NativePressable>
  );

  return (
    <AuthShell
      footer={<ActionButton disabled={!canSubmit} label={t('auth.register.finish')} onPress={submit} tone="brand" variant="filled" />}
      onBackPress={() => setLeaveOpen(true)}
      progressStep={3}
      subtitle={t('auth.register.passwordSubtitle')}
      title={t('auth.register.passwordTitle')}>
      <AuthTextField
        autoFocus
        autoComplete="new-password"
        error={passwordError}
        label={t('auth.password.new')}
        onChangeText={setPassword}
        placeholder={t('auth.password.newPlaceholder')}
        rightSlot={visibilityButton}
        secureTextEntry={!visible}
        textContentType="newPassword"
        value={password}
      />
      <PasswordRuleList password={password} />
      <AuthTextField
        autoComplete="new-password"
        error={confirmError}
        label={t('auth.confirmPassword')}
        onChangeText={setConfirmPassword}
        placeholder={t('auth.confirmPasswordPlaceholder')}
        secureTextEntry={!visible}
        textContentType="newPassword"
        value={confirmPassword}
      />
      <AuthErrorSheet body={t('auth.error.fixFields')} onClose={() => setErrorOpen(false)} open={errorOpen} title={t('auth.register.blocked')} />
      <AuthLeaveVerifiedStepDialog
        body={t('auth.register.leaveAfterPhoneBody')}
        onCancel={() => setLeaveOpen(false)}
        onConfirm={() => router.replace(`/auth/register-phone?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(String(redirect))}` as never)}
        open={leaveOpen}
        title={t('auth.register.leaveAfterPhoneTitle')}
      />
    </AuthShell>
  );
}
