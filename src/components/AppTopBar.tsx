import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useToast } from '@/src/feedback/Toast';
import { impactLight } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { typography } from '@/src/theme/tokens';

import { type AppIconName } from './AppIcon';
import { HeaderIconButton, HeaderIconSlot } from './HeaderIconButton';
import { AppText } from './Typography';

export type AppTopBarAction = {
  icon: AppIconName;
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
      ? [{ icon: 'moreDots', label: t('top.more'), onPress: () => showPlaceholder(t('top.more')) }]
      : [
          { icon: 'searchGlass', label: t('top.search'), onPress: () => showPlaceholder(t('top.search')) },
          { icon: 'notificationBell', label: t('top.notifications'), onPress: () => showPlaceholder(t('top.notifications')) },
          { icon: 'supportHeadset', label: t('top.support'), onPress: () => showPlaceholder(t('top.support')) },
        ]);

  return (
    <View
      style={StyleSheet.flatten([
        styles.bar,
        { backgroundColor: palette.bg, borderBottomColor: 'transparent' },
        back && styles.backBar,
        !back && styles.rootBar,
      ])}>
      <HeaderIconSlot style={back ? styles.side : styles.rootSide}>
        {back ? (
          <HeaderIconButton
            accessibilityLabel={t('top.back')}
            color={palette.text}
            icon="navigateBack"
            onPress={() => {
              void impactLight();
              router.back();
            }}
            tone="default"
          />
        ) : null}
      </HeaderIconSlot>

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
          <HeaderIconButton
            accessibilityLabel={action.label}
            color={action.icon === 'searchGlass' ? palette.text : palette.textMuted}
            icon={action.icon}
            key={`${action.icon}-${action.label}`}
            onPress={action.onPress ?? (() => showPlaceholder(action.label))}
            tone={action.icon === 'searchGlass' ? 'default' : 'muted'}
          />
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
  navTitle: {
    ...typography.titleMd,
  },
  rootNavTitle: {
    ...typography.displayXl,
  },
  side: {
    minWidth: 40,
  },
  rootActions: {
    minWidth: 150,
  },
  rootBar: {
    borderBottomWidth: 0,
    minHeight: 64,
    paddingBottom: 6,
    paddingTop: 8,
  },
  backBar: {
    borderBottomWidth: 0,
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
