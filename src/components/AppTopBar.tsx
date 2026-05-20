import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useToast } from '@/src/feedback/Toast';
import { impactLight } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';

import { NativePressable } from './NativePressable';
import { PhosphorIcon, type PhosphorIconName } from './PhosphorIcon';
import { AppText } from './Typography';

export type AppTopBarAction = {
  icon: PhosphorIconName;
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
      ? [{ icon: 'dots-three', label: t('top.more'), onPress: () => showPlaceholder(t('top.more')) }]
      : [
          { icon: 'magnifying-glass', label: t('top.search'), onPress: () => showPlaceholder(t('top.search')) },
          { icon: 'bell', label: t('top.notifications'), onPress: () => showPlaceholder(t('top.notifications')) },
          { icon: 'headphones', label: t('top.support'), onPress: () => showPlaceholder(t('top.support')) },
        ]);

  return (
    <View
      style={StyleSheet.flatten([
        styles.bar,
        back ? { backgroundColor: palette.panelHigh, borderBottomColor: palette.lineSoft } : { backgroundColor: palette.bg, borderBottomColor: 'transparent' },
        !back && styles.rootBar,
      ])}>
      <View style={back ? styles.side : styles.rootSide}>
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
            <PhosphorIcon color={palette.text} name="caret-left" size={22} />
          </NativePressable>
        ) : null}
      </View>

      <View style={StyleSheet.flatten([styles.titleWrap, align === 'center' && styles.titleCenter, !back && styles.rootTitleWrap])}>
        <AppText adjustsFontSizeToFit numberOfLines={1} style={back ? styles.navTitle : styles.rootNavTitle} variant={back ? 'subtitle' : 'title'}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText numberOfLines={1} tone="muted" variant="caption">
            {subtitle}
          </AppText>
        ) : null}
      </View>

      <View style={StyleSheet.flatten([styles.actions, back && styles.side, !back && styles.rootActions])}>
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
            <PhosphorIcon color={action.icon === 'magnifying-glass' ? palette.text : palette.textMuted} name={action.icon} size={16} />
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
    lineHeight: 21,
  },
  rootNavTitle: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
  },
  side: {
    minWidth: 42,
  },
  rootActions: {
    minWidth: 150,
  },
  rootBar: {
    borderBottomWidth: 0,
    minHeight: 84,
    paddingBottom: 10,
    paddingTop: 18,
  },
  rootSide: {
    display: 'none',
  },
  rootTitleWrap: {
    alignItems: 'flex-start',
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
