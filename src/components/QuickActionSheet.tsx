import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useToast } from '@/src/feedback/Toast';
import { impactLight, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';

import { NativePressable } from './NativePressable';
import { AppText } from './Typography';

type QuickActionSheetProps = {
  onClose: () => void;
  open: boolean;
};

export function QuickActionSheet({ onClose, open }: QuickActionSheetProps) {
  const { instruments, role, setRole, submitUpgradeRequest, upgradeRequest } = useBroker();
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
  const actions = [
    {
      icon: 'exchange',
      label: t('quick.trade'),
      onPress: () => {
        if (requireSignedIn()) {
          router.push(`/order/${anchor.id}?direction=buy`);
          onClose();
        }
      },
      tone: palette.up,
    },
    {
      icon: 'line-chart',
      label: t('quick.markets'),
      onPress: () => {
        router.push('/markets');
        onClose();
      },
      tone: palette.brand,
    },
    {
      icon: 'bank',
      label: t('quick.deposit'),
      onPress: () => {
        router.push('/accounts');
        onClose();
      },
      tone: palette.blue,
    },
    {
      icon: 'share-alt',
      label: t('quick.referral'),
      onPress: () => {
        if (authStatus === 'signedIn') {
          setRole('partner');
          router.push('/discover');
          onClose();
          return;
        }

        requireSignedIn();
      },
      tone: palette.amber,
    },
    {
      icon: 'comments-o',
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
      icon: 'headphones',
      label: t('quick.support'),
      onPress: () => {
        void impactLight();
        toast.show({ message: t('top.placeholderMessage'), title: t('top.placeholderTitle', { action: t('top.support') }) });
        onClose();
      },
      tone: palette.textMuted,
    },
    {
      icon: 'refresh',
      label: t('quick.switchRole'),
      onPress: () => {
        setRole(role === 'trader' ? 'partner' : 'trader');
        void impactLight();
        toast.show({ title: role === 'trader' ? t('role.partner') : t('role.trader'), message: t('quick.switchRoleDone') });
        onClose();
      },
      tone: palette.cyan,
    },
  ];

  if (!open) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.host}>
      <NativePressable accessibilityLabel={t('common.cancel')} onPress={onClose} style={styles.scrim} />
      <SafeAreaView edges={['bottom']} style={StyleSheet.flatten([styles.sheet, { backgroundColor: palette.panelHigh, borderColor: palette.lineSoft }])}>
        <View style={styles.handleWrap}>
          <View style={StyleSheet.flatten([styles.handle, { backgroundColor: palette.line }])} />
        </View>
        <View style={styles.sheetHead}>
          <View>
            <AppText tone="dim" variant="eyebrow">
              {t('tabs.quick')}
            </AppText>
            <AppText variant="subtitle">{t('quick.title')}</AppText>
          </View>
          <NativePressable accessibilityLabel={t('common.cancel')} minTouch={44} onPress={onClose} style={styles.closeButton}>
            <FontAwesome color={palette.textMuted} name="close" size={16} />
          </NativePressable>
        </View>
        <View style={styles.actionGrid}>
          {actions.map((action) => (
            <NativePressable
              accessibilityRole="button"
              key={action.label}
              minTouch={64}
              onPress={action.onPress}
              style={StyleSheet.flatten([styles.actionItem, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
              <View style={StyleSheet.flatten([styles.actionIcon, { backgroundColor: `${action.tone}12`, borderColor: `${action.tone}55` }])}>
                <FontAwesome color={action.tone} name={action.icon as React.ComponentProps<typeof FontAwesome>['name']} size={17} />
              </View>
              <AppText adjustsFontSizeToFit numberOfLines={1} variant="caption">
                {action.label}
              </AppText>
            </NativePressable>
          ))}
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
    borderRadius: 999,
    borderWidth: 1,
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
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
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
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 70,
  },
  scrim: {
    backgroundColor: 'rgba(0,0,0,0.18)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    bottom: 0,
    left: 0,
    paddingBottom: 8,
    paddingTop: 0,
    position: 'absolute',
    right: 0,
  },
  sheetHead: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
});
