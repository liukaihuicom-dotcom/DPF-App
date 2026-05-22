import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { ActionButton } from '@/src/components/ActionButton';
import { AppIcon } from '@/src/components/AppIcon';
import { NativePressable } from '@/src/components/NativePressable';
import { AppText } from '@/src/components/Typography';
import { useToast } from '@/src/feedback/Toast';
import { notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { layout, radius, spacing } from '@/src/theme/tokens';

export default function LaunchScreen() {
  const { palette, t } = useProductSettings();
  const toast = useToast();

  const showUnavailableToast = () => {
    void notifyWarning();
    toast.show({ message: t('top.placeholderMessage'), title: t('auth.socialUnavailable'), tone: 'warning' });
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={StyleSheet.flatten([styles.safe, { backgroundColor: palette.panelHigh }])}>
      <View style={styles.screen}>
        <View style={StyleSheet.flatten([styles.progressTrack, { backgroundColor: palette.text }])} />

        <View style={styles.visualStage}>
          <View style={StyleSheet.flatten([styles.brandHalo, { backgroundColor: palette.launch }])}>
            <Svg accessibilityLabel="Dupoin" height="76" viewBox="0 0 96 96" width="76">
              <Path d="M18 30 H68 L48 82 H34 L49 44 H30 L38 57 L28 69 H12 L27 50 Z" fill={palette.text} />
            </Svg>
          </View>
        </View>

        <View style={styles.content}>
          <AppText adjustsFontSizeToFit maxFontSizeMultiplier={1.08} minimumFontScale={0.72} numberOfLines={3} style={styles.title} variant="quote">
            {t('launch.title')}
          </AppText>
          <AppText numberOfLines={2} style={styles.subtitle} tone="muted" variant="caption">
            {t('launch.subtitle')}
          </AppText>
        </View>

        <View style={styles.actions}>
          <View style={styles.primaryRow}>
            <ActionButton label={t('launch.login')} onPress={() => router.push('/auth')} style={styles.rowButton} tone="brand" />
            <ActionButton label={t('launch.register')} onPress={() => router.push('/auth/register')} style={styles.rowButton} tone="brand" />
          </View>

          <NativePressable
            accessibilityLabel={t('auth.apple')}
            accessibilityRole="button"
            minTouch={52}
            onPress={showUnavailableToast}
            style={StyleSheet.flatten([styles.appleButton, { backgroundColor: palette.text }])}>
            <AppIcon color={palette.panel} name="appApple" size={18} />
            <AppText numberOfLines={1} style={{ color: palette.panel }} variant="subtitle">
              {t('auth.apple')}
            </AppText>
          </NativePressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.md,
    width: '100%',
  },
  appleButton: {
    alignItems: 'center',
    borderRadius: radius.full,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },
  brandHalo: {
    alignItems: 'center',
    aspectRatio: 1,
    borderRadius: radius.full,
    justifyContent: 'center',
    width: '58%',
  },
  content: {
    alignItems: 'center',
    gap: spacing.sm,
    width: '100%',
  },
  primaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  progressTrack: {
    borderRadius: radius.full,
    height: 5,
    marginTop: spacing.lg,
    width: '94%',
  },
  rowButton: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  screen: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: spacing.xl,
    paddingHorizontal: layout.screenPaddingX + spacing.lg,
  },
  subtitle: {
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  visualStage: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    maxHeight: 360,
    minHeight: 260,
    width: '100%',
  },
});
