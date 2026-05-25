import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon, type IconTone } from '@/src/components/AppIcon';
import { AppText } from '@/src/components/Typography';
import type { AppIconName } from '@/src/icons/iconRegistry';
import { useThemeColors } from '@/src/settings/ProductSettings';
import { shadows } from '@/src/theme/colors';
import { lineWidth, radius, size, spacing } from '@/src/theme/tokens';

export type FeedbackToastTone = 'danger' | 'default' | 'success' | 'warning';
export type FeedbackToastVariant = 'title' | 'body';

export type FeedbackToastProps = {
  dismissible?: boolean;
  dismissLabel: string;
  message?: string;
  onDismiss: () => void;
  title: string;
  tone?: FeedbackToastTone;
  variant?: FeedbackToastVariant;
};

export function FeedbackToast({ dismissible = true, dismissLabel, message, onDismiss, title, tone = 'default', variant }: FeedbackToastProps) {
  const colors = useThemeColors();
  const toneConfig = getToastToneConfig(tone);
  const resolvedVariant: FeedbackToastVariant = variant ?? (message ? 'body' : 'title');

  return (
    <View accessibilityRole="alert" style={StyleSheet.flatten([styles.toast, { backgroundColor: colors.toast.bg, borderColor: colors.border.subtle, borderWidth: lineWidth.hairline }, shadows.toast])}>
      <AppIcon
        name={toneConfig.icon}
        sizeVariant="lg"
        style={styles.badge}
        tone={toneConfig.iconTone}
      />
      <View style={styles.copy}>
        <AppText tone="white" variant="body.prominent">
          {title}
        </AppText>
        {resolvedVariant === 'body' && message ? (
          <AppText style={styles.message} tone="panelMuted" variant="label.helper">
            {message}
          </AppText>
        ) : null}
      </View>
      <View style={styles.closeSlot}>
        {dismissible ? (
          <Pressable
            accessibilityLabel={dismissLabel}
            accessibilityRole="button"
            hitSlop={spacing.sm}
            onPress={onDismiss}
            style={styles.closeButton}>
            <AppIcon name="icon.system.close" sizeVariant="sm" tone="white" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function getToastToneConfig(tone: FeedbackToastTone): { icon: AppIconName; iconTone: IconTone } {
  if (tone === 'success') {
    return { icon: 'icon.status.check', iconTone: 'success' };
  }

  if (tone === 'danger') {
    return { icon: 'icon.status.rejected', iconTone: 'danger' };
  }

  if (tone === 'warning') {
    return { icon: 'icon.risk.info', iconTone: 'warning' };
  }

  return { icon: 'icon.risk.info', iconTone: 'white' };
}

const styles = StyleSheet.create({
  badge: {
    flexShrink: 0,
    height: size.icon.lg,
    width: size.icon.lg,
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: radius.full,
    height: size.control.xs,
    justifyContent: 'center',
    width: size.control.xs,
  },
  closeSlot: {
    flexShrink: 0,
    height: size.control.xs,
    width: size.control.xs,
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
  message: {
    flexShrink: 1,
  },
  toast: {
    alignItems: 'center',
    borderRadius: radius.xl,
    flexDirection: 'row',
    gap: spacing.sm,
    maxWidth: size.viewport.toastMaxWidth,
    minHeight: size.surface.toastMinHeight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    width: '100%',
  },
});
