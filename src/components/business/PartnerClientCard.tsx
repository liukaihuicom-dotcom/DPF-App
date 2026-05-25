import { StyleSheet, View } from 'react-native';

import { formatMoney, formatVolumeMillions, localizeText, statusLabel } from '@/src/domain/format';
import type { PartnerClient } from '@/src/domain/types';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { lineWidth, radius, size, spacing } from '@/src/theme/tokens';

import { ActionButton } from '../ActionButton';
import { Card } from '../Card';
import { Metric } from '../Metric';
import { StatusPill, type StatusPillTone } from '../StatusPill';
import { AppText } from '../Typography';

type PartnerClientCardProps = {
  client: PartnerClient;
  onOpenProfile: () => void;
};

export function PartnerClientCard({ client, onOpenProfile }: PartnerClientCardProps) {
  const { locale, t, colors } = useProductSettings();
  const activityTone: StatusPillTone = client.status === 'active' ? 'success' : client.status === 'funded' ? 'info' : 'neutral';
  const upgradeTone: StatusPillTone =
    client.upgradeStatus === 'approved' ? 'success' : client.upgradeStatus === 'pending' ? 'warning' : client.upgradeStatus === 'rejected' ? 'danger' : 'neutral';
  const roleTone: StatusPillTone = client.role === 'partner' ? 'brand' : 'neutral';

  return (
    <Card compact style={StyleSheet.flatten([styles.card, { borderColor: colors.border.subtle }])}>
      <View style={styles.header}>
        <View style={styles.identity}>
          <AppText numberOfLines={1} variant="subtitle">
            {client.name}
          </AppText>
          <AppText numberOfLines={1} tone="muted" variant="caption">
            {client.country} · {client.joinedAt} · {localizeText(client.lastActive, locale)}
          </AppText>
        </View>
        <View style={styles.statusStack}>
          <StatusPill compact label={statusLabel(client.status, locale)} tone={activityTone} />
          {client.upgradeStatus !== 'none' ? <StatusPill compact label={t(`upgrade.status.${client.upgradeStatus}`)} tone={upgradeTone} /> : null}
        </View>
      </View>

      <View style={StyleSheet.flatten([styles.roleRow, { backgroundColor: colors.surface.subtle }])}>
        <StatusPill compact label={client.role === 'partner' ? t('role.partner') : t('role.trader')} tone={roleTone} variant="outline" />
        <AppText numberOfLines={1} tone="muted" variant="caption">
          {t('partner.clientMeta', { active: localizeText(client.lastActive, locale), date: client.joinedAt })}
        </AppText>
      </View>

      <View style={styles.metrics}>
        <Metric label={t('partner.netDeposit')} value={formatMoney(client.netDeposit, 'USD', 2, locale)} />
        <Metric label={t('partner.monthVolume')} value={formatVolumeMillions(client.monthlyVolume, locale)} />
        <Metric label={t('partner.openPositions')} value={`${client.openPositions}`} />
      </View>

      <ActionButton
        accessibilityLabel={t('upgrade.viewProfile')}
        icon="icon.system.chevron_right"
        label={t('upgrade.viewProfile')}
        onPress={onOpenProfile}
        style={styles.profileAction}
        tone={client.upgradeStatus === 'pending' ? 'amber' : 'neutral'}
        variant="outline"
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: lineWidth.hairline,
    gap: spacing.md,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  identity: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  profileAction: {
    minHeight: size.control.sm,
  },
  roleRow: {
    alignItems: 'center',
    borderRadius: radius.sm,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: size.control.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  statusStack: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
});
