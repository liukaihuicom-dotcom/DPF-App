import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '@/src/components/ActionButton';
import { AuthLink, AuthShell } from '@/src/components/AuthShell';
import { NativePressable } from '@/src/components/NativePressable';
import { PhosphorIcon, type PhosphorIconName } from '@/src/components/PhosphorIcon';
import { AppText } from '@/src/components/Typography';
import { dupoinOnboardingSteps } from '@/src/domain/dupoinMvp';
import { localizeText } from '@/src/domain/format';
import { impactLight } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';

export default function OnboardingScreen() {
  const { locale, palette, t } = useProductSettings();
  const steps = [
    ['user-plus', t('onboarding.step.account'), t('onboarding.step.accountHint')],
    ['shield-check', t('onboarding.step.risk'), t('onboarding.step.riskHint')],
    ['chart-line-up', t('onboarding.step.workspace'), t('onboarding.step.workspaceHint')],
  ] as const;
  const quickChoices = [
    ['arrows-left-right', t('onboarding.choice.trader'), t('onboarding.choice.traderHint')],
    ['share-network', t('onboarding.choice.partner'), t('onboarding.choice.partnerHint')],
  ] as const;

  return (
    <AuthShell
      footer={
        <View style={styles.footerActions}>
          <ActionButton accessibilityLabel={t('onboarding.primaryCta')} label={t('onboarding.primaryCta')} onPress={() => router.push('/auth/register')} tone="brand" />
          <ActionButton accessibilityLabel={t('onboarding.secondaryCta')} label={t('onboarding.secondaryCta')} onPress={() => router.push('/auth')} tone="neutral" />
        </View>
      }
      kicker={t('onboarding.kicker')}
      step={t('onboarding.stepLabel')}
      subtitle={t('onboarding.subtitle')}
      title={t('onboarding.title')}>
      <View style={StyleSheet.flatten([styles.heroPanel, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
        <View style={styles.heroRow}>
          <View style={StyleSheet.flatten([styles.heroIcon, { backgroundColor: palette.text, borderColor: palette.text }])}>
            <PhosphorIcon color={palette.panel} name="globe" size={19} />
          </View>
          <View style={styles.flex}>
            <AppText variant="subtitle">{t('onboarding.heroTitle')}</AppText>
            <AppText numberOfLines={3} tone="muted" variant="caption">
              {t('onboarding.heroBody')}
            </AppText>
          </View>
        </View>
        <View style={styles.stepRail}>
          {steps.map(([icon, title, hint], index) => (
            <View key={title} style={styles.stepRow}>
              <View style={StyleSheet.flatten([styles.stepIndex, { backgroundColor: index === 0 ? palette.brand : palette.panelSoft, borderColor: index === 0 ? palette.brand : palette.lineSoft }])}>
                <PhosphorIcon color={index === 0 ? palette.white : palette.textDim} name={icon as PhosphorIconName} size={13} />
              </View>
              <View style={styles.flex}>
                <AppText variant="body">{title}</AppText>
                <AppText numberOfLines={2} tone="muted" variant="caption">
                  {hint}
                </AppText>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={StyleSheet.flatten([styles.activationPanel, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
        <View style={styles.activationHeader}>
          <View style={styles.flex}>
            <AppText variant="subtitle">{locale === 'en-US' ? 'First-week activation' : '首周激活路径'}</AppText>
            <AppText tone="muted" variant="caption">
              {locale === 'en-US' ? 'A guided path from demo account to first order.' : '从模拟账户到首笔订单的引导路径。'}
            </AppText>
          </View>
          <ActionButton
            label={locale === 'en-US' ? 'Start' : '开始'}
            onPress={() => router.push('/auth/register')}
            style={styles.smallButton}
            tone="brand"
          />
        </View>
        <View style={styles.activationSteps}>
          {dupoinOnboardingSteps.map((step, index) => (
            <View key={step.id} style={styles.activationStepRow}>
              <View style={StyleSheet.flatten([styles.activationStepMark, { backgroundColor: index < 2 ? palette.down : palette.brand }])}>
                <AppText style={{ color: palette.white }} variant="eyebrow">
                  {index + 1}
                </AppText>
              </View>
              <View style={styles.flex}>
                <AppText variant="body">{localizeText(step.label, locale)}</AppText>
                <AppText tone={index < 2 ? 'down' : 'brand'} variant="caption">
                  {localizeText(step.state, locale)}
                </AppText>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.choiceGrid}>
        {quickChoices.map(([icon, title, hint]) => (
          <NativePressable
            accessibilityRole="button"
            key={title}
            minTouch={88}
            onPress={() => {
              void impactLight();
              router.push('/auth/register');
            }}
            style={StyleSheet.flatten([styles.choiceCard, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
            <View style={StyleSheet.flatten([styles.choiceIcon, { backgroundColor: `${palette.brand}12`, borderColor: `${palette.brand}55` }])}>
              <PhosphorIcon color={palette.brand} name={icon as PhosphorIconName} size={15} />
            </View>
            <AppText variant="body">{title}</AppText>
            <AppText numberOfLines={3} tone="muted" variant="caption">
              {hint}
            </AppText>
          </NativePressable>
        ))}
      </View>

      <View style={StyleSheet.flatten([styles.notice, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
        <PhosphorIcon color={palette.textMuted} name="info" size={15} />
        <AppText numberOfLines={3} tone="muted" variant="caption">
          {t('onboarding.notice')}
        </AppText>
      </View>

      <View style={styles.centerLink}>
        <AuthLink label={t('onboarding.forgotPassword')} onPress={() => router.push('/auth/forgot-password')} />
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  activationHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  activationPanel: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
    padding: 14,
  },
  activationStepMark: {
    alignItems: 'center',
    borderRadius: 999,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  activationStepRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  activationSteps: {
    gap: 11,
  },
  centerLink: {
    alignItems: 'center',
  },
  choiceCard: {
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    gap: 8,
    minWidth: 0,
    padding: 12,
  },
  choiceGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  choiceIcon: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  flex: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  footerActions: {
    gap: 10,
  },
  heroIcon: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  heroPanel: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
    padding: 14,
  },
  heroRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  notice: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  smallButton: {
    minHeight: 36,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  stepIndex: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  stepRail: {
    gap: 12,
  },
  stepRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
});
