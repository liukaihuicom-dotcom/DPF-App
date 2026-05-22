import { router, type Href, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '@/src/components/ActionButton';
import { AuthShell } from '@/src/components/AuthShell';
import { AppIcon, type AppIconName } from '@/src/components/AppIcon';
import { AppText } from '@/src/components/Typography';
import { useToast } from '@/src/feedback/Toast';
import { notifySuccess } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';

function safeRedirect(value: string | undefined) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/';
  }

  return value;
}

export default function AccountReviewScreen() {
  const params = useLocalSearchParams<{ email?: string; redirect?: string }>();
  const { palette, setAuthStatus, t } = useProductSettings();
  const toast = useToast();
  const email = typeof params.email === 'string' && params.email ? params.email : t('auth.verify.fallbackEmail');
  const redirect = safeRedirect(typeof params.redirect === 'string' ? params.redirect : undefined);
  const items: [AppIconName, string, string][] = [
    ['statusVerified', t('auth.review.emailVerified'), t('auth.review.emailVerifiedBody', { email })],
    ['riskShield', t('auth.review.riskConfirmed'), t('auth.review.riskConfirmedBody')],
    ['infoCircle', t('auth.review.kycPending'), t('auth.review.kycPendingBody')],
  ];

  const activate = () => {
    setAuthStatus('signedIn');
    void notifySuccess();
    toast.show({ message: t('auth.review.successBody'), title: t('auth.review.successTitle'), tone: 'success' });
    router.replace(redirect as Href);
  };

  return (
    <AuthShell
      footer={<ActionButton accessibilityLabel={t('auth.review.activate')} label={t('auth.review.activate')} onPress={activate} tone="brand" />}
      kicker={t('auth.review.kicker')}
      step={t('auth.flow.stepAccountReview')}
      subtitle={t('auth.review.subtitle')}
      title={t('auth.review.title')}>
      <View style={StyleSheet.flatten([styles.summaryCard, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
        <View style={StyleSheet.flatten([styles.summaryIcon, { backgroundColor: palette.text, borderColor: palette.text }])}>
          <AppIcon color={palette.panel} name="addUser" size={22} />
        </View>
        <View style={styles.flex}>
          <AppText variant="subtitle">{t('auth.review.readyTitle')}</AppText>
          <AppText numberOfLines={3} tone="muted" variant="caption">
            {t('auth.review.readyBody')}
          </AppText>
        </View>
      </View>

      <View style={styles.reviewList}>
        {items.map(([icon, title, body], index) => (
          <View key={title} style={StyleSheet.flatten([styles.reviewItem, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
            <View
              style={StyleSheet.flatten([
                styles.reviewIcon,
                {
                  backgroundColor: index < 2 ? palette.panelSoft : `${palette.amber}12`,
                },
              ])}>
              <AppIcon color={index < 2 ? palette.brand : palette.amber} name={icon} size={16} />
            </View>
            <View style={styles.flex}>
              <AppText variant="body">{title}</AppText>
              <AppText numberOfLines={3} tone="muted" variant="caption">
                {body}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      <View style={StyleSheet.flatten([styles.riskPanel, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
        <AppIcon color={palette.textMuted} name="infoCircle" size={15} />
        <AppText numberOfLines={4} tone="muted" variant="caption">
          {t('auth.review.securityNote')}
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
  reviewIcon: {
    alignItems: 'center',
    borderRadius: 999,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  reviewItem: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  reviewList: {
    gap: 10,
  },
  riskPanel: {
    alignItems: 'flex-start',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  summaryCard: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 14,
  },
  summaryIcon: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
});
