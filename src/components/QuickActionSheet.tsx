import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useToast } from '@/src/feedback/Toast';
import { impactLight, notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';

import { NativePressable } from './NativePressable';
import { AppIcon, type AppIconName } from './AppIcon';
import { HeaderIconButton } from './HeaderIconButton';
import { AppText } from './Typography';

type QuickActionSheetProps = {
  onClose: () => void;
  open: boolean;
};

export function QuickActionSheet({ onClose, open }: QuickActionSheetProps) {
  const { instruments, role, submitUpgradeRequest, upgradeRequest } = useBroker();
  const { authStatus, palette, t } = useProductSettings();
  const toast = useToast();
  const anchor = instruments.find((instrument) => instrument.symbol === 'EUR/USD') ?? instruments[0];
  const requireSignedIn = () => {
    if (authStatus === 'signedIn') {
      return true;
    }

    void notifyWarning();
    toast.show({ message: t('auth.traderLocked'), title: t('auth.lockedToastTitle'), tone: 'warning' });
    router.push('/auth');
    onClose();
    return false;
  };
  const runPartnerFlow = () => {
    if (!requireSignedIn()) {
      return;
    }

    if (role === 'partner' || upgradeRequest.status === 'approved') {
      void impactLight();
      router.push('/partner-tools');
      onClose();
      return;
    }

    if (upgradeRequest.status === 'pending') {
      void notifyWarning();
      toast.show({ message: t('upgrade.pendingHint'), title: t('upgrade.status.pending'), tone: 'warning' });
      router.push('/accounts');
      onClose();
      return;
    }

    submitUpgradeRequest(t('upgrade.defaultReason'));
    void notifySuccess();
    toast.show({ message: t('upgrade.pendingHint'), title: t('upgrade.submitted'), tone: 'success' });
    router.push('/accounts');
    onClose();
  };
  const partnerLabel =
    role === 'partner' || upgradeRequest.status === 'approved'
      ? t('control.simulator.action.partnerOpen')
      : upgradeRequest.status === 'pending'
        ? t('control.simulator.action.partnerStatus')
        : t('control.simulator.action.partnerApply');
  const actions: {
    icon: AppIconName;
    label: string;
    onPress: () => void;
    tone: string;
  }[] = [
    {
      icon: 'transferSwitch',
      label: t('quick.trade'),
      onPress: () => {
        if (requireSignedIn()) {
          router.push(`/order/${anchor.id}?direction=buy` as never);
          onClose();
        }
      },
      tone: palette.up,
    },
    {
      icon: 'marketTrend',
      label: t('quick.markets'),
      onPress: () => {
        router.push('/markets');
        onClose();
      },
      tone: palette.brand,
    },
    {
      icon: 'accountBank',
      label: t('quick.deposit'),
      onPress: () => {
        router.push('/accounts');
        onClose();
      },
      tone: palette.blue,
    },
    {
      icon: 'partnerNetwork',
      label: partnerLabel,
      onPress: runPartnerFlow,
      tone: palette.amber,
    },
    {
      icon: 'communityChat',
      label: t('upgrade.applyShort'),
      onPress: () => {
        if (!requireSignedIn()) {
          return;
        }

        if (upgradeRequest.status === 'none' || upgradeRequest.status === 'rejected') {
          submitUpgradeRequest(t('upgrade.defaultReason'));
          toast.show({ message: t('upgrade.pendingHint'), title: t('upgrade.submitted'), tone: 'success' });
        } else if (upgradeRequest.status === 'pending') {
          toast.show({ message: t('upgrade.pendingHint'), title: t('upgrade.status.pending'), tone: 'warning' });
        } else {
          toast.show({ message: t('upgrade.approvedMessage', { name: upgradeRequest.applicantName }), title: t('upgrade.status.approved'), tone: 'success' });
        }
        router.push('/accounts');
        onClose();
      },
      tone: palette.cyan,
    },
    {
      icon: 'supportHeadset',
      label: t('quick.support'),
      onPress: () => {
        void impactLight();
        toast.show({ message: t('top.placeholderMessage'), title: t('top.placeholderTitle', { action: t('top.support') }) });
        onClose();
      },
      tone: palette.textMuted,
    },
  ];

  if (!open) {
    return null;
  }

  return (
    <View style={styles.host}>
      <NativePressable accessibilityLabel={t('common.cancel')} onPress={onClose} style={StyleSheet.flatten([styles.scrim, { backgroundColor: `${palette.bg}CC` }])} />
      <SafeAreaView edges={['bottom']} style={StyleSheet.flatten([styles.sheet, { backgroundColor: palette.panelHigh, borderColor: palette.lineSoft }])}>
        <View style={styles.handleWrap}>
          <View style={StyleSheet.flatten([styles.handle, { backgroundColor: palette.line }])} />
        </View>
        <View style={StyleSheet.flatten([styles.sheetHead, { borderBottomColor: palette.lineSoft }])}>
          <View>
            <AppText tone="dim" variant="eyebrow">
              {t('tabs.quick')}
            </AppText>
            <AppText variant="subtitle">{t('quick.title')}</AppText>
          </View>
          <HeaderIconButton accessibilityLabel={t('common.cancel')} icon="closeX" onPress={onClose} />
        </View>
        <View style={styles.sheetContent}>
          <View style={styles.actionGrid}>
          {actions.map((action) => (
            <NativePressable
              accessibilityRole="button"
              key={action.label}
              minTouch={64}
              onPress={action.onPress}
              style={StyleSheet.flatten([styles.actionItem, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
              <View style={styles.actionIcon}>
                <AppIcon color={action.tone} name={action.icon} size={17} />
              </View>
              <AppText adjustsFontSizeToFit numberOfLines={1} variant="caption">
                {action.label}
              </AppText>
            </NativePressable>
          ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  actionIcon: {
    alignItems: 'center',
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  actionItem: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    flexBasis: '30%',
    flexGrow: 1,
    gap: 7,
    minWidth: 88,
    padding: 10,
  },
  handle: {
    borderRadius: 999,
    height: 4,
    width: 38,
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: 8,
  },
  host: {
    bottom: 0,
    left: 0,
    pointerEvents: 'box-none',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 70,
  },
  scrim: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    paddingBottom: 8,
    paddingTop: 0,
    position: 'absolute',
    right: 0,
  },
  sheetHead: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 62,
    paddingBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  sheetContent: {
    minHeight: 194,
    paddingBottom: 12,
  },
});
