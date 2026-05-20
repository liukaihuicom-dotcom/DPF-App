import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useToast } from '@/src/feedback/Toast';
import { impactLight } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';

import { NativePressable } from './NativePressable';
import { AppText } from './Typography';

export type AppTopBarAction = {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  onPress?: () => void;
};

type AppTopBarProps = {
  actions?: AppTopBarAction[];
  align?: 'left' | 'center';
  back?: boolean;
  subtitle?: string;
  title: string;
};

export function AppTopBar({ actions, align = 'left', back, subtitle, title }: AppTopBarProps) {
  const { palette, t } = useProductSettings();
  const toast = useToast();
  const showPlaceholder = (label: string) => {
    void impactLight();
    toast.show({
      message: t('top.placeholderMessage'),
      title: t('top.placeholderTitle', { action: label }),
    });
  };
  const resolvedActions =
    actions ??
    (back
      ? [{ icon: 'ellipsis-h', label: t('top.more'), onPress: () => showPlaceholder(t('top.more')) }]
      : [
          { icon: 'search', label: t('top.search'), onPress: () => showPlaceholder(t('top.search')) },
          { icon: 'bell-o', label: t('top.notifications'), onPress: () => showPlaceholder(t('top.notifications')) },
          { icon: 'headphones', label: t('top.support'), onPress: () => showPlaceholder(t('top.support')) },
        ]);

  return (
    <View style={StyleSheet.flatten([styles.bar, { backgroundColor: palette.panelHigh, borderBottomColor: palette.lineSoft }])}>
      <View style={styles.side}>
        {back ? (
          <NativePressable
            accessibilityLabel={t('top.back')}
            accessibilityRole="button"
            minTouch={44}
            onPress={() => {
              void impactLight();
              router.back();
            }}
            style={StyleSheet.flatten([
              styles.iconButton,
              { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft },
            ])}>
            <FontAwesome color={palette.text} name="angle-left" size={22} />
          </NativePressable>
        ) : null}
      </View>

      <View style={StyleSheet.flatten([styles.titleWrap, align === 'center' && styles.titleCenter])}>
        <AppText adjustsFontSizeToFit numberOfLines={1} style={styles.navTitle} variant="subtitle">
          {title}
        </AppText>
        {subtitle ? (
          <AppText numberOfLines={1} tone="muted" variant="caption">
            {subtitle}
          </AppText>
        ) : null}
      </View>

      <View style={StyleSheet.flatten([styles.actions, back && styles.side])}>
        {resolvedActions.slice(0, back ? 1 : 3).map((action) => (
          <NativePressable
            accessibilityLabel={action.label}
            accessibilityRole="button"
            key={`${action.icon}-${action.label}`}
            minTouch={44}
            onPress={action.onPress ?? (() => showPlaceholder(action.label))}
            style={StyleSheet.flatten([
              styles.iconButton,
              { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft },
            ])}>
            <FontAwesome color={action.icon === 'search' ? palette.text : palette.textMuted} name={action.icon} size={16} />
          </NativePressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    minWidth: 132,
  },
  bar: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 60,
    paddingBottom: 9,
    paddingHorizontal: 16,
    paddingTop: 7,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  navTitle: {
    lineHeight: 20,
  },
  side: {
    minWidth: 42,
  },
  titleCenter: {
    alignItems: 'center',
  },
  titleWrap: {
    flex: 1,
    gap: 1,
    minWidth: 0,
  },
});
